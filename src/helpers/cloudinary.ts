/**
 * Cloudinary URL Transformation Utilities
 * Generate optimized URLs for images and videos with various transformations
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

interface CloudinaryUrlOptions {
  /**
   * The public_id of the asset in Cloudinary
   */
  publicId: string;
  /**
   * Width of the output image/video frame
   */
  width?: number;
  /**
   * Height of the output image/video frame
   */
  height?: number;
  /**
   * Crop/resize mode (fill, fit, crop, scale, etc.)
   * @default "fill"
   */
  crop?: "fill" | "fit" | "crop" | "scale" | "limit" | "pad" | "thumb";
  /**
   * Quality (1-100 or "auto")
   * @default "auto"
   */
  quality?: number | "auto";
  /**
   * Format (jpg, png, webp, auto, etc.)
   * @default "auto"
   */
  format?: "jpg" | "png" | "webp" | "auto" | "mp4" | "gif";
  /**
   * Gravity for cropping (center, face, auto, etc.)
   * @default "auto"
   */
  gravity?: "auto" | "center" | "face" | "faces" | "north" | "south" | "east" | "west";
}

interface VideoThumbnailOptions extends CloudinaryUrlOptions {
  /**
   * Extract frame at specific time (in seconds)
   * @default 0
   */
  startOffset?: number;
  /**
   * Extract frame at specific percentage (0-100)
   */
  percentage?: number;
}

/**
 * Generate a Cloudinary image URL with transformations
 * @example
 * const url = getCloudinaryImageUrl({
 *   publicId: "moment-up/post123",
 *   width: 800,
 *   quality: "auto"
 * });
 */
export function getCloudinaryImageUrl(options: CloudinaryUrlOptions): string {
  const {
    publicId,
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    gravity = "auto",
  } = options;

  if (!CLOUDINARY_CLOUD_NAME) {
    console.error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured");
    return "";
  }

  const transformations: string[] = [];

  // Add dimensions
  if (width || height) {
    const parts: string[] = [];
    if (width) parts.push(`w_${width}`);
    if (height) parts.push(`h_${height}`);
    parts.push(`c_${crop}`);
    parts.push(`g_${gravity}`);
    transformations.push(parts.join(","));
  }

  // Add quality
  transformations.push(`q_${quality}`);

  // Add format
  transformations.push(`f_${format}`);

  const transformationString = transformations.join("/");
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}/${publicId}`;
}

/**
 * Generate a Cloudinary video URL with transformations
 * @example
 * const url = getCloudinaryVideoUrl({
 *   publicId: "moment-up/video123",
 *   width: 1280,
 *   quality: "auto"
 * });
 */
export function getCloudinaryVideoUrl(options: CloudinaryUrlOptions): string {
  const {
    publicId,
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "mp4",
    gravity = "center",
  } = options;

  if (!CLOUDINARY_CLOUD_NAME) {
    console.error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured");
    return "";
  }

  const transformations: string[] = [];

  // Add dimensions
  if (width || height) {
    const parts: string[] = [];
    if (width) parts.push(`w_${width}`);
    if (height) parts.push(`h_${height}`);
    parts.push(`c_${crop}`);
    parts.push(`g_${gravity}`);
    transformations.push(parts.join(","));
  }

  // Add quality
  transformations.push(`q_${quality}`);

  // Add format
  transformations.push(`f_${format}`);

  const transformationString = transformations.join("/");
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${transformationString}/${publicId}`;
}

/**
 * Extract a video thumbnail (specific frame) from a video
 * This generates a static image URL from a video at a specific time or percentage
 * 
 * @example
 * // Extract frame at 2.5 seconds
 * const thumbnailUrl = getVideoThumbnailUrl({
 *   publicId: "moment-up/video123",
 *   width: 640,
 *   startOffset: 2.5
 * });
 * 
 * @example
 * // Extract frame at 50% of video duration
 * const thumbnailUrl = getVideoThumbnailUrl({
 *   publicId: "moment-up/video123",
 *   width: 640,
 *   percentage: 50
 * });
 */
export function getVideoThumbnailUrl(options: VideoThumbnailOptions): string {
  const {
    publicId,
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "jpg",
    gravity = "center",
    startOffset = 0,
    percentage,
  } = options;

  if (!CLOUDINARY_CLOUD_NAME) {
    console.error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured");
    return "";
  }

  const transformations: string[] = [];

  // Add frame extraction - use percentage if provided, otherwise use startOffset
  if (percentage !== undefined) {
    transformations.push(`so_${percentage}p`);
  } else {
    transformations.push(`so_${startOffset}`);
  }

  // Add dimensions
  if (width || height) {
    const parts: string[] = [];
    if (width) parts.push(`w_${width}`);
    if (height) parts.push(`h_${height}`);
    parts.push(`c_${crop}`);
    parts.push(`g_${gravity}`);
    transformations.push(parts.join(","));
  }

  // Add quality
  transformations.push(`q_${quality}`);

  // Add format (image format for thumbnail)
  transformations.push(`f_${format}`);

  const transformationString = transformations.join("/");
  
  // Note: We use video/upload to extract from video, but output will be an image
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${transformationString}/${publicId}`;
}

/**
 * Generate an animated GIF preview from a video
 * @example
 * const gifUrl = getVideoToGifUrl({
 *   publicId: "moment-up/video123",
 *   width: 400,
 *   startOffset: 0,
 *   duration: 3
 * });
 */
export function getVideoToGifUrl(
  options: VideoThumbnailOptions & { duration?: number }
): string {
  const {
    publicId,
    width,
    height,
    crop = "fill",
    quality = "auto",
    gravity = "center",
    startOffset = 0,
    duration = 3,
  } = options;

  if (!CLOUDINARY_CLOUD_NAME) {
    console.error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured");
    return "";
  }

  const transformations: string[] = [];

  // Add start offset and duration
  transformations.push(`so_${startOffset}`);
  if (duration) {
    transformations.push(`eo_${startOffset + duration}`);
  }

  // Add dimensions
  if (width || height) {
    const parts: string[] = [];
    if (width) parts.push(`w_${width}`);
    if (height) parts.push(`h_${height}`);
    parts.push(`c_${crop}`);
    parts.push(`g_${gravity}`);
    transformations.push(parts.join(","));
  }

  // Add quality
  transformations.push(`q_${quality}`);

  // Add GIF format
  transformations.push(`f_gif`);

  const transformationString = transformations.join("/");
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/${transformationString}/${publicId}`;
}

/**
 * Helper to parse any URL - checks if it's already a full URL or needs to be converted
 * This is a replacement/enhancement for the existing __parseUrl function
 * 
 * @example
 * // Returns full URL as-is
 * parseMediaUrl("https://example.com/image.jpg") // => "https://example.com/image.jpg"
 * 
 * // Converts public_id to Cloudinary URL
 * parseMediaUrl("moment-up/post123", "image", { width: 640 }) // => Cloudinary URL
 */
export function parseMediaUrl(
  data: string | null,
  assetType: "image" | "video" | "video-thumbnail" = "image",
  options?: Omit<CloudinaryUrlOptions, "publicId"> & { startOffset?: number; percentage?: number }
): string | null {
  if (!data) return null;
  
  // If already a full URL (http/https/blob), return as-is
  if (data.startsWith("http") || data.startsWith("blob:")) return data;

  // Generate Cloudinary URL based on asset type
  if (assetType === "video-thumbnail") {
    return getVideoThumbnailUrl({
      publicId: data,
      ...options,
    });
  } else if (assetType === "video") {
    return getCloudinaryVideoUrl({
      publicId: data,
      ...options,
    });
  } else {
    return getCloudinaryImageUrl({
      publicId: data,
      ...options,
    });
  }
}

