"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readDateTime(formData: FormData, key: string) {
  const value = readString(formData, key);

  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

async function setApplicationArchived(id: string, archived: boolean) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("applications")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  revalidatePath("/admin/events");
}

export async function archiveApplication(formData: FormData) {
  const id = readString(formData, "id");

  if (!id) {
    throw new Error("Missing application id");
  }

  await setApplicationArchived(id, true);
}

export async function restoreApplication(formData: FormData) {
  const id = readString(formData, "id");

  if (!id) {
    throw new Error("Missing application id");
  }

  await setApplicationArchived(id, false);
}

export async function updateApplicationReview(formData: FormData) {
  await requireAdmin();

  const id = readString(formData, "id");
  const status = readString(formData, "status");
  const paymentStatus = readString(formData, "paymentStatus");
  const paidAt = readDateTime(formData, "paidAt");

  if (!id) {
    throw new Error("Missing application id");
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("applications")
    .update({
      status,
      payment_status: paymentStatus,
      payment_reference: readString(formData, "paymentReference") || null,
      paid_at:
        paymentStatus === "paid"
          ? paidAt || new Date().toISOString()
          : null,
      admin_notes: readString(formData, "adminNotes") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
  redirect(`/admin/applications/${id}`);
}
