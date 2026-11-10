"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { defaultCountdownContent, HOMEPAGE_COUNTDOWN_KEY } from "@/lib/homepage-content";
import { createAdminClient } from "@/lib/supabase/admin";

type SupabaseErrorLike = {
  code?: string;
  message?: string;
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isMissingTableError(error: SupabaseErrorLike) {
  const message = error.message || "";

  return (
    error.code === "42P01" ||
    message.includes("site_content") ||
    message.includes("schema cache")
  );
}

export async function updateHomepageContent(formData: FormData) {
  await requireAdmin();

  const content = {
    heading: readString(formData, "countdown:heading").slice(0, 160) || defaultCountdownContent.heading,
    emptyMessage: readString(formData, "countdown:emptyMessage").slice(0, 500) || defaultCountdownContent.emptyMessage,
  };

  const supabase = createAdminClient();
  const { error } = await supabase.from("site_content").upsert(
    {
      key: HOMEPAGE_COUNTDOWN_KEY,
      content,
      active: formData.get("countdown:active") === "on",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    if (isMissingTableError(error)) {
      throw new Error(
        "The site_content table is missing. Apply the latest Supabase migrations before saving homepage content.",
      );
    }

    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  redirect("/admin/homepage");
}
