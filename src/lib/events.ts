import { cache } from "react";
import {
  events as fallbackEvents,
  type ApplicationType,
  type EventVendorOption,
  type MarketEvent,
} from "@/data/events";
import { createClient } from "@/lib/supabase/server";

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
  applications_enabled: boolean;
  general_applications_enabled: boolean;
  food_applications_enabled: boolean;
  application_notes: string;
  food_application_notes: string;
  application_rules: string;
  food_application_rules: string;
  status: MarketEvent["status"];
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

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function formatTimeLabel(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatFee(fee: number | string) {
  const amount = Number(fee);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

function mapVendorOption(row: VendorOptionRow): EventVendorOption {
  return {
    id: row.id,
    applicationType: row.application_type,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    capacity: row.capacity,
    active: row.active,
    sortOrder: row.sort_order,
  };
}

function mapEvent(row: EventRow): MarketEvent {
  return {
    title: row.title,
    slug: row.slug,
    description: row.description,
    date: row.event_date,
    dateLabel: formatDateLabel(row.event_date),
    time: `${formatTimeLabel(row.start_time)} - ${formatTimeLabel(row.end_time)}`,
    startTime: row.start_time,
    endTime: row.end_time,
    location: row.location_name,
    address: row.address,
    heroImage: row.hero_image || `/assets/events/${row.slug}-hero.jpg`,
    applicationOpenDate: row.application_open_date,
    applicationDeadlineDate: row.application_deadline,
    applicationDeadline: row.application_deadline
      ? formatDateLabel(row.application_deadline)
      : "TBA",
    applicationFee: formatFee(row.application_fee),
    applicationsEnabled:
      row.general_applications_enabled || row.food_applications_enabled,
    generalApplicationsEnabled: row.general_applications_enabled,
    foodApplicationsEnabled: row.food_applications_enabled,
    applicationNotes: row.application_notes,
    foodApplicationNotes: row.food_application_notes,
    applicationRules: row.application_rules,
    foodApplicationRules: row.food_application_rules,
    vendorOptions: (row.event_vendor_options || [])
      .map(mapVendorOption)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    status: row.status,
  };
}

const publicEventSelect = `
  title,
  slug,
  description,
  event_date,
  start_time,
  end_time,
  location_name,
  address,
  hero_image,
  application_open_date,
  application_deadline,
  application_fee,
  applications_enabled,
  general_applications_enabled,
  food_applications_enabled,
  application_notes,
  food_application_notes,
  application_rules,
  food_application_rules,
  status,
  event_vendor_options (
    id,
    application_type,
    name,
    description,
    price,
    capacity,
    active,
    sort_order
  )
`;

export const getEvents = cache(async () => {
  if (!hasSupabaseEnv()) {
    return fallbackEvents;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(publicEventSelect)
    .eq("published", true)
    .is("archived_at", null)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Unable to load Supabase events", error);
    return fallbackEvents;
  }

  return data.map((event) => mapEvent(event as EventRow));
});

export const getEventBySlug = cache(async (slug: string) => {
  if (!hasSupabaseEnv()) {
    return fallbackEvents.find((event) => event.slug === slug);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(publicEventSelect)
    .eq("slug", slug)
    .eq("published", true)
    .is("archived_at", null)
    .maybeSingle();

  if (error) {
    console.error(`Unable to load Supabase event: ${slug}`, error);
    return fallbackEvents.find((event) => event.slug === slug);
  }

  return data ? mapEvent(data as EventRow) : undefined;
});

function losAngelesDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isUpcomingEvent(event: MarketEvent) {
  return event.status === "upcoming" && event.date >= losAngelesDate();
}

export function isApplicationTypeOpen(
  event: MarketEvent,
  applicationType: ApplicationType,
) {
  const enabled =
    applicationType === "food"
      ? event.foodApplicationsEnabled
      : event.generalApplicationsEnabled;
  const today = losAngelesDate();

  if (!enabled || !isUpcomingEvent(event)) return false;
  if (event.applicationOpenDate && today < event.applicationOpenDate) return false;
  if (event.applicationDeadlineDate && today > event.applicationDeadlineDate) return false;

  return event.vendorOptions.some(
    (option) => option.active && option.applicationType === applicationType,
  );
}
