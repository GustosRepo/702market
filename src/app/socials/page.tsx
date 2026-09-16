import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Socials | 702Market",
  description: "Keep up with 702Market events, vendors, and new finds.",
};

const channels = [
  { name: "Instagram", handle: "@702market", detail: "Market drops, vendor love, and pretty finds.", href: "https://www.instagram.com/" },
  { name: "TikTok", handle: "@702market", detail: "Come wander the market with us.", href: "https://www.tiktok.com/" },
  { name: "Email", handle: "hello@702market.com", detail: "For questions, collabs, and good ideas.", href: "mailto:hello@702market.com" },
];

export default function SocialsPage() {
  return (
    <main className="page-shell socials-page">
      <SiteHeader />
      <section className="content-intro socials-intro">
        <p className="eyebrow">Stay in the loop</p>
        <h1>Find us<br /><em>everywhere.</em></h1>
        <p>New markets, new vendors, new things to love. Follow along so you don&apos;t miss the next one.</p>
      </section>
      <section className="social-grid" aria-label="702Market social channels">
        {channels.map((channel, index) => (
          <a className={`social-card social-card-${index + 1}`} href={channel.href} key={channel.name} target={index < 2 ? "_blank" : undefined} rel={index < 2 ? "noreferrer" : undefined}>
            <span className="social-icon" aria-hidden="true">{index === 0 ? "◎" : index === 1 ? "♪" : "✉"}</span>
            <div><p className="eyebrow">{channel.name}</p><h2>{channel.handle}</h2><p>{channel.detail}</p></div>
            <span className="social-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </section>
      <section className="social-cta">
        <div><p className="eyebrow">The next good thing</p><h2>Meet us<br /><em>in person.</em></h2></div>
        <Link className="button button-dark" href="/events">See upcoming markets ↗</Link>
      </section>
      <SiteFooter actionHref="/contact" actionLabel="Say hello" />
    </main>
  );
}
