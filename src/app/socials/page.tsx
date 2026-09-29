import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getSiteMedia } from "@/lib/site-media";

export const metadata = {
  title: "Socials | Marketella",
  description: "Keep up with Marketella events, vendors, and new finds.",
};

const channels = [
  { name: "Instagram", handle: "@marketella", detail: "Market drops, vendor love, and pretty finds.", href: "https://www.instagram.com/" },
  { name: "Facebook", handle: "Marketella", detail: "Dates, locations, recaps, and community updates.", href: "https://www.facebook.com/" },
  { name: "TikTok", handle: "@marketella", detail: "Come wander the market with us.", href: "https://www.tiktok.com/" },
  { name: "Email", handle: "hello@702market.com", detail: "For questions, collabs, and good ideas.", href: "mailto:hello@702market.com" },
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
      <section className="social-grid" aria-label="Marketella social channels">
        {channels.map((channel, index) => (
          <a className={`social-card social-card-${index + 1}`} href={channel.href} key={channel.name} target={channel.href.startsWith("http") ? "_blank" : undefined} rel={channel.href.startsWith("http") ? "noreferrer" : undefined}>
            <span className="social-icon" aria-hidden="true">{index === 0 ? "◎" : index === 1 ? "f" : index === 2 ? "♪" : "✉"}</span>
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
