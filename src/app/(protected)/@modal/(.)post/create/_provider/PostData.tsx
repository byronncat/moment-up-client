"use client";

// === Type ====
import type { UploadMediaFile } from "../types";

type PostState = {
  files: UploadMediaFile[];
  text: string;
  privacy: Privacy;
  phase: "media" | "text" | "preview";
  hasContent: boolean;
};

type PostAction = {
  setFiles: Dispatch<SetStateAction<UploadMediaFile[]>>;
  addFiles: (newFiles: File[]) => Promise<{ added: number; rejected: number }>;
  removeFile: (index: number) => void;
  setText: Dispatch<SetStateAction<string>>;
  setPrivacy: Dispatch<SetStateAction<Privacy>>;
  setPhase: Dispatch<SetStateAction<"media" | "text" | "preview">>;
  upload: () => Promise<boolean>;
};

// === Provider ====
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { nanoid } from "nanoid";
import { Privacy } from "@/constants/server";
import { useCloudinary } from "@/components/providers";

export const MAX_FILES_LIMIT = 12;

const PostDataContext = createContext<PostState & PostAction>({
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
  upload: () => Promise.resolve(false),
});

export const usePostData = () => useContext(PostDataContext);

type CreateDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function PostDataProvider({
  children,
}: CreateDataProviderProps) {
  const [files, setFiles] = useState<UploadMediaFile[]>([]);
  const [text, setText] = useState("");
  const [privacy, setPrivacy] = useState<Privacy>(Privacy.PUBLIC);
  const [phase, setPhase] = useState<"media" | "text" | "preview">("text");
  const { uploadMultipleImages } = useCloudinary();

  const blobUrls = useRef<string[]>([]);

  const hasContent = useMemo(() => {
    return text.length > 0 || files.length > 0;
  }, [text, files]);

  const upload = useCallback(async () => {
    try {
      // If there are files, upload them first
      if (files.length > 0) {
        const result = await uploadMultipleImages(files, "moment-up/moments");

        if (!result.success) {
          return false;
        }

        // Here you would typically send the moment data with the uploaded image URLs to your backend
      }

      const formData = {
        text,
        privacy,
        files: files.length > 0 ? files : [], // You might want to replace this with the uploaded URLs
      };

      return true;
    } catch {
      return false;
    }
  }, [text, files, privacy, uploadMultipleImages]);

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
    <PostDataContext.Provider
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
        upload,
      }}
    >
      {children}
    </PostDataContext.Provider>
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
