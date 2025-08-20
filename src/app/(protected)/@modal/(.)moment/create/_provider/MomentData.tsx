"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";
import { nanoid } from "nanoid";

export type FileWithId = File & {
  id: string;
  previewUrl: string;
};

export const MAX_FILES_LIMIT = 12;

type MomentDataContextType = {
  files: FileWithId[];
  setFiles: Dispatch<SetStateAction<FileWithId[]>>;
  addFiles: (newFiles: File[]) => { added: number; rejected: number };
  removeFile: (index: number) => void;
};

const MomentDataContext = createContext<MomentDataContextType>({
  files: [],
  setFiles: () => {},
  addFiles: () => ({ added: 0, rejected: 0 }),
  removeFile: () => {},
});

export const useMomentData = () => useContext(MomentDataContext);

type CreateDataProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MomentDataProvider({
  children,
}: CreateDataProviderProps) {
  const [files, setFiles] = useState<FileWithId[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    let added = 0;
    let rejected = 0;

    setFiles((prevFiles) => {
      const currentCount = prevFiles.length;
      const availableSlots = MAX_FILES_LIMIT - currentCount;

      if (availableSlots <= 0) {
        rejected = newFiles.length;
        return prevFiles;
      }

      const filesToAdd = newFiles.slice(0, availableSlots);
      const rejectedFiles = newFiles.slice(availableSlots);

      added = filesToAdd.length;
      rejected = rejectedFiles.length;

      const filesWithId: FileWithId[] = filesToAdd.map((file) =>
        Object.assign(file, {
          id: nanoid(),
          previewUrl: URL.createObjectURL(file),
        })
      );

      return [...prevFiles, ...filesWithId];
    });

    return { added, rejected };
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles[index];
      if (fileToRemove?.previewUrl)
        URL.revokeObjectURL(fileToRemove.previewUrl);
      return prevFiles.filter((_, i) => i !== index);
    });
  }, []);

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, [files]);

  return (
    <MomentDataContext.Provider
      value={{
        files,
        setFiles,
        addFiles,
        removeFile,
      }}
    >
      {children}
    </MomentDataContext.Provider>
  );
}
