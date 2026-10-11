import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getSiteMedia } from "@/lib/site-media";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Socials | MarketElla",
  description: "Keep up with MarketElla events, vendors, and new finds.",
};

const channels = [
  { name: "Instagram", handle: "@702market_", detail: "Market drops, vendor love, and pretty finds.", href: siteConfig.socials.instagram },
  { name: "TikTok", handle: "@702_market", detail: "Come wander the market with us.", href: siteConfig.socials.tiktok },
  { name: "YouTube", handle: "702 Market", detail: "Interviews, recaps, and the full market story.", href: siteConfig.socials.youtube },
  { name: "Linktree", handle: "702markets", detail: "Every official MarketElla link in one place.", href: siteConfig.socials.linktree },
  { name: "Email", handle: siteConfig.email, detail: "For questions, collabs, and good ideas.", href: `mailto:${siteConfig.email}` },
];

export default async function SocialsPage() {
  const siteMedia = await getSiteMedia();

  return (
    <main className="page-shell socials-page">
      <SiteHeader />
      <section className="content-intro socials-intro">
        <p className="eyebrow">link tree</p>
        <h1>find us<br /><em>everywhere.</em></h1>
        <p>New markets, new vendors, chisme, behind the scenes, and things you will want to send your friends.</p>
      </section>
      <section className="social-grid" aria-label="MarketElla social channels">
        {channels.map((channel, index) => (
          <a className={`social-card social-card-${index + 1}`} href={channel.href} key={channel.name} target={channel.href.startsWith("http") ? "_blank" : undefined} rel={channel.href.startsWith("http") ? "noreferrer" : undefined}>
            <span className="social-icon" aria-hidden="true">{index === 0 ? "◎" : index === 1 ? "♪" : index === 2 ? "▶" : index === 3 ? "↗" : "✉"}</span>
            <div><p className="eyebrow">{channel.name}</p><h2>{channel.handle}</h2><p>{channel.detail}</p></div>
            <span className="social-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </section>
      <section className="social-cta">
        <div><p className="eyebrow">the next good thing</p><h2>meet us<br /><em>in person.</em></h2></div>
        <div className="sprinkle-photo social" style={{ "--asset-image": `url(${siteMedia.socialCta})` } as React.CSSProperties} aria-hidden="true" />
        <Link className="button button-dark" href="/events">See upcoming markets ↗</Link>
      </section>
      <SiteFooter actionHref="/contact" actionLabel="Say hello" />
    </main>
  );
}
