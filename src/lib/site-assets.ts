export const siteAssets = {
  homeHero: "/assets/site/home-hero.jpg",
  aboutStory: "/assets/site/about-story.jpg",
  contactCommunity: "/assets/site/contact-community.jpg",
  socialCta: "/assets/site/social-cta.jpg",
  homeGallery: [
    {
      src: "/IMG_3076.JPG",
      alt: "Crowd browsing vendor tents at 702Market.",
      caption: "Market days",
    },
    {
      src: "/IMG_3223.JPG",
      alt: "Vendor booth with clothing and accessories at 702Market.",
      caption: "Vendor corners",
    },
    {
      src: "/IMG_3220.JPG",
      alt: "Music and vendor setup at an outdoor 702Market event.",
      caption: "Good energy",
    },
  ],
  aboutGallery: [
    {
      src: "/IMG_3224.JPG",
      alt: "702 Market photo wall with flowers and a pink cart.",
      caption: "The photo wall",
    },
    {
      src: "/IMG_3214.JPG",
      alt: "Friends holding shopping bags at 702Market.",
      caption: "Shopping together",
    },
    {
      src: "/IMG_3221.JPG",
      alt: "A 702Market vendor moment.",
      caption: "Local vendors",
    },
    {
      src: "/IMG_3225.JPG",
      alt: "Details from a 702Market setup.",
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
