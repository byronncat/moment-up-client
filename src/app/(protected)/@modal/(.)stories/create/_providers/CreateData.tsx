"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { StoryBackground } from "@/constants/server";
import { Font } from "../_constants";

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
  uploadedMedia: UploadedMedia | null;
  uploadedAudio: UploadedAudio | null;
  hasContent: boolean;

  setType: (type: StoryType) => void;
  setFont: (font: (typeof Font)[number]) => void;
  setTextContent: (content: string) => void;
  setSelectedBackground: (background: StoryBackground) => void;
  uploadMedia: (file: File) => void;
  uploadAudio: (file: File) => void;
  trimAudio: (trimStart: number, trimEnd: number) => void;
  removeAudio: () => void;
  reset: () => void;
};

const CreateDataContext = createContext<CreateDataContextType>({
  type: null,
  font: Font[0],
  textContent: "",
  selectedBackground: StoryBackground.BLUE_GRADIENT,
  uploadedMedia: null,
  uploadedAudio: null,
  hasContent: false,

  setType: () => {},
  setFont: () => {},
  setSelectedBackground: () => {},
  uploadMedia: () => {},
  uploadAudio: () => {},
  trimAudio: () => {},
  removeAudio: () => {},
  setTextContent: () => {},
  reset: () => {},
});

export const useCreateData = () => useContext(CreateDataContext);

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

  const uploadMedia = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setUploadedMedia({ file, preview: url });
  }, []);

  const uploadAudio = useCallback((file: File) => {
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
  }, []);

  const trimAudio = useCallback(
    (trimStart: number, trimEnd: number) => {
      if (uploadedAudio) {
        setUploadedAudio({
          ...uploadedAudio,
          trimStart,
          trimEnd,
        });
      }
    },
    [uploadedAudio]
  );

  const removeAudio = useCallback(() => {
    //   if (uploadedAudio?.preview) URL.revokeObjectURL(uploadedAudio.preview);
    //   setUploadedAudio(null);
    // }, [uploadedAudio?.preview]);
  }, []);

  const reset = useCallback(() => {
    setType(null);
    setFont(Font[0]);
    setTextContent("");
    setSelectedBackground(StoryBackground.BLUE_GRADIENT);
    setUploadedMedia(null);
    setUploadedAudio(null);
  }, []);

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
        uploadedMedia,
        uploadedAudio,
        hasContent,

        setType,
        setFont,
        setSelectedBackground,
        uploadMedia,
        uploadAudio,
        trimAudio,
        removeAudio,
        setTextContent,
        reset,
      }}
    >
      {children}
    </CreateDataContext.Provider>
  );
}
