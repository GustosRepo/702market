"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createSlug } from "@/lib/slugs";
import { createAdminClient } from "@/lib/supabase/admin";
import { readImageFile, uploadAdminImage } from "@/lib/admin-image-upload";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readPositiveNumber(formData: FormData, key: string, fallback: number) {
  const value = Number(readString(formData, key));
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function readSortOrder(formData: FormData) {
  const value = Number(readString(formData, "sortOrder"));
  return Number.isFinite(value) ? value : 0;
}

function normalizeOptionalUrl(value: string, label: string) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.toString();
    }
  } catch {
    // A local image path is handled below.
  }

  if (label === "Image path" && value.startsWith("/")) {
    return value;
  }

  throw new Error(`${label} must be a full http(s) URL${label === "Image path" ? " or start with /" : ""}.`);
}

async function episodeValues(formData: FormData) {
  const title = readString(formData, "title");
  const slug = readString(formData, "slug") || createSlug(title);

  if (!title || !slug) {
    throw new Error("Episode title is required.");
  }

  const imageFile = readImageFile(formData, "imageFile");
  const imagePath = imageFile
    ? await uploadAdminImage(imageFile, `podcast/${slug}`)
    : normalizeOptionalUrl(readString(formData, "imagePath"), "Image path");

  return {
    title,
    slug,
    description: readString(formData, "description"),
    episode_number: readPositiveNumber(formData, "episodeNumber", 1),
    image_path: imagePath,
    listen_url: normalizeOptionalUrl(readString(formData, "listenUrl"), "Listen URL"),
    published: formData.get("published") === "on",
    sort_order: readSortOrder(formData),
    updated_at: new Date().toISOString(),
  };
}

function revalidatePodcast() {
  revalidatePath("/podcast");
  revalidatePath("/admin/podcast");
}

async function setEpisodeArchived(slug: string, archived: boolean) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("podcast_episodes")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePodcast();
}

export async function archivePodcastEpisode(formData: FormData) {
  const slug = readString(formData, "slug");
  if (!slug) throw new Error("Missing episode slug.");
  await setEpisodeArchived(slug, true);
}

export async function restorePodcastEpisode(formData: FormData) {
  const slug = readString(formData, "slug");
  if (!slug) throw new Error("Missing episode slug.");
  await setEpisodeArchived(slug, false);
}

export async function togglePodcastEpisodePublished(formData: FormData) {
  await requireAdmin();

  const slug = readString(formData, "slug");
  const published = readString(formData, "published") === "true";
  if (!slug) throw new Error("Missing episode slug.");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("podcast_episodes")
    .update({ published: !published, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePodcast();
}

export async function updatePodcastEpisode(formData: FormData) {
  await requireAdmin();

  const originalSlug = readString(formData, "originalSlug");
  if (!originalSlug) throw new Error("Missing episode slug.");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("podcast_episodes")
    .update(await episodeValues(formData))
    .eq("slug", originalSlug);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePodcast();
  redirect("/admin/podcast");
}

export async function createPodcastEpisode(formData: FormData) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("podcast_episodes")
    .insert(await episodeValues(formData));

  if (error) {
    throw new Error(error.message);
  }

  revalidatePodcast();
  redirect("/admin/podcast");
}
