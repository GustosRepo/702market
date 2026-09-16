import type { Metadata } from "next";
import { Cherry_Bomb_One, DM_Sans, DynaPuff } from "next/font/google";
import "./globals.css";

const cherryBomb = Cherry_Bomb_One({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const dynaPuff = DynaPuff({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "702Market | Las Vegas Night Markets",
  description:
    "A lively Las Vegas market for vintage finds, handmade goods, food, and local makers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cherryBomb.variable} ${dynaPuff.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
