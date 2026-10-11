import { cache } from "react";
import {
  createAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type PublicPodcastEpisode = {
  title: string;
  slug: string;
  description: string;
  episodeNumber: number;
  imagePath: string;
  listenUrl: string | null;
};

export type AdminPodcastEpisode = PublicPodcastEpisode & {
  published: boolean;
  sortOrder: number;
  archivedAt: string | null;
};

type PodcastEpisodeRow = {
  title: string;
  slug: string;
  description: string;
  episode_number: number;
  image_path: string | null;
  listen_url: string | null;
  published: boolean;
  sort_order: number;
  archived_at: string | null;
};

export type PodcastArchiveView = "active" | "archived" | "all";

export const fallbackPodcastEpisodes: AdminPodcastEpisode[] = [];

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

function mapPublicEpisode(row: PodcastEpisodeRow): PublicPodcastEpisode {
  return {
    title: row.title,
    slug: row.slug,
    description: row.description,
    episodeNumber: row.episode_number,
    imagePath: row.image_path || "/IMG_3215.JPG",
    listenUrl: row.listen_url,
  };
}

function mapAdminEpisode(row: PodcastEpisodeRow): AdminPodcastEpisode {
  return {
    ...mapPublicEpisode(row),
    published: row.published,
    sortOrder: row.sort_order,
    archivedAt: row.archived_at,
  };
}

export const getPodcastEpisodes = cache(async (): Promise<PublicPodcastEpisode[]> => {
  if (!hasSupabaseEnv()) {
    return fallbackPodcastEpisodes.filter((episode) => episode.published);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("podcast_episodes")
    .select("title, slug, description, episode_number, image_path, listen_url, published, sort_order, archived_at")
    .eq("published", true)
    .is("archived_at", null)
    .order("sort_order", { ascending: true })
    .order("episode_number", { ascending: true });

  if (error) {
    console.error("Unable to load podcast episodes", error);
    return fallbackPodcastEpisodes.filter((episode) => episode.published);
  }

  return data.map((episode) => mapPublicEpisode(episode as PodcastEpisodeRow));
});

export const getAdminPodcastEpisodes = cache(async (
  archive: PodcastArchiveView = "active",
): Promise<AdminPodcastEpisode[]> => {
  if (!hasSupabaseAdminEnv()) {
    return fallbackPodcastEpisodes.filter((episode) =>
      archive === "active" ? !episode.archivedAt : archive === "archived" ? Boolean(episode.archivedAt) : true,
    );
  }

  const supabase = createAdminClient();
  let query = supabase
    .from("podcast_episodes")
    .select("title, slug, description, episode_number, image_path, listen_url, published, sort_order, archived_at")
    .order("sort_order", { ascending: true })
    .order("episode_number", { ascending: true });

  if (archive === "active") {
    query = query.is("archived_at", null);
  } else if (archive === "archived") {
    query = query.not("archived_at", "is", null);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Unable to load admin podcast episodes", error);
    return [];
  }

  return data.map((episode) => mapAdminEpisode(episode as PodcastEpisodeRow));
});

export const getAdminPodcastEpisodeBySlug = cache(async (slug: string) => {
  if (!hasSupabaseAdminEnv()) {
    return fallbackPodcastEpisodes.find((episode) => episode.slug === slug);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("podcast_episodes")
    .select("title, slug, description, episode_number, image_path, listen_url, published, sort_order, archived_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Unable to load podcast episode: ${slug}`, error);
    return undefined;
  }

  return data ? mapAdminEpisode(data as PodcastEpisodeRow) : undefined;
});
