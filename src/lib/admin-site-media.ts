import { fallbackSiteMedia } from "@/lib/site-media";
import {
  createAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";

export type AdminMediaSlot = {
  slot: string;
  label: string;
  group: string;
  storagePath: string;
  altText: string;
  caption: string;
  sortOrder: number;
  active: boolean;
};

type MediaSlotDefinition = Omit<
  AdminMediaSlot,
  "storagePath" | "altText" | "caption" | "active"
> & {
  fallbackPath: string;
  fallbackAlt: string;
  fallbackCaption?: string;
};

type SiteMediaRow = {
  slot: string;
  storage_path: string;
  alt_text: string;
  caption: string | null;
  sort_order: number;
  active: boolean;
};

export const mediaSlotDefinitions: MediaSlotDefinition[] = [
  {
    slot: "home.hero",
    label: "Homepage hero",
    group: "Homepage",
    fallbackPath: fallbackSiteMedia.homeHero,
    fallbackAlt: "702 Market photo wall with flowers and a pink cart.",
    sortOrder: 0,
  },
  {
    slot: "about.story",
    label: "About/story card",
    group: "Site pages",
    fallbackPath: fallbackSiteMedia.aboutStory,
    fallbackAlt: "702 Market photo wall with flowers and a pink cart.",
    sortOrder: 0,
  },
  {
    slot: "contact.community",
    label: "Contact community image",
    group: "Site pages",
    fallbackPath: fallbackSiteMedia.contactCommunity,
    fallbackAlt: "Friends holding shopping bags at 702Market.",
    sortOrder: 0,
  },
  {
    slot: "socials.cta",
    label: "Socials CTA image",
    group: "Site pages",
    fallbackPath: fallbackSiteMedia.socialCta,
    fallbackAlt: "Vendor booth with clothing and accessories at 702Market.",
    sortOrder: 0,
  },
  ...fallbackSiteMedia.homeGallery.map((photo, index) => ({
    slot: `home.gallery.${index + 1}`,
    label: `Homepage gallery ${index + 1}`,
    group: "Homepage gallery",
    fallbackPath: photo.src,
    fallbackAlt: photo.alt,
    fallbackCaption: photo.caption,
    sortOrder: index + 1,
  })),
  ...fallbackSiteMedia.aboutGallery.map((photo, index) => ({
    slot: `about.gallery.${index + 1}`,
    label: `About gallery ${index + 1}`,
    group: "About gallery",
    fallbackPath: photo.src,
    fallbackAlt: photo.alt,
    fallbackCaption: photo.caption,
    sortOrder: index + 1,
  })),
];

function slotFromDefinition(
  definition: MediaSlotDefinition,
  row?: SiteMediaRow,
): AdminMediaSlot {
  return {
    slot: definition.slot,
    label: definition.label,
    group: definition.group,
    storagePath: row?.storage_path || definition.fallbackPath,
    altText: row?.alt_text || definition.fallbackAlt,
    caption: row?.caption || definition.fallbackCaption || "",
    sortOrder: row?.sort_order ?? definition.sortOrder,
    active: row?.active ?? true,
  };
}

export async function getAdminSiteMedia() {
  if (!hasSupabaseAdminEnv()) {
    return mediaSlotDefinitions.map((definition) => slotFromDefinition(definition));
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_media")
    .select("slot, storage_path, alt_text, caption, sort_order, active")
    .order("slot", { ascending: true });

  if (error) {
    return mediaSlotDefinitions.map((definition) => slotFromDefinition(definition));
  }

  const rowsBySlot = new Map(
    ((data || []) as SiteMediaRow[]).map((row) => [row.slot, row]),
  );

  return mediaSlotDefinitions.map((definition) =>
    slotFromDefinition(definition, rowsBySlot.get(definition.slot)),
  );
}
