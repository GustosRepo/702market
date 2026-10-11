export const siteConfig = {
  name: "MarketElla",
  legalName: "MarketElla LV LLC",
  email: "hello@702market.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://702marketweb.vercel.app").replace(/\/+$/, ""),
  socials: {
    instagram: "https://instagram.com/702market_",
    tiktok: "https://tiktok.com/@702_market",
    youtube: "https://www.youtube.com/channel/UCZFRdz1RiGJcPZMJ66_i-XA",
    linktree: "https://linktr.ee/702markets",
  },
  press: [
    {
      name: "channel 8",
      href: "https://www.8newsnow.com/news/local-news/702-market-celebrates-3-years-of-community",
    },
    {
      name: "influence.vegas",
      href: "https://influence.vegas/articles/from-grief-to-growth-the-702-market-story-samantha-sabrena",
    },
    {
      name: "fox 5",
      href: "https://www.fox5vegas.com/2026/08/25/downtown-container-park-hosting-chismosas-y-mimosas-event/",
    },
  ],
} as const;
