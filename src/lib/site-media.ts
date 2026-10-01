import { createClient } from "@/lib/supabase/server";
import { siteAssets } from "@/lib/site-assets";

export type SitePhoto = {
  src: string;
  alt: string;
  caption?: string;
};

export type SiteMedia = {
  homeHero: string;
  aboutStory: string;
  contactCommunity: string;
  socialCta: string;
  newLocationStrip: string;
  homeGallery: SitePhoto[];
  aboutGallery: SitePhoto[];
};

type SiteMediaRow = {
  slot: string;
  storage_path: string;
  alt_text: string;
  caption: string | null;
  sort_order: number;
  active: boolean;
};

export const fallbackSiteMedia: SiteMedia = {
  homeHero: siteAssets.homeHero,
  aboutStory: siteAssets.aboutStory,
  contactCommunity: siteAssets.contactCommunity,
  socialCta: siteAssets.socialCta,
  newLocationStrip: siteAssets.newLocationStrip,
  homeGallery: siteAssets.homeGallery,
  aboutGallery: siteAssets.aboutGallery,
};

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

function photoFromRow(row: SiteMediaRow): SitePhoto {
  return {
    src: row.storage_path,
    alt: row.alt_text,
    caption: row.caption || undefined,
  };
}

export async function getSiteMedia(): Promise<SiteMedia> {
  if (!hasSupabaseEnv()) {
    return fallbackSiteMedia;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_media")
    .select("slot, storage_path, alt_text, caption, sort_order, active")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return fallbackSiteMedia;
  }

  const rows = (data || []) as SiteMediaRow[];
  const bySlot = new Map(rows.map((row) => [row.slot, row]));

  const homeGallery = rows
    .filter((row) => row.slot.startsWith("home.gallery."))
    .map(photoFromRow);
  const aboutGallery = rows
    .filter((row) => row.slot.startsWith("about.gallery."))
    .map(photoFromRow);

  return {
    homeHero: bySlot.get("home.hero")?.storage_path || fallbackSiteMedia.homeHero,
    aboutStory: bySlot.get("about.story")?.storage_path || fallbackSiteMedia.aboutStory,
    contactCommunity:
      bySlot.get("contact.community")?.storage_path ||
      fallbackSiteMedia.contactCommunity,
    socialCta:
      bySlot.get("socials.cta")?.storage_path || fallbackSiteMedia.socialCta,
    newLocationStrip:
      bySlot.get("home.new_location.strip")?.storage_path ||
      fallbackSiteMedia.newLocationStrip,
    homeGallery: homeGallery.length > 0 ? homeGallery : fallbackSiteMedia.homeGallery,
    aboutGallery:
      aboutGallery.length > 0 ? aboutGallery : fallbackSiteMedia.aboutGallery,
  };
}
