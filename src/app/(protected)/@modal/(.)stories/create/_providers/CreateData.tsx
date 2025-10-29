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
  uploadStory: () => Promise<void>;
  reset: () => void;
};

// === Provider ===
import { createContext, use, useEffect, useState } from "react";
import { useRefreshApi } from "@/components/providers";
import { toast } from "sonner";
import { CoreApi } from "@/services";
import { Font } from "../_constants";
import { ContentPrivacy, StoryBackground } from "@/constants/server";

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

  const addStoryApi = useRefreshApi(CoreApi.createStory);
  async function uploadStory() {
    const { success, message } = await addStoryApi({
      text: textContent || undefined,
      privacy,
    });

    if (success) reset();
    else toast.error(message ?? "Unable to upload story.");
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

  useEffect(() => {
    return () => {
      if (uploadedAudio?.preview) URL.revokeObjectURL(uploadedAudio.preview);
      if (uploadedMedia?.preview) URL.revokeObjectURL(uploadedMedia.preview);
    };
  }, [uploadedAudio?.preview, uploadedMedia?.preview]);

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
