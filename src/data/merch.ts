export type MerchProduct = {
  name: string;
  slug: string;
  description: string;
  price: string;
  featured: boolean;
};

export const merchProducts: MerchProduct[] = [
  {
    name: "702 Logo Tee",
    slug: "702-logo-tee",
    description: "A soft cotton staple for market nights and regular days.",
    price: "$30",
    featured: true,
  },
  {
    name: "Market Day Cap",
    slug: "market-day-cap",
    description: "A pink embroidered cap for your next good find.",
    price: "$25",
    featured: false,
  },
];
