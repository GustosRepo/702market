import { createClient } from "@/lib/supabase/server";

export type NewLocationContent = {
  active: boolean;
  topMarqueePhrases: string[];
  headingLabel: string;
  locationName: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  bottomMarqueePhrases: string[];
};

export type HomepageContent = {
  newLocation: NewLocationContent;
};

type SiteContentRow = {
  key: string;
  content: unknown;
  active: boolean;
};

export const defaultNewLocationContent: NewLocationContent = {
  active: true,
  topMarqueePhrases: ["not your average market", "where everyone's a star"],
  headingLabel: "new location:",
  locationName: "santa anita",
  description:
    "we heard the 626 needed a new market that focuses on vintage goods and handmade items.....",
  buttonLabel: "Tell me more",
  buttonHref: "/events",
  bottomMarqueePhrases: ["apply to sell"],
};

export const fallbackHomepageContent: HomepageContent = {
  newLocation: defaultNewLocationContent,
};

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringArrayValue(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const phrases = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return phrases.length > 0 ? phrases : fallback;
}

export function normalizeNewLocationContent(
  content: unknown,
  active = defaultNewLocationContent.active,
): NewLocationContent {
  const source = isRecord(content) ? content : {};

  return {
    active,
    topMarqueePhrases: stringArrayValue(
      source.topMarqueePhrases,
      defaultNewLocationContent.topMarqueePhrases,
    ),
    headingLabel: stringValue(
      source.headingLabel,
      defaultNewLocationContent.headingLabel,
    ),
    locationName: stringValue(
      source.locationName,
      defaultNewLocationContent.locationName,
    ),
    description: stringValue(
      source.description,
      defaultNewLocationContent.description,
    ),
    buttonLabel: stringValue(
      source.buttonLabel,
      defaultNewLocationContent.buttonLabel,
    ),
    buttonHref: stringValue(source.buttonHref, defaultNewLocationContent.buttonHref),
    bottomMarqueePhrases: stringArrayValue(
      source.bottomMarqueePhrases,
      defaultNewLocationContent.bottomMarqueePhrases,
    ),
  };
}

export async function getHomepageContent(): Promise<HomepageContent> {
  if (!hasSupabaseEnv()) {
    return fallbackHomepageContent;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key, content, active")
    .eq("key", "home.new_location")
    .eq("active", true)
    .limit(1);

  if (error) {
    return fallbackHomepageContent;
  }

  const row = ((data || []) as SiteContentRow[])[0];

  return {
    newLocation: row
      ? normalizeNewLocationContent(row.content, row.active)
      : defaultNewLocationContent,
  };
}
