export type MarketEvent = {
  title: string;
  slug: string;
  description: string;
  date: string;
  dateLabel: string;
  time: string;
  location: string;
  address: string;
  applicationDeadline: string;
  applicationFee: string;
  applicationsEnabled: boolean;
  status: "upcoming" | "completed" | "cancelled";
};

export const events: MarketEvent[] = [
  {
    title: "702Market Night Market",
    slug: "october-night-market",
    description:
      "An after-dark gathering of vintage hunters, local makers, collectors, and hungry shoppers in the heart of Las Vegas.",
    date: "2026-10-24",
    dateLabel: "October 24, 2026",
    time: "4:00 PM - 10:00 PM",
    location: "Downtown Las Vegas",
    address: "Downtown Las Vegas, NV",
    applicationDeadline: "October 10, 2026",
    applicationFee: "$50",
    applicationsEnabled: true,
    status: "upcoming",
  },
];

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}
