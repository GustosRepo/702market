import type { MarketEvent } from "@/data/events";

function formatCalendarDate(date: string, time: string) {
  return `${date.replaceAll("-", "")}T${time.replace(":", "")}00`;
}

function escapeIcsValue(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

export function getMapUrl(event: MarketEvent) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.location}, ${event.address}`)}`;
}

export function getGoogleCalendarUrl(event: MarketEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: `${event.location}, ${event.address}`,
    dates: `${formatCalendarDate(event.date, event.startTime)}/${formatCalendarDate(event.date, event.endTime)}`,
    ctz: "America/Los_Angeles",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getIcsCalendar(event: MarketEvent) {
  const stamp = new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}/, "");
  const location = `${event.location}, ${event.address}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MarketElla//Market Calendar//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@marketella.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/Los_Angeles:${formatCalendarDate(event.date, event.startTime)}`,
    `DTEND;TZID=America/Los_Angeles:${formatCalendarDate(event.date, event.endTime)}`,
    `SUMMARY:${escapeIcsValue(event.title)}`,
    `DESCRIPTION:${escapeIcsValue(event.description)}`,
    `LOCATION:${escapeIcsValue(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
