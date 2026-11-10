export const siteConfig = {
  name: "MarketElla",
  legalName: "MarketElla LV LLC",
  email: "hello@702market.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://702marketweb.vercel.app").replace(/\/+$/, ""),
  socials: {
    instagram: "https://instagram.com/702market_",
    tiktok: "https://tiktok.com/@702_market",
    youtube: "https://www.youtube.com/channel/UCZFRdz1RiGJcPZMJ66_i-XA",
    linktree: "https://linktr.ee/702markets?utm_source=apple-wallet&utm_medium=qr_code&card=29656",
  },
  press: [
    {
      name: "channel 8",
      title: "702 Market celebrates 3 years of community",
      image: "/assets/site/img-3076-web.webp",
      imageAlt: "Shoppers browsing local vendors at MarketElla.",
      href: "https://www.8newsnow.com/news/local-news/702-market-celebrates-3-years-of-community",
    },
    {
      name: "influence.vegas",
      title: "From Grief to Growth: The 702 Market Story",
      image: "/assets/press/influence-vegas.webp",
      imageAlt: "A family photo featured in Influence.Vegas’s 702 Market story.",
      href: "https://influence.vegas/articles/from-grief-to-growth-the-702-market-story-samantha-sabrena",
    },
    {
      name: "fox 5",
      title: "Downtown Container Park hosting ‘Chismosas y Mimosas’ event",
      image: "/assets/press/fox-5.webp",
      imageAlt: "Downtown Container Park illuminated at night.",
      href: "https://www.fox5vegas.com/2026/08/25/downtown-container-park-hosting-chismosas-y-mimosas-event/",
    },
  ],
} as const;
