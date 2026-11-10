import {
  fallbackHomepageContent,
  HOMEPAGE_COUNTDOWN_KEY,
  normalizeCountdownContent,
  type HomepageContent,
} from "@/lib/homepage-content";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

export async function getAdminHomepageContent(): Promise<HomepageContent> {
  if (!hasSupabaseAdminEnv()) return fallbackHomepageContent;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("content, active")
    .eq("key", HOMEPAGE_COUNTDOWN_KEY)
    .maybeSingle();

  return error || !data
    ? fallbackHomepageContent
    : { countdown: normalizeCountdownContent(data.content, data.active) };
}
