import { cache } from "react";
import { merchProducts as fallbackProducts } from "@/data/merch";
import {
  createAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type PublicMerchProduct = {
  name: string;
  slug: string;
  description: string;
  price: string;
  externalUrl: string;
  featured: boolean;
};

export type AdminMerchProduct = PublicMerchProduct & {
  displayPrice: number;
  imagePath: string | null;
  active: boolean;
  sortOrder: number;
  archivedAt: string | null;
};

type MerchRow = {
  name: string;
  slug: string;
  description: string;
  display_price: number | string;
  image_path: string | null;
  external_url: string;
  featured: boolean;
  active: boolean;
  sort_order: number;
  archived_at: string | null;
};

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

function formatPrice(price: number | string) {
  const amount = Number(price);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

function mapPublicProduct(row: MerchRow): PublicMerchProduct {
  return {
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: formatPrice(row.display_price),
    externalUrl: row.external_url,
    featured: row.featured,
  };
}

function mapAdminProduct(row: MerchRow): AdminMerchProduct {
  return {
    ...mapPublicProduct(row),
    displayPrice: Number(row.display_price),
    imagePath: row.image_path,
    active: row.active,
    sortOrder: row.sort_order,
    archivedAt: row.archived_at,
  };
}

export const getMerchProducts = cache(async () => {
  if (!hasSupabaseEnv()) {
    return fallbackProducts.map((product) => ({
      ...product,
      externalUrl: "#contact",
    }));
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("merch_products")
    .select(
      "name, slug, description, display_price, image_path, external_url, featured, active, sort_order",
    )
    .eq("active", true)
    .is("archived_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load merch products", error);
    return fallbackProducts.map((product) => ({
      ...product,
      externalUrl: "#contact",
    }));
  }

  return data.map((product) => mapPublicProduct(product as MerchRow));
});

export type MerchArchiveView = "active" | "archived" | "all";

export const getAdminMerchProducts = cache(async (archive: MerchArchiveView = "active") => {
  if (!hasSupabaseAdminEnv()) {
    return fallbackProducts.map((product, index) => ({
      ...product,
      displayPrice: Number(product.price.replace(/[^0-9.]/g, "")),
      imagePath: null,
      externalUrl: "#contact",
      active: true,
      sortOrder: index,
      archivedAt: null,
    }));
  }

  const supabase = createAdminClient();
  let query = supabase
    .from("merch_products")
    .select(
      "name, slug, description, display_price, image_path, external_url, featured, active, sort_order, archived_at",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (archive === "active") {
    query = query.is("archived_at", null);
  } else if (archive === "archived") {
    query = query.not("archived_at", "is", null);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Unable to load admin merch products", error);
    return [];
  }

  return data.map((product) => mapAdminProduct(product as MerchRow));
});

export const getAdminMerchProductBySlug = cache(async (slug: string) => {
  if (!hasSupabaseAdminEnv()) {
    return (await getAdminMerchProducts("all")).find(
      (product) => product.slug === slug,
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("merch_products")
    .select(
      "name, slug, description, display_price, image_path, external_url, featured, active, sort_order, archived_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Unable to load merch product: ${slug}`, error);
    return undefined;
  }

  return data ? mapAdminProduct(data as MerchRow) : undefined;
});
