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
    { slot: "home.gallery.4", storage_path: "/assets/site/dsc01138-web.webp", alt_text: "Pug riding in a pink stroller at MarketElla.", caption: "Furry friends welcome", sort_order: 4, active: true },
    { slot: "home.gallery.5", storage_path: "/assets/site/dsc01376-web.webp", alt_text: "Shopper carrying a cream 702 Market tote with a pink heart design.", caption: "Shop small, carry the love", sort_order: 5, active: true },
    { slot: "home.gallery.6", storage_path: "/assets/site/img-1279-web.webp", alt_text: "Whimsical Sweets vendor showing a pink treat at her MarketElla booth.", caption: "Something sweet", sort_order: 6, active: true },
    { slot: "home.gallery.7", storage_path: "/assets/site/img-1410-web.webp", alt_text: "Two vendors posing beside a vintage clothing display at MarketElla.", caption: "Meet the makers", sort_order: 7, active: true },
    { slot: "home.gallery.8", storage_path: "/assets/site/img-1485-web.webp", alt_text: "Two shoppers browsing racks of vintage clothing at MarketElla.", caption: "Find your next favorite", sort_order: 8, active: true },
    { slot: "home.gallery.9", storage_path: "/assets/site/img-1588-web.webp", alt_text: "Fashion boutique vendor posing beside colorful outfits and handbags at MarketElla.", caption: "Small business spotlight", sort_order: 9, active: true },
    { slot: "home.gallery.10", storage_path: "/assets/site/img-1599-web.webp", alt_text: "Guest posing in front of a pink, orange, and gold balloon backdrop at MarketElla.", caption: "Picture perfect moments", sort_order: 10, active: true },
    { slot: "home.gallery.11", storage_path: "/assets/site/img-1617-web.webp", alt_text: "DJ playing music at MarketElla outside Fergusons Downtown.", caption: "Good music, good company", sort_order: 11, active: true },
    { slot: "home.gallery.12", storage_path: "/assets/site/img-1622-web.webp", alt_text: "Guest wearing a cherry-patterned denim hat and carrying a small dog at MarketElla.", caption: "Bring your best friend", sort_order: 12, active: true },
    { slot: "home.gallery.13", storage_path: "/assets/site/img-1748-web.webp", alt_text: "Guests enjoying a MarketElla evening market under string lights.", caption: "Making memories together", sort_order: 13, active: true },
    { slot: "home.gallery.14", storage_path: "/assets/site/img-2420-web.webp", alt_text: "Family in costumes with face paint and treat bags at a MarketElla Halloween event.", caption: "A little spooky, a lot of fun", sort_order: 14, active: true },
    { slot: "home.gallery.15", storage_path: "/assets/site/img-2668-web.webp", alt_text: "Two friends posing together at MarketElla outside Fergusons Downtown.", caption: "Market days with your girls", sort_order: 15, active: true },
    { slot: "home.gallery.16", storage_path: "/assets/site/img-6780-web.webp", alt_text: "Couple standing beside a mirror and flowering wall at MarketElla.", caption: "A day out together", sort_order: 16, active: true },
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
