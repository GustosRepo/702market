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
  applicationType: "vendor" | "food";
  vendorOptionName: string;
  phone: string;
  instagram: string | null;
  website: string | null;
  productDescription: string;
  priceRange: string;
  electricityRequired: boolean;
  specialRequests: string | null;
  businessLicenseNumber: string | null;
  foodMenu: string | null;
  setupMeasurements: string | null;
  healthDepartmentNumber: string | null;
  rulesAcknowledged: boolean;
  rulesAcknowledgedAt: string | null;
  referenceCode: string | null;
  uploads: ApplicationUpload[];
  adminNotes: string | null;
  paymentReference: string | null;
  paidAt: string | null;
  status: ApplicationStatus;
  paymentStatus: "unpaid" | "paid" | "waived" | "refunded";
  applicationFee: number;
  eventTitle: string;
  eventSlug: string;
  submittedAt: string;
  submittedMonth: string;
  archivedAt: string | null;
};

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "waitlisted"
  | "rejected"
  | "confirmed"
  | "pending"
  | "declined";

export type ApplicationUpload = {
  id: string;
  documentType: string;
  originalName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  signedUrl: string | null;
};

export type ApplicationStats = {
  total: number;
  pending: number;
  approved: number;
  waitlisted: number;
  declined: number;
  submitted: number;
  under_review: number;
  rejected: number;
  confirmed: number;
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
  application_type: AdminApplication["applicationType"];
  vendor_option_name: string | null;
  electricity_required: boolean;
  special_requests: string | null;
  business_license_number: string | null;
  food_menu: string | null;
  setup_measurements: string | null;
  health_department_number: string | null;
  rules_acknowledged: boolean;
  rules_acknowledged_at: string | null;
  reference_code: string | null;
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
  application_images?: ApplicationImageRow[] | null;
};

type ApplicationImageRow = {
  id: string;
  storage_path: string;
  document_type: string;
  original_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
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
    applicationType: row.application_type || "vendor",
    vendorOptionName: row.vendor_option_name || row.booth_type,
    instagram: row.instagram,
    website: row.website,
    productDescription: row.product_description,
    priceRange: row.price_range,
    electricityRequired: row.electricity_required,
    specialRequests: row.special_requests,
    businessLicenseNumber: row.business_license_number,
    foodMenu: row.food_menu,
    setupMeasurements: row.setup_measurements,
    healthDepartmentNumber: row.health_department_number,
    rulesAcknowledged: row.rules_acknowledged,
    rulesAcknowledgedAt: row.rules_acknowledged_at,
    referenceCode: row.reference_code,
    uploads: [],
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
    submitted: 0,
    under_review: 0,
    rejected: 0,
    confirmed: 0,
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
  applicationType?: AdminApplication["applicationType"] | "all";
  paymentStatus?: AdminApplication["paymentStatus"] | "all";
};

const applicationSelect = "id, first_name, last_name, email, phone, business_name, instagram, website, category, product_description, price_range, booth_type, application_type, vendor_option_name, electricity_required, special_requests, business_license_number, food_menu, setup_measurements, health_department_number, rules_acknowledged, rules_acknowledged_at, reference_code, admin_notes, status, payment_status, payment_reference, paid_at, application_fee, created_at, archived_at, events!inner(title, slug)";

export async function getApplications(options: ApplicationQuery = {}) {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  const archive = options.archive || "active";
  const supabase = createAdminClient();
  let query = supabase
    .from("applications")
    .select(applicationSelect)
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

  if (options.applicationType && options.applicationType !== "all") {
    query = query.eq("application_type", options.applicationType);
  }

  if (options.paymentStatus && options.paymentStatus !== "all") {
    query = query.eq("payment_status", options.paymentStatus);
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
    .select(`${applicationSelect}, application_images(id, storage_path, document_type, original_name, mime_type, size_bytes)`)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Unable to load application: ${id}`, error);
    return undefined;
  }

  if (!data) return undefined;

  const row = data as unknown as ApplicationRow;
  const application = mapApplication(row);
  application.uploads = await Promise.all(
    (row.application_images || []).map(async (upload) => {
      const { data: signed } = await supabase.storage
        .from("application-images")
        .createSignedUrl(upload.storage_path, 60 * 15);
      return {
        id: upload.id,
        documentType: upload.document_type,
        originalName: upload.original_name || "Application upload",
        mimeType: upload.mime_type,
        sizeBytes: upload.size_bytes,
        signedUrl: signed?.signedUrl || null,
      };
    }),
  );

  return application;
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
