"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { mediaSlotDefinitions } from "@/lib/admin-site-media";
import { createAdminClient } from "@/lib/supabase/admin";

const SITE_MEDIA_BUCKET = "site-assets";
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type SupabaseErrorLike = {
  code?: string;
  message?: string;
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readFile(formData: FormData, key: string) {
  const value = formData.get(key);

  if (
    value &&
    typeof value === "object" &&
    "size" in value &&
    "name" in value &&
    Number(value.size) > 0
  ) {
    return value as File;
  }

  return null;
}

function safeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";
  const base = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${base || "image"}.${extension}`;
}

function isMissingTableError(error: SupabaseErrorLike) {
  const message = error.message || "";

  return (
    error.code === "42P01" ||
    message.includes("site_media") ||
    message.includes("schema cache")
  );
}

function isMissingBucketError(error: SupabaseErrorLike) {
  const message = error.message || "";

  return (
    message.includes("Bucket not found") ||
    message.includes("bucket") ||
    message.includes(SITE_MEDIA_BUCKET)
  );
}

async function uploadSiteMediaFile({
  file,
  slot,
}: {
  file: File;
  slot: string;
}) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Upload must be a JPG, PNG, WebP, or GIF image.");
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Image uploads must be 10MB or smaller.");
  }

  const supabase = createAdminClient();
  const uploadPath = `${slot.replace(/[^a-z0-9.-]+/gi, "-")}/${Date.now()}-${safeFileName(file.name)}`;
  const { error } = await supabase.storage
    .from(SITE_MEDIA_BUCKET)
    .upload(uploadPath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    if (isMissingBucketError(error)) {
      throw new Error(
        "The site-assets storage bucket is missing. Apply the latest Supabase migrations before uploading media.",
      );
    }

    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(SITE_MEDIA_BUCKET)
    .getPublicUrl(uploadPath);

  return data.publicUrl;
}

function revalidateMediaPaths() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/socials");
  revalidatePath("/admin/media");
}

export async function updateSiteMedia(formData: FormData) {
  await requireAdmin();

  const supabase = createAdminClient();
  const rows = [];

  for (const definition of mediaSlotDefinitions) {
    const uploadedFile = readFile(formData, `${definition.slot}:file`);
    const uploadedPath = uploadedFile
      ? await uploadSiteMediaFile({
          file: uploadedFile,
          slot: definition.slot,
        })
      : "";

    const storagePath =
      uploadedPath ||
      readString(formData, `${definition.slot}:storagePath`) ||
      definition.fallbackPath;

    if (!storagePath) {
      continue;
    }

    rows.push({
      slot: definition.slot,
      storage_path: storagePath,
      alt_text:
        readString(formData, `${definition.slot}:altText`) ||
        definition.fallbackAlt,
      caption: readString(formData, `${definition.slot}:caption`) || null,
      sort_order: definition.sortOrder,
      active: formData.get(`${definition.slot}:active`) === "on",
      updated_at: new Date().toISOString(),
    });
  }

  const { error } = await supabase
    .from("site_media")
    .upsert(rows, { onConflict: "slot" });

  if (error) {
    if (isMissingTableError(error)) {
      throw new Error(
        "The site_media table is missing. Apply the latest Supabase migrations before saving media.",
      );
    }

    throw new Error(error.message);
  }

  revalidateMediaPaths();
  redirect("/admin/media");
}
