"use client";

// === Type ===
type StoryType = "text" | "image" | "video" | null;

interface UploadedMedia {
  file: File;
  preview: string;
}

interface UploadedAudio {
  file: File;
  preview: string;
  duration: number;
  trimStart: number;
  trimEnd: number;
}

type CreateDataContextType = {
  type: StoryType;
  font: (typeof Font)[number];
  textContent: string;
  selectedBackground: StoryBackground;
  privacy: ContentPrivacy;
  uploadedMedia: UploadedMedia | null;
  uploadedAudio: UploadedAudio | null;
  hasContent: boolean;

  setType: (type: StoryType) => void;
  setFont: (font: (typeof Font)[number]) => void;
  setTextContent: (content: string) => void;
  setSelectedBackground: (background: StoryBackground) => void;
  setPrivacy: (privacy: ContentPrivacy) => void;
  uploadMedia: (file: File) => void;
  uploadAudio: (file: File) => void;
  trimAudio: (trimStart: number, trimEnd: number) => void;
  removeAudio: () => void;
  uploadStory: (exportCanvas?: () => string | null) => Promise<void>;
  reset: () => void;
};

// === Provider ===
import { useRouter } from "next/navigation";
import { createContext, use, useState } from "react";
import { useCloudinary, useRefreshApi } from "@/components/providers";
import { toast } from "sonner";
import { CoreApi } from "@/services";
import { Font } from "../_constants";
import { ContentPrivacy, StoryBackground } from "@/constants/server";
import { ROUTE } from "@/constants/route";
import { trimAudioFile } from "../_utilities";

const CreateDataContext = createContext<CreateDataContextType>({
  type: null,
  font: Font[0],
  textContent: "",
  selectedBackground: StoryBackground.BLUE_GRADIENT,
  privacy: ContentPrivacy.FOLLOWERS,
  uploadedMedia: null,
  uploadedAudio: null,
  hasContent: false,

  setType: () => {},
  setFont: () => {},
  setSelectedBackground: () => {},
  setPrivacy: () => {},
  uploadMedia: () => {},
  uploadAudio: () => {},
  trimAudio: () => {},
  removeAudio: () => {},
  setTextContent: () => {},
  uploadStory: async () => {},
  reset: () => {},
});

export const useCreateData = () => use(CreateDataContext);

type CreateDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function CreateDataProvider({
  children,
}: CreateDataProviderProps) {
  const [type, setType] = useState<StoryType>(null);
  const [font, setFont] = useState<(typeof Font)[number]>(Font[0]);
  const [textContent, setTextContent] = useState("");
  const [selectedBackground, setSelectedBackground] = useState<StoryBackground>(
    StoryBackground.BLUE_GRADIENT
  );
  const [privacy, setPrivacy] = useState<ContentPrivacy>(
    ContentPrivacy.FOLLOWERS
  );
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia | null>(
    null
  );
  const [uploadedAudio, setUploadedAudio] = useState<UploadedAudio | null>(
    null
  );

  const hasContent =
    type !== null ||
    textContent.trim() !== "" ||
    uploadedMedia !== null ||
    uploadedAudio !== null;

  const { uploadImage } = useCloudinary();
  const addStoryApi = useRefreshApi(CoreApi.createStory);

  async function uploadStory(exportCanvas?: () => string | null) {
    let soundAttachment: string | undefined;
    if (uploadedAudio) {
      try {
        const trimmedFile = await trimAudioFile(
          uploadedAudio.file,
          uploadedAudio.trimStart,
          uploadedAudio.trimEnd
        );

        const uploadResult = await uploadImage(trimmedFile);

        if (!uploadResult.success || !uploadResult.data) {
          toast.error("Unable to upload audio. Please try again.");
          return;
        }

        soundAttachment = uploadResult.data[0].public_id;
      } catch (error) {
        console.error("Audio upload error:", error);
        toast.error("Failed to upload audio. Please try again.");
        return;
      }
    }

    if (type === "text") {
      if (!textContent) {
        toast.error("Please add text content.");
        return;
      }

      const data = {
        text: textContent,
        background: selectedBackground,
        font: font.value,
        privacy,
        sound: soundAttachment,
      };

      const { success, message } = await addStoryApi(data);

      if (success) back();
      else toast.error(message ?? "Unable to upload story.");
    } else if (type === "image") {
      if (!exportCanvas) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      try {
        const dataUrl = exportCanvas();
        if (!dataUrl) {
          toast.error("Something went wrong. Please try again.");
          return;
        }

        // Convert data URL to File
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "story-image.png", { type: "image/png" });

        const uploadResult = await uploadImage(file, "stories");

        if (!uploadResult.success || !uploadResult.data) {
          toast.error("Unable to upload image. Please try again.");
          return;
        }

        const data = {
          attachment: {
            id: uploadResult.data[0].public_id,
            type: uploadResult.data[0].type,
          },
          privacy,
          sound: soundAttachment,
        };

        const { success, message } = await addStoryApi(data);

        if (success) back();
        else toast.error(message ?? "Unable to upload story.");
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    } else if (type === "video") {
      if (!uploadedMedia?.file) {
        toast.error("No media file to upload.");
        return;
      }

      try {
        const uploadResult = await uploadImage(uploadedMedia.file, "stories");

        if (!uploadResult.success || !uploadResult.data) {
          toast.error("Unable to upload video. Please try again.");
          return;
        }

        const data = {
          attachment: {
            id: uploadResult.data[0].public_id,
            type: uploadResult.data[0].type,
          },
          privacy,
          sound: soundAttachment,
        };

        const { success, message } = await addStoryApi(data);

        if (success) back();
        else toast.error(message ?? "Unable to upload story.");
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  function uploadMedia(file: File) {
    const url = URL.createObjectURL(file);
    setUploadedMedia({ file, preview: url });
  }

  function uploadAudio(file: File) {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);

    audio.addEventListener("loadedmetadata", () => {
      const { duration } = audio;
      setUploadedAudio({
        file,
        preview: url,
        duration,
        trimStart: 0,
        trimEnd: duration,
      });
    });

    audio.load();
  }

  function trimAudio(trimStart: number, trimEnd: number) {
    if (uploadedAudio) {
      setUploadedAudio({
        ...uploadedAudio,
        trimStart,
        trimEnd,
      });
    }
  }

  function removeAudio() {
    if (uploadedAudio?.preview) URL.revokeObjectURL(uploadedAudio.preview);
    setUploadedAudio(null);
  }

  function reset() {
    setType(null);
    setFont(Font[0]);
    setTextContent("");
    setSelectedBackground(StoryBackground.BLUE_GRADIENT);
    setPrivacy(ContentPrivacy.FOLLOWERS);
    setUploadedMedia(null);
    setUploadedAudio(null);
  }

  const router = useRouter();
  function back() {
    if (window.history.length > 1) router.back();
    else router.replace(ROUTE.HOME);
  }

  return (
    <CreateDataContext.Provider
      value={{
        type,
        font,
        textContent,
        selectedBackground,
        privacy,
        uploadedMedia,
        uploadedAudio,
        hasContent,

        setType,
        setFont,
        setTextContent,
        setSelectedBackground,
        setPrivacy,
        uploadMedia,
        uploadAudio,
        trimAudio,
        removeAudio,
        uploadStory,
        reset,
      }}
    >
      {children}
    </CreateDataContext.Provider>
  );
}
