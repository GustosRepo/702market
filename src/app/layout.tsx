import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const anton = localFont({
  src: "./fonts/Anton-Regular.ttf",
  variable: "--font-display",
  weight: "400",
  style: "normal",
  display: "swap",
});

const bebasNeueBold = localFont({
  src: "./fonts/BebasNeue-Bold.otf",
  variable: "--font-accent",
  weight: "700",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "MarketElla | Las Vegas Markets",
  description:
    "A lively Las Vegas market for vintage finds, handmade goods, food, local makers, and community events.",
  applicationName: "MarketElla",
  openGraph: {
    type: "website",
    siteName: "MarketElla",
    title: "MarketElla | Las Vegas Markets",
    description: "Not your average Las Vegas market. Shop small, eat well, and stay for the whole experience.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarketElla | Las Vegas Markets",
    description: "Not your average Las Vegas market.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${bebasNeueBold.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
