"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createSlug } from "@/lib/slugs";
import { createAdminClient } from "@/lib/supabase/admin";
import { readImageFile, uploadAdminImage } from "@/lib/admin-image-upload";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = readString(formData, "name");
  const slug = readString(formData, "slug") || createSlug(name);
  const price = Number(readString(formData, "displayPrice"));

  if (!name || !slug || Number.isNaN(price)) {
    throw new Error("Product name, slug, and price are required.");
  }
  const imageFile = readImageFile(formData, "imageFile");
  const imagePath = imageFile ? await uploadAdminImage(imageFile, `merch/${slug}`) : null;

  const supabase = createAdminClient();
  const { error } = await supabase.from("merch_products").insert({
    name,
    slug,
    description: readString(formData, "description"),
    display_price: price,
    image_path: imagePath,
    external_url: readString(formData, "externalUrl"),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    sort_order: Number(readString(formData, "sortOrder") || 0),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/merch");
  revalidatePath("/admin/merch");
  redirect("/admin/merch");
}
