export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3004",
  "http://192.168.0.5:3004",
  "https://mytraining.mixzira.dev",
] as const;

export const IMAGE_CONTENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
] as const;

export const VIDEO_CONTENT_TYPES = ["video/mp4", "video/webm"] as const;

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export const MAX_IMAGE_EDGE_PX = 512;

export const RESIZED_IMAGE_CONTENT_TYPE = "image/webp";

export const RESIZED_IMAGE_QUALITY = 0.85;

export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export const UPLOAD_URL_TTL_SECONDS = 60 * 5;

export const DOWNLOAD_URL_WINDOW_SECONDS = 60 * 60 * 24 * 6;

export const DOWNLOAD_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

export const DOWNLOAD_CACHE_CONTROL = "public, max-age=31536000, immutable";

export const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export const UPLOAD_FOLDERS = ["categories", "exercises", "profile"] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export type ImageContentType = (typeof IMAGE_CONTENT_TYPES)[number];
export type VideoContentType = (typeof VIDEO_CONTENT_TYPES)[number];
export type UploadContentType = ImageContentType | VideoContentType;

export function isImageContentType(value: string): value is ImageContentType {
  return (IMAGE_CONTENT_TYPES as readonly string[]).includes(value);
}

export function isVideoContentType(value: string): value is VideoContentType {
  return (VIDEO_CONTENT_TYPES as readonly string[]).includes(value);
}
