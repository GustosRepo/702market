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

export async function createEvent(formData: FormData) {
  await requireAdmin();

  const title = readString(formData, "title");
  const slug = readString(formData, "slug") || createSlug(title);

  if (!title || !slug) {
    throw new Error("Event title is required.");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("events").insert({
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
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/apply");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}
