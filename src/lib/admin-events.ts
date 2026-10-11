import { cache } from "react";
import { events as fallbackEvents } from "@/data/events";
import {
  createAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";
import type { ApplicationType, EventVendorOption } from "@/data/events";

export type AdminEvent = {
  title: string;
  slug: string;
  description: string;
  date: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  heroImage: string;
  applicationOpenDate: string | null;
  applicationDeadline: string | null;
  applicationFee: number;
  vendorCapacity: number | null;
  published: boolean;
  applicationsEnabled: boolean;
  generalApplicationsEnabled: boolean;
  foodApplicationsEnabled: boolean;
  applicationNotes: string;
  foodApplicationNotes: string;
  applicationRules: string;
  foodApplicationRules: string;
  vendorOptions: EventVendorOption[];
  status: "upcoming" | "completed" | "cancelled";
  archivedAt: string | null;
};

export type EventArchiveView = "active" | "archived" | "all";

type EventRow = {
  title: string;
  slug: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location_name: string;
  address: string;
  hero_image: string | null;
  application_open_date: string | null;
  application_deadline: string | null;
  application_fee: number | string;
  vendor_capacity: number | null;
  published: boolean;
  applications_enabled: boolean;
  general_applications_enabled: boolean;
  food_applications_enabled: boolean;
  application_notes: string;
  food_application_notes: string;
  application_rules: string;
  food_application_rules: string;
  status: AdminEvent["status"];
  archived_at: string | null;
  event_vendor_options: VendorOptionRow[] | null;
};

type VendorOptionRow = {
  id: string;
  application_type: ApplicationType;
  name: string;
  description: string;
  price: number | string;
  capacity: number | null;
  active: boolean;
  sort_order: number;
};

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function mapEvent(row: EventRow): AdminEvent {
  return {
    title: row.title,
    slug: row.slug,
    description: row.description,
    date: row.event_date,
    dateLabel: formatDateLabel(row.event_date),
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
    location: row.location_name,
    address: row.address,
    heroImage: row.hero_image || `/assets/events/${row.slug}-hero.jpg`,
    applicationOpenDate: row.application_open_date,
    applicationDeadline: row.application_deadline,
    applicationFee: Number(row.application_fee),
    vendorCapacity: row.vendor_capacity,
    published: row.published,
    applicationsEnabled:
      row.general_applications_enabled || row.food_applications_enabled,
    generalApplicationsEnabled: row.general_applications_enabled,
    foodApplicationsEnabled: row.food_applications_enabled,
    applicationNotes: row.application_notes,
    foodApplicationNotes: row.food_application_notes,
    applicationRules: row.application_rules,
    foodApplicationRules: row.food_application_rules,
    vendorOptions: (row.event_vendor_options || [])
      .map((option) => ({
        id: option.id,
        applicationType: option.application_type,
        name: option.name,
        description: option.description,
        price: Number(option.price),
        capacity: option.capacity,
        active: option.active,
        sortOrder: option.sort_order,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder),
    status: row.status,
    archivedAt: row.archived_at,
  };
}

export const getAdminEvents = cache(async (archive: EventArchiveView = "active") => {
  if (!hasSupabaseAdminEnv()) {
    return fallbackEvents.map((event) => ({
      title: event.title,
      slug: event.slug,
      description: event.description,
      date: event.date,
      dateLabel: event.dateLabel,
      startTime: "16:00",
      endTime: "22:00",
      location: event.location,
      address: event.address,
      heroImage: event.heroImage,
      applicationOpenDate: null,
      applicationDeadline: null,
      applicationFee: Number(event.applicationFee.replace(/[^0-9.]/g, "")),
      vendorCapacity: null,
      published: true,
      applicationsEnabled: event.applicationsEnabled,
      generalApplicationsEnabled: event.generalApplicationsEnabled,
      foodApplicationsEnabled: event.foodApplicationsEnabled,
      applicationNotes: event.applicationNotes,
      foodApplicationNotes: event.foodApplicationNotes,
      applicationRules: event.applicationRules,
      foodApplicationRules: event.foodApplicationRules,
      vendorOptions: event.vendorOptions,
      status: event.status,
      archivedAt: null,
    }));
  }

  const supabase = createAdminClient();
  let query = supabase
    .from("events")
    .select(
      "title, slug, description, event_date, start_time, end_time, location_name, address, hero_image, application_open_date, application_deadline, application_fee, vendor_capacity, published, applications_enabled, general_applications_enabled, food_applications_enabled, application_notes, food_application_notes, application_rules, food_application_rules, status, archived_at, event_vendor_options(id, application_type, name, description, price, capacity, active, sort_order)",
    )
    .order("event_date", { ascending: false });

  if (archive === "active") {
    query = query.is("archived_at", null);
  } else if (archive === "archived") {
    query = query.not("archived_at", "is", null);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Unable to load admin events", error);
    return [];
  }

  return data.map((event) => mapEvent(event as EventRow));
});

export const getAdminEventBySlug = cache(async (slug: string) => {
  if (!hasSupabaseAdminEnv()) {
    return (await getAdminEvents("all")).find((event) => event.slug === slug);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "title, slug, description, event_date, start_time, end_time, location_name, address, hero_image, application_open_date, application_deadline, application_fee, vendor_capacity, published, applications_enabled, general_applications_enabled, food_applications_enabled, application_notes, food_application_notes, application_rules, food_application_rules, status, archived_at, event_vendor_options(id, application_type, name, description, price, capacity, active, sort_order)",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Unable to load admin event: ${slug}`, error);
    return undefined;
  }

  return data ? mapEvent(data as EventRow) : undefined;
});
