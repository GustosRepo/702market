import {
  defaultNewLocationContent,
  normalizeNewLocationContent,
} from "@/lib/homepage-content";
import {
  createAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";

type SiteContentRow = {
  key: string;
  content: unknown;
  active: boolean;
};

export async function getAdminHomepageContent() {
  if (!hasSupabaseAdminEnv()) {
    return {
      newLocation: defaultNewLocationContent,
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key, content, active")
    .eq("key", "home.new_location")
    .limit(1);

  if (error) {
    return {
      newLocation: defaultNewLocationContent,
    };
  }

  const row = ((data || []) as SiteContentRow[])[0];

  return {
    newLocation: row
      ? normalizeNewLocationContent(row.content, row.active)
      : defaultNewLocationContent,
  };
}
