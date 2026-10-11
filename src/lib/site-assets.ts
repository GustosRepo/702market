export const siteAssets = {
  homeHero: "/assets/site/home-hero-web.webp",
  aboutStory: "/assets/site/about-story-web.webp",
  contactCommunity: "/assets/site/contact-community-web.webp",
  socialCta: "/assets/site/social-cta-web.webp",
  newLocationStrip: "/assets/site/img-3226-web.webp",
  homeGallery: [
    {
      src: "/IMG_3076.JPG",
      alt: "Crowd browsing vendor tents at MarketElla.",
      caption: "Market days",
    },
    {
      src: "/IMG_3223.JPG",
      alt: "Vendor booth with clothing and accessories at MarketElla.",
      caption: "Vendor corners",
    },
    {
      src: "/IMG_3220.JPG",
      alt: "Music and vendor setup at an outdoor MarketElla event.",
      caption: "Good energy",
    },
  ],
  aboutGallery: [
    {
      src: "/IMG_3224.JPG",
      alt: "MarketElla photo wall with flowers and a pink cart.",
      caption: "The photo wall",
    },
    {
      src: "/IMG_3214.JPG",
      alt: "Friends holding shopping bags at MarketElla.",
      caption: "Shopping together",
    },
    {
      src: "/IMG_3221.JPG",
      alt: "A MarketElla vendor moment.",
      caption: "Local vendors",
    },
    {
      src: "/IMG_3225.JPG",
      alt: "Details from a MarketElla setup.",
      caption: "Tiny details",
    },
  ],
};

export function merchAsset(slug: string) {
  return `/assets/merch/${slug}.jpg`;
}
