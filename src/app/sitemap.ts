import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/events";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = ["", "/about", "/apply", "/events", "/faq", "/merch", "/podcast", "/contact", "/socials", "/privacy", "/terms"];
  const staticEntries: MetadataRoute.Sitemap = pages.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/events" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
  const eventEntries: MetadataRoute.Sitemap = (await getEvents()).map((event) => ({
    url: `${siteConfig.url}/events/${event.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return [...staticEntries, ...eventEntries];
}
