"use client";

// === Types ===
import type { CloudinaryUploadResponse } from "cloudinary";

type CloudinaryUploadedData = {
  public_id: string;
  type: "image" | "video" | "raw";
};

interface UploadResponse {
  success: boolean;
  data?: CloudinaryUploadedData[];
}

interface CloudinaryAction {
  uploadImage: (file: File, folder?: string) => Promise<UploadResponse>;
  uploadMultipleImages: (
    files: File[],
    folder?: string
  ) => Promise<UploadResponse>;
}

// === Provider ===
import { createContext, use, useCallback } from "react";

/* eslint-disable require-await */
const CloudinaryContext = createContext<CloudinaryAction>({
  uploadImage: async () => ({ success: false }),
  uploadMultipleImages: async () => ({ success: false }),
});

export const useCloudinary = () => use(CloudinaryContext);

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

      // Determine resource type based on file type
      const isVideo = file.type.startsWith("video/");
      const resourceType = isVideo ? "video" : "image";
      
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryName}/${resourceType}/upload`;

      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message ?? "Upload failed");
      }

      const data: CloudinaryUploadResponse = await response.json();

      return {
        success: true,
        data: [{ public_id: data.public_id, type: data.resource_type }],
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
        if (results.some((result) => !result.success || !result.data))
          return {
            success: false,
          };

        const uploadedData = results
          .map((result) => result.data)
          .flat() as CloudinaryUploadedData[];

        return {
          success: true,
          data: uploadedData,
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
