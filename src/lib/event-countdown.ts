import type { MarketEvent } from "@/data/events";

export type CountdownEvent = Pick<MarketEvent, "title" | "slug" | "dateLabel" | "time" | "location"> & {
  startsAt: number;
  endsAt: number;
};

const vegasOffset = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  timeZoneName: "longOffset",
});

// Event editors store local wall-clock times. Resolve the offset on the event's
// date, including daylight saving, independently of the server/browser timezone.
export function eventTimestamp(date: string, time: string) {
  const local = `${date}T${time.length === 5 ? `${time}:00` : time}`;
  let timestamp = Date.parse(`${local}Z`);
  if (!Number.isFinite(timestamp)) return NaN;
  for (let attempt = 0; attempt < 3; attempt++) {
    const zone = vegasOffset.formatToParts(timestamp).find((part) => part.type === "timeZoneName")?.value;
    const offset = zone?.replace("GMT", "") || "+00:00";
    const corrected = Date.parse(`${local}${offset}`);
    if (corrected === timestamp) break;
    timestamp = corrected;
  }
  return timestamp;
}

export function getCountdownEvents(events: MarketEvent[], now: number): CountdownEvent[] {
  return events.flatMap((event) => {
    if (event.status !== "upcoming") return [];
    const startsAt = eventTimestamp(event.date, event.startTime);
    let endsAt = eventTimestamp(event.date, event.endTime);
    if (endsAt <= startsAt) {
      const nextDay = new Date(`${event.date}T12:00:00Z`);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      endsAt = eventTimestamp(nextDay.toISOString().slice(0, 10), event.endTime);
    }
    if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt) || endsAt <= now) return [];
    return [{
      title: event.title,
      slug: event.slug,
      dateLabel: event.dateLabel,
      time: event.time,
      location: event.location,
      startsAt,
      endsAt,
    }];
  }).sort((a, b) => a.startsAt - b.startsAt);
}

export function prepareEventCountdown(events: MarketEvent[]) {
  const initialNow = Date.now();
  return { initialNow, events: getCountdownEvents(events, initialNow) };
}

export function countdownUnits(startsAt: number, now: number) {
  const seconds = Math.max(0, Math.ceil((startsAt - now) / 1000));
  return [
    { label: "Days", value: Math.floor(seconds / 86400) },
    { label: "Hours", value: Math.floor(seconds / 3600) % 24 },
    { label: "Minutes", value: Math.floor(seconds / 60) % 60 },
    { label: "Seconds", value: seconds % 60 },
  ];
}
