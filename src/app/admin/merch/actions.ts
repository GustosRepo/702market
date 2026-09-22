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

function revalidateMerchAdmin() {
  revalidatePath("/merch");
  revalidatePath("/admin/merch");
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();

  const originalSlug = readString(formData, "originalSlug");
  const name = readString(formData, "name");
  const slug = readString(formData, "slug") || createSlug(name);
  const price = Number(readString(formData, "displayPrice"));

  if (!originalSlug || !name || !slug || Number.isNaN(price)) {
    throw new Error("Product name, slug, and price are required.");
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("merch_products")
    .update({
      name,
      slug,
      description: readString(formData, "description"),
      display_price: price,
      image_path: readString(formData, "imagePath") || null,
      external_url: readString(formData, "externalUrl"),
      featured: formData.get("featured") === "on",
      active: formData.get("active") === "on",
      sort_order: Number(readString(formData, "sortOrder") || 0),
      updated_at: new Date().toISOString(),
    })
    .eq("slug", originalSlug);

  if (error) {
    throw new Error(error.message);
  }

  revalidateMerchAdmin();
  redirect("/admin/merch");
}

async function setProductArchived(slug: string, archived: boolean) {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("merch_products")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }

  revalidateMerchAdmin();
}

export async function archiveProduct(formData: FormData) {
  const slug = readString(formData, "slug");

  if (!slug) {
    throw new Error("Missing product slug");
  }

  await setProductArchived(slug, true);
}

export async function restoreProduct(formData: FormData) {
  const slug = readString(formData, "slug");

  if (!slug) {
    throw new Error("Missing product slug");
  }

  await setProductArchived(slug, false);
}
