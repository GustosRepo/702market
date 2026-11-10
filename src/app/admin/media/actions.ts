"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminSiteMedia } from "@/lib/admin-site-media";
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

function readDisplayOrder(formData: FormData, slot: string, fallback: number) {
  const value = readString(formData, `${slot}:sortOrder`);
  if (!value) return fallback;
  const order = Number(value);
  if (!Number.isSafeInteger(order) || order < 0 || order > 1000000) {
    throw new Error("Photo display order must be a whole number between 0 and 1000000.");
  }
  return order;
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

function validateImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Upload must be a JPG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Image uploads must be 10MB or smaller.");
  }
}

async function uploadSiteMediaFile({
  file,
  slot,
}: {
  file: File;
  slot: string;
}) {
  validateImage(file);

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

  const files = [...formData.values()].filter((value): value is File => value instanceof File && value.size > 0);
  if (files.reduce((total, file) => total + file.size, 0) > 40 * 1024 * 1024) {
    throw new Error("Upload up to 40MB of photos per save.");
  }
  files.forEach(validateImage);

  const supabase = createAdminClient();
  const rows = [];
  const slots = await getAdminSiteMedia();

  for (const definition of slots) {
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
      definition.storagePath;

    if (!storagePath) {
      continue;
    }

    rows.push({
      slot: definition.slot,
      storage_path: storagePath,
      alt_text:
        readString(formData, `${definition.slot}:altText`) ||
        definition.altText,
      caption: readString(formData, `${definition.slot}:caption`) || null,
      sort_order: definition.slot.startsWith("home.gallery.")
        ? readDisplayOrder(formData, definition.slot, definition.sortOrder)
        : definition.sortOrder,
      active: formData.get(`${definition.slot}:active`) === "on",
      updated_at: new Date().toISOString(),
    });
  }

  let nextOrder = Math.max(0, ...rows.filter((row) => row.slot.startsWith("home.gallery.")).map((row) => row.sort_order));
  const addedPhotos = formData.getAll("homeGalleryFiles").filter((value): value is File => value instanceof File && value.size > 0);
  for (const file of addedPhotos) {
    const slot = `home.gallery.${crypto.randomUUID()}`;
    const storagePath = await uploadSiteMediaFile({ file, slot });
    rows.push({
      slot,
      storage_path: storagePath,
      alt_text: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim() || "MarketElla market photo.",
      caption: null,
      sort_order: ++nextOrder,
      active: true,
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
