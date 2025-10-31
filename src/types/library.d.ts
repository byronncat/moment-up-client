declare module "cloudinary" {
  type ResourceType = "image" | "video" | "raw" | "audio";
  type PublicId = string;

  interface CloudinaryUploadResponse {
    asset_id: string;
    public_id: PublicId;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: ResourceType;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    access_mode: string;
    original_filename: string;
  }
}
