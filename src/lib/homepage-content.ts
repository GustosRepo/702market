import { createClient } from "@/lib/supabase/server";

export const HOMEPAGE_COUNTDOWN_KEY = "home.countdown";

export type CountdownContent = {
  active: boolean;
  heading: string;
  emptyMessage: string;
};

export type HomepageContent = {
  countdown: CountdownContent;
};

export const defaultCountdownContent: CountdownContent = {
  active: true,
  heading: "UPCOMING MARKET",
  emptyMessage: "More market dates coming soon. Stay tuned!",
};

export const fallbackHomepageContent: HomepageContent = {
  countdown: defaultCountdownContent,
};

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function normalizeCountdownContent(
  content: unknown,
  active = defaultCountdownContent.active,
): CountdownContent {
  const source = content && typeof content === "object" && !Array.isArray(content)
    ? content as Record<string, unknown>
    : {};

  return {
    active,
    heading: source.heading === "countdown to our next market" || source.heading === "NEXT MARKET"
      ? defaultCountdownContent.heading
      : stringValue(source.heading, defaultCountdownContent.heading),
    emptyMessage: stringValue(source.emptyMessage, defaultCountdownContent.emptyMessage),
  };
}

export async function getHomepageContent(): Promise<HomepageContent> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return fallbackHomepageContent;
  }

  const supabase = await createClient();
  // Read inactive settings too: the saved visibility must not fall back to true.
  const { data, error } = await supabase
    .from("site_content")
    .select("content, active")
    .eq("key", HOMEPAGE_COUNTDOWN_KEY)
    .maybeSingle();

  return error || !data
    ? fallbackHomepageContent
    : { countdown: normalizeCountdownContent(data.content, data.active) };
}
