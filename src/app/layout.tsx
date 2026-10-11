import type { Metadata } from "next";
import { Archivo_Black, Chakra_Petch, DM_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const chakraPetch = Chakra_Petch({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
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
      className={`${archivoBlack.variable} ${chakraPetch.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
