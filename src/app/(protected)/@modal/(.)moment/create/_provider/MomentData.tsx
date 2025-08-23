"use client";

import type { UploadMediaFile } from "../types";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { nanoid } from "nanoid";
import { Privacy } from "@/constants/serverConfig";

export const MAX_FILES_LIMIT = 12;

type MomentDataContextType = {
  files: UploadMediaFile[];
  text: string;
  privacy: Privacy;
  phase: "media" | "text" | "preview";
  hasContent: boolean;
  setFiles: Dispatch<SetStateAction<UploadMediaFile[]>>;
  addFiles: (newFiles: File[]) => Promise<{ added: number; rejected: number }>;
  removeFile: (index: number) => void;
  setText: Dispatch<SetStateAction<string>>;
  setPrivacy: Dispatch<SetStateAction<Privacy>>;
  setPhase: Dispatch<SetStateAction<"media" | "text" | "preview">>;
  uploadMoment: () => Promise<boolean>;
};

const MomentDataContext = createContext<MomentDataContextType>({
  files: [],
  text: "",
  privacy: Privacy.PUBLIC,
  phase: "text",
  hasContent: false,
  setFiles: () => {},
  addFiles: () => Promise.resolve({ added: 0, rejected: 0 }),
  removeFile: () => {},
  setText: () => {},
  setPrivacy: () => {},
  setPhase: () => {},
  uploadMoment: () => Promise.resolve(false),
});

export const useMomentData = () => useContext(MomentDataContext);

type CreateDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MomentDataProvider({
  children,
}: CreateDataProviderProps) {
  const [files, setFiles] = useState<UploadMediaFile[]>([]);
  const [text, setText] = useState("");
  const [privacy, setPrivacy] = useState<Privacy>(Privacy.PUBLIC);
  const [phase, setPhase] = useState<"media" | "text" | "preview">("text");

  const blobUrls = useRef<string[]>([]);

  const hasContent = useMemo(() => {
    return text.length > 0 || files.length > 0;
  }, [text, files]);

  const uploadMoment = useCallback(async () => {
    const formData = {
      text,
      privacy,
      files,
    };

    console.log("Form data:", formData);
    return true;
  }, [text, files, privacy]);

  const addFiles = useCallback(
    async (newFiles: File[]) => {
      let added = 0;
      let rejected = 0;

      const currentCount = files.length;
      const availableSlots = MAX_FILES_LIMIT - currentCount;

      if (availableSlots <= 0) {
        return { added: 0, rejected: newFiles.length };
      }

      const filesToAdd = newFiles.slice(0, availableSlots);
      const rejectedFiles = newFiles.slice(availableSlots);
      rejected = rejectedFiles.length;

      const filesWithId: UploadMediaFile[] = await Promise.all(
        filesToAdd.map(async (file) => {
          const newFile = new File([file], file.name, {
            type: file.type,
            lastModified: file.lastModified,
          }) as UploadMediaFile;

          newFile.id = nanoid();
          newFile.previewUrl = URL.createObjectURL(newFile);
          newFile.aspectRatio = await calculateAspectRatio(file);
          blobUrls.current.push(newFile.previewUrl);

          return newFile;
        })
      );

      added = filesWithId.length;

      setFiles((prevFiles) => [...prevFiles, ...filesWithId]);

      return { added, rejected };
    },
    [files.length]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles[index];
      if (fileToRemove?.previewUrl)
        URL.revokeObjectURL(fileToRemove.previewUrl);
      return prevFiles.filter((_, i) => i !== index);
    });
  }, []);

  useEffect(() => {
    const currentUrls = blobUrls.current;
    return () => {
      currentUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  return (
    <MomentDataContext.Provider
      value={{
        files,
        text,
        privacy,
        phase,
        hasContent,
        setFiles,
        addFiles,
        removeFile,
        setText,
        setPrivacy,
        setPhase,
        uploadMoment,
      }}
    >
      {children}
    </MomentDataContext.Provider>
  );
}

function calculateAspectRatio(
  file: File
): Promise<UploadMediaFile["aspectRatio"]> {
  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        if (ratio < 1) resolve("4:5");
        else if (ratio === 1) resolve("1:1");
        else resolve("9:16");
      };
      img.onerror = () => resolve("1:1");
      img.src = URL.createObjectURL(file);
    } else if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        const ratio = video.videoWidth / video.videoHeight;
        if (ratio < 1) resolve("4:5");
        else if (ratio === 1) resolve("1:1");
        else resolve("9:16");
      };
      video.onerror = () => resolve("1:1");
      video.src = URL.createObjectURL(file);
    } else {
      resolve("1:1");
    }
  });
}
