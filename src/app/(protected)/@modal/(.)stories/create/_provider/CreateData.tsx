"use client";

import { createContext, useContext, useState } from "react";
import { StoryBackground } from "@/constants/serverConfig";
import {
  merriweather,
  roboto,
  sourceCodePro,
  yesteryear,
} from "@/styles/fonts";

type StoryType = "text" | "image" | "video" | null;

interface UploadedMedia {
  file: File;
  preview: string;
}

type CreateDataContextType = {
  type: StoryType;
  fontFamily: (typeof fontFamilies)[number];
  selectedBackground: StoryBackground;
  uploadedMedia: UploadedMedia | null;
  textContent: string;
  hasContent: boolean;

  setType: (type: StoryType) => void;
  setFontFamily: (fontFamily: (typeof fontFamilies)[number]) => void;
  setSelectedBackground: (background: StoryBackground) => void;
  setUploadedMedia: (media: UploadedMedia | null) => void;
  setTextContent: (content: string) => void;
  handleUploadMedia: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetState: () => void;
};

export const fontFamilies = [
  {
    label: "Roboto",
    value: roboto.style.fontFamily,
  },
  {
    label: "Yesteryear",
    value: yesteryear.style.fontFamily,
  },
  {
    label: "Source Code Pro",
    value: sourceCodePro.style.fontFamily,
  },
  {
    label: "Merriweather",
    value: merriweather.style.fontFamily,
  },
];

const CreateDataContext = createContext<CreateDataContextType>({
  type: null,
  fontFamily: fontFamilies[0],
  selectedBackground: StoryBackground.BLUE_GRADIENT,
  uploadedMedia: null,
  textContent: "",
  hasContent: false,

  setType: () => {},
  setFontFamily: () => {},
  setSelectedBackground: () => {},
  setUploadedMedia: () => {},
  setTextContent: () => {},
  handleUploadMedia: () => {},
  resetState: () => {},
});

export const useCreateData = () => useContext(CreateDataContext);

type CreateDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function CreateDataProvider({
  children,
}: CreateDataProviderProps) {
  const [type, setType] = useState<StoryType>(null);
  const [fontFamily, setFontFamily] = useState<(typeof fontFamilies)[number]>(
    fontFamilies[0]
  );

  const [selectedBackground, setSelectedBackground] = useState<StoryBackground>(
    StoryBackground.BLUE_GRADIENT
  );
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia | null>(
    null
  );
  const [textContent, setTextContent] = useState("");

  function handleUploadMedia(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedMedia({ file, preview: result });
      };
      reader.readAsDataURL(file);
    }
  }

  function resetState() {
    setType(null);
    setSelectedBackground(StoryBackground.BLUE_GRADIENT);
    setUploadedMedia(null);
    setTextContent("");
  }

  const hasContent =
    type !== null || textContent.trim() !== "" || uploadedMedia !== null;

  return (
    <CreateDataContext.Provider
      value={{
        type,
        fontFamily,
        selectedBackground,
        uploadedMedia,
        textContent,
        hasContent,

        setType,
        setFontFamily,
        setSelectedBackground,
        setUploadedMedia,
        setTextContent,
        handleUploadMedia,
        resetState,
      }}
    >
      {children}
    </CreateDataContext.Provider>
  );
}
