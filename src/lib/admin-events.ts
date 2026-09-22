import { cache } from "react";
import { events as fallbackEvents } from "@/data/events";
import {
  createAdminClient,
  hasSupabaseAdminEnv,
} from "@/lib/supabase/admin";

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
  applicationOpenDate: string | null;
  applicationDeadline: string | null;
  applicationFee: number;
  vendorCapacity: number | null;
  published: boolean;
  applicationsEnabled: boolean;
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
  application_open_date: string | null;
  application_deadline: string | null;
  application_fee: number | string;
  vendor_capacity: number | null;
  published: boolean;
  applications_enabled: boolean;
  status: AdminEvent["status"];
  archived_at: string | null;
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
    applicationOpenDate: row.application_open_date,
    applicationDeadline: row.application_deadline,
    applicationFee: Number(row.application_fee),
    vendorCapacity: row.vendor_capacity,
    published: row.published,
    applicationsEnabled: row.applications_enabled,
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
      applicationOpenDate: null,
      applicationDeadline: null,
      applicationFee: Number(event.applicationFee.replace(/[^0-9.]/g, "")),
      vendorCapacity: null,
      published: true,
      applicationsEnabled: event.applicationsEnabled,
      status: event.status,
      archivedAt: null,
    }));
  }

  const supabase = createAdminClient();
  let query = supabase
    .from("events")
    .select(
      "title, slug, description, event_date, start_time, end_time, location_name, address, application_open_date, application_deadline, application_fee, vendor_capacity, published, applications_enabled, status, archived_at",
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
      "title, slug, description, event_date, start_time, end_time, location_name, address, application_open_date, application_deadline, application_fee, vendor_capacity, published, applications_enabled, status, archived_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Unable to load admin event: ${slug}`, error);
    return undefined;
  }

  return data ? mapEvent(data as EventRow) : undefined;
});
