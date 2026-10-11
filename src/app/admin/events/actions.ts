"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createSlug } from "@/lib/slugs";
import { createAdminClient } from "@/lib/supabase/admin";
import { readImageFile, uploadAdminImage } from "@/lib/admin-image-upload";
import {
  readEventVendorOptions,
  saveEventVendorOptions,
  validateEnabledVendorOptions,
} from "@/lib/admin-event-vendor-options";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value ? Number(value) : null;
}

function revalidateEventAdmin() {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/apply");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath("/admin/applications");
}

async function setEventArchived(slug: string, archived: boolean) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("events")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  revalidateEventAdmin();
}

export async function archiveEvent(formData: FormData) {
  const slug = readString(formData, "slug");

  if (!slug) {
    throw new Error("Missing event slug");
  }

  await setEventArchived(slug, true);
}

export async function restoreEvent(formData: FormData) {
  const slug = readString(formData, "slug");

  if (!slug) {
    throw new Error("Missing event slug");
  }

  await setEventArchived(slug, false);
}

export async function updateEvent(formData: FormData) {
  await requireAdmin();

  const originalSlug = readString(formData, "originalSlug");
  const title = readString(formData, "title");
  const slug = readString(formData, "slug") || createSlug(title);

  if (!originalSlug || !title || !slug) {
    throw new Error("Event title and slug are required.");
  }

  const generalEnabled = formData.get("generalApplicationsEnabled") === "on";
  const foodEnabled = formData.get("foodApplicationsEnabled") === "on";
  const vendorOptions = readEventVendorOptions(formData);
  validateEnabledVendorOptions(vendorOptions, generalEnabled, foodEnabled);
  const heroImageFile = readImageFile(formData, "heroImageFile");
  const heroImage = heroImageFile
    ? await uploadAdminImage(heroImageFile, `events/${slug}`)
    : readString(formData, "heroImage") || null;

  const supabase = createAdminClient();
  const { data: event, error } = await supabase
    .from("events")
    .update({
      title,
      slug,
      description: readString(formData, "description"),
      event_date: readString(formData, "eventDate"),
      start_time: readString(formData, "startTime"),
      end_time: readString(formData, "endTime"),
      location_name: readString(formData, "locationName"),
      address: readString(formData, "address"),
      hero_image: heroImage,
      application_open_date: readString(formData, "applicationOpenDate") || null,
      application_deadline: readString(formData, "applicationDeadline") || null,
      application_fee: 0,
      applications_enabled: generalEnabled || foodEnabled,
      general_applications_enabled: generalEnabled,
      food_applications_enabled: foodEnabled,
      application_notes: readString(formData, "applicationNotes"),
      food_application_notes: readString(formData, "foodApplicationNotes"),
      application_rules: readString(formData, "applicationRules"),
      food_application_rules: readString(formData, "foodApplicationRules"),
      vendor_capacity: readNumber(formData, "vendorCapacity"),
      status: readString(formData, "status") || "upcoming",
      published: formData.get("published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("slug", originalSlug)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await saveEventVendorOptions(supabase, event.id, vendorOptions);

  revalidateEventAdmin();
  redirect("/admin/events");
}

export async function toggleEventPublished(formData: FormData) {
  await requireAdmin();

  const slug = readString(formData, "slug");
  const published = readString(formData, "published") === "true";

  if (!slug) {
    throw new Error("Missing event slug");
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("events")
    .update({ published: !published, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  revalidateEventAdmin();
}

export async function toggleEventApplications(formData: FormData) {
  await requireAdmin();

  const slug = readString(formData, "slug");
  const generalApplicationsEnabled = readString(formData, "generalApplicationsEnabled") === "true";
  const foodApplicationsEnabled = readString(formData, "foodApplicationsEnabled") === "true";
  const nextGeneralApplicationsEnabled = !generalApplicationsEnabled;

  if (!slug) {
    throw new Error("Missing event slug");
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("events")
    .update({
      applications_enabled: nextGeneralApplicationsEnabled || foodApplicationsEnabled,
      general_applications_enabled: nextGeneralApplicationsEnabled,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  revalidateEventAdmin();
}
