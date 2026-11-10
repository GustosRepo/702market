function dateOffset(days) {
  // Match the application's calendar day, including during UTC/Las Vegas date differences.
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const date = new Date(`${today}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export const vendorOptions = [
  {
    id: "00000000-0000-4000-8000-000000000011",
    application_type: "vendor",
    name: "Standard Vendor Space",
    description: "8 x 6 vendor space.",
    price: 95,
    capacity: null,
    active: true,
    sort_order: 0,
  },
  {
    id: "00000000-0000-4000-8000-000000000012",
    application_type: "food",
    name: "Food Truck",
    description: "Food truck vendor space.",
    price: 275,
    capacity: null,
    active: true,
    sort_order: 0,
  },
  {
    id: "00000000-0000-4000-8000-000000000013",
    application_type: "food",
    name: "Food Tent",
    description: "Food tent vendor space.",
    price: 175,
    capacity: null,
    active: true,
    sort_order: 1,
  },
];

export const openEvent = {
  id: "00000000-0000-4000-8000-000000000001",
  title: "E2E Night Market",
  slug: "e2e-night-market",
  description: "Vintage, handmade goods, and local food at our test market.",
  event_date: dateOffset(30),
  start_time: "16:00",
  end_time: "22:00",
  location_name: "Ferguson's Downtown",
  address: "1028 Fremont Street, Las Vegas, NV",
  hero_image: "/IMG_3076.JPG",
  application_open_date: dateOffset(-7),
  application_deadline: dateOffset(14),
  application_fee: 95,
  applications_enabled: true,
  general_applications_enabled: true,
  food_applications_enabled: true,
  application_notes: "Have your business license and booth photos ready.",
  food_application_notes: "Have your business license, health permit, logo, and setup photos ready.",
  application_rules: "Arrive on time, keep your booth clean, and stay for the full event.",
  food_application_rules: "Bring current permits, keep your setup clean, and stay for the full event.",
  status: "upcoming",
  published: true,
  archived_at: null,
  event_vendor_options: vendorOptions,
};

export const closedEvent = {
  ...openEvent,
  id: "00000000-0000-4000-8000-000000000002",
  title: "E2E Closed Market",
  location_name: "Arts District Courtyard",
  slug: "e2e-closed-market",
  application_deadline: dateOffset(-1),
};

export const pastEvent = {
  ...closedEvent,
  id: "00000000-0000-4000-8000-000000000003",
  title: "E2E Past Market",
  slug: "e2e-past-market",
  event_date: dateOffset(-30),
  status: "completed",
};

export const tables = {
  events: [openEvent, closedEvent, pastEvent],
  event_vendor_options: vendorOptions.map((option) => ({ ...option, event_id: openEvent.id })),
  site_media: [
    { slot: "home.gallery.1", storage_path: "/IMG_3076.JPG", alt_text: "Crowd browsing vendor tents at MarketElla.", caption: "Market days", sort_order: 1, active: true },
    { slot: "home.gallery.2", storage_path: "/IMG_3223.JPG", alt_text: "Vendor booth with clothing and accessories at MarketElla.", caption: "Vendor corners", sort_order: 2, active: true },
    { slot: "home.gallery.3", storage_path: "/IMG_3220.JPG", alt_text: "Music and vendor setup at an outdoor MarketElla event.", caption: "Good energy", sort_order: 3, active: true },
  ],
  site_content: [],
  podcast_episodes: [
    {
      title: "Inside the Night Market",
      slug: "inside-the-night-market",
      description: "Meet our local makers.",
      episode_number: 1,
      image_path: "/IMG_3215.JPG",
      listen_url: "https://example.test/podcast/1",
      published: true,
      sort_order: 0,
      archived_at: null,
    },
  ],
  merch_products: [
    {
      name: "MarketElla Test Tee",
      slug: "marketella-test-tee",
      description: "A shirt for market days.",
      display_price: 25,
      image_path: "/IMG_3215.JPG",
      external_url: "https://example.test/shop/tee",
      featured: true,
      active: true,
      sort_order: 0,
      archived_at: null,
    },
  ],
};
