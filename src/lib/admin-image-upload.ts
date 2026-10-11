import "server-only";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";

const SITE_MEDIA_BUCKET = "site-assets";
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function readImageFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function safeFileName(fileName: string) {
  const base = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "image";
}

export async function uploadAdminImage(file: File, folder: string) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Upload must be a JPG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Image uploads must be 10MB or smaller.");
  }

  const cleanFolder = folder.replace(/[^a-z0-9/-]+/gi, "-");
  const originalBuffer = Buffer.from(await file.arrayBuffer());
  const preserveAnimation = file.type === "image/gif";
  const uploadBody = preserveAnimation
    ? originalBuffer
    : await sharp(originalBuffer)
        .rotate()
        .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
  const extension = preserveAnimation ? "gif" : "webp";
  const contentType = preserveAnimation ? file.type : "image/webp";
  const path = `${cleanFolder}/${Date.now()}-${randomUUID().slice(0, 8)}-${safeFileName(file.name)}.${extension}`;
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(SITE_MEDIA_BUCKET)
    .upload(path, uploadBody, { contentType, upsert: false });

  if (error) throw new Error(error.message);
  return supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
