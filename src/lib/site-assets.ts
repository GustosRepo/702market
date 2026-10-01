export const siteAssets = {
  homeHero: "/assets/site/home-hero.jpg",
  aboutStory: "/assets/site/about-story.jpg",
  contactCommunity: "/assets/site/contact-community.jpg",
  socialCta: "/assets/site/social-cta.jpg",
  newLocationStrip: "/IMG_3226.JPG",
  homeGallery: [
    {
      src: "/IMG_3076.JPG",
      alt: "Crowd browsing vendor tents at Marketella.",
      caption: "Market days",
    },
    {
      src: "/IMG_3223.JPG",
      alt: "Vendor booth with clothing and accessories at Marketella.",
      caption: "Vendor corners",
    },
    {
      src: "/IMG_3220.JPG",
      alt: "Music and vendor setup at an outdoor Marketella event.",
      caption: "Good energy",
    },
  ],
  aboutGallery: [
    {
      src: "/IMG_3224.JPG",
      alt: "Marketella photo wall with flowers and a pink cart.",
      caption: "The photo wall",
    },
    {
      src: "/IMG_3214.JPG",
      alt: "Friends holding shopping bags at Marketella.",
      caption: "Shopping together",
    },
    {
      src: "/IMG_3221.JPG",
      alt: "A Marketella vendor moment.",
      caption: "Local vendors",
    },
    {
      src: "/IMG_3225.JPG",
      alt: "Details from a Marketella setup.",
      caption: "Tiny details",
    },
  ],
};

export function eventHeroAsset(slug: string) {
  return `/assets/events/${slug}-hero.jpg`;
}

export function merchAsset(slug: string) {
  return `/assets/merch/${slug}.jpg`;
}
