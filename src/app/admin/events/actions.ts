"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createSlug } from "@/lib/slugs";
import { createAdminClient } from "@/lib/supabase/admin";

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

  const supabase = createAdminClient();
  const { error } = await supabase
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
      application_open_date: readString(formData, "applicationOpenDate") || null,
      application_deadline: readString(formData, "applicationDeadline") || null,
      application_fee: readNumber(formData, "applicationFee") || 0,
      applications_enabled: formData.get("applicationsEnabled") === "on",
      vendor_capacity: readNumber(formData, "vendorCapacity"),
      status: readString(formData, "status") || "upcoming",
      published: formData.get("published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("slug", originalSlug);

  if (error) {
    throw new Error(error.message);
  }

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
  const applicationsEnabled = readString(formData, "applicationsEnabled") === "true";

  if (!slug) {
    throw new Error("Missing event slug");
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("events")
    .update({
      applications_enabled: !applicationsEnabled,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  revalidateEventAdmin();
}
