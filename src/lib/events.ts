import { cache } from "react";
import { events as fallbackEvents, type MarketEvent } from "@/data/events";
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
  application_deadline: string | null;
  application_fee: number | string;
  applications_enabled: boolean;
  status: MarketEvent["status"];
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

function mapEvent(row: EventRow): MarketEvent {
  return {
    title: row.title,
    slug: row.slug,
    description: row.description,
    date: row.event_date,
    dateLabel: formatDateLabel(row.event_date),
    time: `${formatTimeLabel(row.start_time)} - ${formatTimeLabel(row.end_time)}`,
    location: row.location_name,
    address: row.address,
    applicationDeadline: row.application_deadline
      ? formatDateLabel(row.application_deadline)
      : "TBA",
    applicationFee: formatFee(row.application_fee),
    applicationsEnabled: row.applications_enabled,
    status: row.status,
  };
}

export const getEvents = cache(async () => {
  if (!hasSupabaseEnv()) {
    return fallbackEvents;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "title, slug, description, event_date, start_time, end_time, location_name, address, application_deadline, application_fee, applications_enabled, status",
    )
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
    .select(
      "title, slug, description, event_date, start_time, end_time, location_name, address, application_deadline, application_fee, applications_enabled, status",
    )
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
