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

export async function createEvent(formData: FormData) {
  await requireAdmin();

  const title = readString(formData, "title");
  const slug = readString(formData, "slug") || createSlug(title);

  if (!title || !slug) {
    throw new Error("Event title is required.");
  }

  const generalEnabled = formData.get("generalApplicationsEnabled") === "on";
  const foodEnabled = formData.get("foodApplicationsEnabled") === "on";
  const vendorOptions = readEventVendorOptions(formData);
  validateEnabledVendorOptions(vendorOptions, generalEnabled, foodEnabled);
  const heroImageFile = readImageFile(formData, "heroImageFile");
  const heroImage = heroImageFile
    ? await uploadAdminImage(heroImageFile, `events/${slug}`)
    : null;

  const supabase = createAdminClient();
  const { data: event, error } = await supabase.from("events").insert({
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
  }).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  await saveEventVendorOptions(supabase, event.id, vendorOptions);

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/apply");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}
