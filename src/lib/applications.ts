import {
  createAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";

export type AdminApplication = {
  id: string;
  vendorName: string;
  contactName: string;
  email: string;
  category: string;
  boothType: string;
  phone: string;
  instagram: string | null;
  website: string | null;
  productDescription: string;
  priceRange: string;
  electricityRequired: boolean;
  specialRequests: string | null;
  adminNotes: string | null;
  paymentReference: string | null;
  paidAt: string | null;
  status: "pending" | "approved" | "waitlisted" | "declined";
  paymentStatus: "unpaid" | "paid" | "waived" | "refunded";
  applicationFee: number;
  eventTitle: string;
  eventSlug: string;
  submittedAt: string;
  submittedMonth: string;
  archivedAt: string | null;
};

export type ApplicationStats = {
  total: number;
  pending: number;
  approved: number;
  waitlisted: number;
  declined: number;
  paid: number;
  unpaid: number;
  revenue: number;
};

type ApplicationRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business_name: string;
  instagram: string | null;
  website: string | null;
  category: string;
  product_description: string;
  price_range: string;
  booth_type: string;
  electricity_required: boolean;
  special_requests: string | null;
  admin_notes: string | null;
  status: AdminApplication["status"];
  payment_status: AdminApplication["paymentStatus"];
  payment_reference: string | null;
  paid_at: string | null;
  application_fee: number | string;
  created_at: string;
  archived_at: string | null;
  events: {
    title: string;
    slug: string;
  } | null;
};

function mapApplication(row: ApplicationRow): AdminApplication {
  return {
    id: row.id,
    vendorName: row.business_name,
    contactName: `${row.first_name} ${row.last_name}`,
    email: row.email,
    phone: row.phone,
    category: row.category,
    boothType: row.booth_type,
    instagram: row.instagram,
    website: row.website,
    productDescription: row.product_description,
    priceRange: row.price_range,
    electricityRequired: row.electricity_required,
    specialRequests: row.special_requests,
    adminNotes: row.admin_notes,
    paymentReference: row.payment_reference,
    paidAt: row.paid_at,
    status: row.status,
    paymentStatus: row.payment_status,
    applicationFee: Number(row.application_fee),
    eventTitle: row.events?.title || "Unknown event",
    eventSlug: row.events?.slug || "",
    submittedAt: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(row.created_at)),
    submittedMonth: new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(row.created_at)),
    archivedAt: row.archived_at,
  };
}

function emptyStats(): ApplicationStats {
  return {
    total: 0,
    pending: 0,
    approved: 0,
    waitlisted: 0,
    declined: 0,
    paid: 0,
    unpaid: 0,
    revenue: 0,
  };
}

export type ApplicationArchiveView = "active" | "archived" | "all";

export type ApplicationQuery = {
  archive?: ApplicationArchiveView;
  eventSlug?: string;
  status?: AdminApplication["status"] | "all";
};

export async function getApplications(options: ApplicationQuery = {}) {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  const archive = options.archive || "active";
  const supabase = createAdminClient();
  let query = supabase
    .from("applications")
    .select(
      "id, first_name, last_name, email, phone, business_name, instagram, website, category, product_description, price_range, booth_type, electricity_required, special_requests, admin_notes, status, payment_status, payment_reference, paid_at, application_fee, created_at, archived_at, events!inner(title, slug)",
    )
    .order("created_at", { ascending: false });

  if (archive === "active") {
    query = query.is("archived_at", null);
  } else if (archive === "archived") {
    query = query.not("archived_at", "is", null);
  }

  if (options.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  if (options.eventSlug && options.eventSlug !== "all") {
    query = query.eq("events.slug", options.eventSlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Unable to load applications", error);
    return [];
  }

  return data.map((application) =>
    mapApplication(application as unknown as ApplicationRow),
  );
}

export async function getApplicationById(id: string) {
  if (!hasSupabaseAdminEnv()) {
    return undefined;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("applications")
    .select(
      "id, first_name, last_name, email, phone, business_name, instagram, website, category, product_description, price_range, booth_type, electricity_required, special_requests, admin_notes, status, payment_status, payment_reference, paid_at, application_fee, created_at, archived_at, events!inner(title, slug)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Unable to load application: ${id}`, error);
    return undefined;
  }

  return data ? mapApplication(data as unknown as ApplicationRow) : undefined;
}

export async function getApplicationStats(options: ApplicationQuery = {}) {
  const applications = await getApplications(options);

  return applications.reduce((stats, application) => {
    stats.total += 1;
    stats[application.status] += 1;

    if (application.paymentStatus === "paid") {
      stats.paid += 1;
    } else if (application.paymentStatus === "unpaid") {
      stats.unpaid += 1;
    }

    if (application.paymentStatus === "paid") {
      stats.revenue += application.applicationFee;
    }

    return stats;
  }, emptyStats());
}

export async function getApplicationCountsByEvent() {
  const applications = await getApplications({ archive: "active" });

  return applications.reduce<Record<string, number>>((counts, application) => {
    if (!application.eventSlug) {
      return counts;
    }

    counts[application.eventSlug] = (counts[application.eventSlug] || 0) + 1;
    return counts;
  }, {});
}
