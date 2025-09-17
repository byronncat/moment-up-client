"use client";

// === Types ===
import type { CloudinaryResponse } from "cloudinary";

interface UploadResponse {
  success: boolean;
  public_id?: string | string[];
}

interface CloudinaryAction {
  uploadImage: (file: File, folder?: string) => Promise<UploadResponse>;
  uploadMultipleImages: (
    files: File[],
    folder?: string
  ) => Promise<UploadResponse>;
}

// === Provider ===
import { createContext, useCallback, useContext } from "react";

const CloudinaryContext = createContext<CloudinaryAction>({
  // eslint-disable-next-line require-await
  uploadImage: async () => ({ success: false }),
  // eslint-disable-next-line require-await
  uploadMultipleImages: async () => ({ success: false }),
});

export const useCloudinary = () => useContext(CloudinaryContext);

export default function CloudinaryProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const uploadImage = useCallback(async (file: File, folder = "moment-up") => {
    try {
      const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudinaryName || !cloudinaryPreset)
        throw new Error("Cloudinary configuration is missing");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cloudinaryPreset);
      formData.append("folder", folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`;

      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message ?? "Upload failed");
      }

      const data: CloudinaryResponse = await response.json();

      return {
        success: true,
        public_id: data.public_id,
      };
    } catch {
      return {
        success: false,
      };
    }
  }, []);

  const uploadMultipleImages = useCallback(
    async (files: File[], folder = "moment-up") => {
      try {
        const uploadPromises = files.map(async (file) => {
          const result = await uploadImage(file, folder);
          return result;
        });

        const results = await Promise.all(uploadPromises);

        const failedUploads = results.filter((result) => !result.success);
        if (failedUploads.length > 0) {
          return {
            success: false,
          };
        }

        const imageIds = results
          .filter((result) => result.success && result.public_id)
          .map((result) => result.public_id);

        if (imageIds)
          return {
            success: false,
          };

        return {
          success: true,
          public_id: imageIds,
        };
      } catch {
        return {
          success: false,
        };
      }
    },
    [uploadImage]
  );

  return (
    <CloudinaryContext.Provider
      value={{
        uploadImage,
        uploadMultipleImages,
      }}
    >
      {children}
    </CloudinaryContext.Provider>
  );
}
