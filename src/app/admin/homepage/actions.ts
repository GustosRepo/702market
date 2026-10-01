"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { defaultNewLocationContent } from "@/lib/homepage-content";
import { createAdminClient } from "@/lib/supabase/admin";

type SupabaseErrorLike = {
  code?: string;
  message?: string;
};

const CONTENT_KEY = "home.new_location";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readPhrases(formData: FormData, key: string, fallback: string[]) {
  const phrases = readString(formData, key)
    .split("|")
    .map((phrase) => phrase.trim())
    .filter(Boolean);

  return phrases.length > 0 ? phrases : fallback;
}

function normalizeInternalHref(value: string) {
  if (value.startsWith("/") || value.startsWith("#")) {
    return value;
  }

  return defaultNewLocationContent.buttonHref;
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
    topMarqueePhrases: readPhrases(
      formData,
      "newLocation:topMarqueePhrases",
      defaultNewLocationContent.topMarqueePhrases,
    ),
    headingLabel:
      readString(formData, "newLocation:headingLabel") ||
      defaultNewLocationContent.headingLabel,
    locationName:
      readString(formData, "newLocation:locationName") ||
      defaultNewLocationContent.locationName,
    description:
      readString(formData, "newLocation:description") ||
      defaultNewLocationContent.description,
    buttonLabel:
      readString(formData, "newLocation:buttonLabel") ||
      defaultNewLocationContent.buttonLabel,
    buttonHref: normalizeInternalHref(
      readString(formData, "newLocation:buttonHref") ||
        defaultNewLocationContent.buttonHref,
    ),
    bottomMarqueePhrases: readPhrases(
      formData,
      "newLocation:bottomMarqueePhrases",
      defaultNewLocationContent.bottomMarqueePhrases,
    ),
  };

  const supabase = createAdminClient();
  const { error } = await supabase.from("site_content").upsert(
    {
      key: CONTENT_KEY,
      content,
      active: formData.get("newLocation:active") === "on",
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
