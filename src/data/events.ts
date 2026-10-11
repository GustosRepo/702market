export type MarketEvent = {
  title: string;
  slug: string;
  description: string;
  date: string;
  dateLabel: string;
  time: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  heroImage: string;
  applicationOpenDate: string | null;
  applicationDeadlineDate: string | null;
  applicationDeadline: string;
  applicationFee: string;
  applicationsEnabled: boolean;
  generalApplicationsEnabled: boolean;
  foodApplicationsEnabled: boolean;
  applicationNotes: string;
  foodApplicationNotes: string;
  applicationRules: string;
  foodApplicationRules: string;
  vendorOptions: EventVendorOption[];
  status: "upcoming" | "completed" | "cancelled";
};

export type ApplicationType = "vendor" | "food";

export type EventVendorOption = {
  id: string;
  applicationType: ApplicationType;
  name: string;
  description: string;
  price: number;
  capacity: number | null;
  active: boolean;
  sortOrder: number;
};

export const events: MarketEvent[] = [
  {
    title: "MarketElla Night Market",
    slug: "october-night-market",
    description:
      "An after-dark MarketElla gathering of vintage hunters, local makers, collectors, and hungry shoppers in the heart of Las Vegas.",
    date: "2026-10-24",
    dateLabel: "October 24, 2026",
    time: "4:00 PM - 10:00 PM",
    startTime: "16:00",
    endTime: "22:00",
    location: "Downtown Las Vegas",
    address: "Downtown Las Vegas, NV",
    heroImage: "/assets/events/october-night-market-hero.jpg",
    applicationOpenDate: null,
    applicationDeadlineDate: "2026-10-10",
    applicationDeadline: "October 10, 2026",
    applicationFee: "$95",
    applicationsEnabled: true,
    generalApplicationsEnabled: true,
    foodApplicationsEnabled: true,
    applicationNotes:
      "Before continuing, have your business details, license, and clear booth or product photos ready to upload.",
    foodApplicationNotes:
      "Before continuing, have your business license, health permit, menu, logo, setup measurements, and truck or tent photos ready.",
    applicationRules:
      "Only approved products may be sold. Vendors must arrive on time, keep their space clean, remain for the full event, and treat staff, shoppers, and other vendors respectfully. Fees are non-refundable and non-transferable.",
    foodApplicationRules:
      "Food vendors must carry all required business and health permits, provide safe working equipment and their own power unless stated otherwise, sell only the approved menu, keep the setup clean, and remain open for the full event. Fees are non-refundable and non-transferable.",
    vendorOptions: [
      {
        id: "fallback-standard-vendor",
        applicationType: "vendor",
        name: "Standard Vendor Space",
        description: "8 x 6 vendor space.",
        price: 95,
        capacity: null,
        active: true,
        sortOrder: 0,
      },
      {
        id: "fallback-food-truck",
        applicationType: "food",
        name: "Food Truck",
        description: "Food truck vendor space.",
        price: 275,
        capacity: null,
        active: true,
        sortOrder: 0,
      },
      {
        id: "fallback-food-tent",
        applicationType: "food",
        name: "Food Tent",
        description: "Food tent vendor space.",
        price: 175,
        capacity: null,
        active: true,
        sortOrder: 1,
      },
    ],
    status: "upcoming",
  },
];

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}
