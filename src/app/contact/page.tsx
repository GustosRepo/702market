import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getSiteMedia } from "@/lib/site-media";

export const metadata = { title: "Contact | 702Market", description: "Get in touch with the 702Market team." };

export default async function ContactPage() {
  const siteMedia = await getSiteMedia();

  return (
    <main className="page-shell contact-page">
      <SiteHeader />
      <section className="content-intro contact-intro"><p className="eyebrow">Say hi</p><h1>Let&apos;s<br /><em>connect.</em></h1><p>Vendor questions, partnership ideas, or just want to say hello?</p></section>
      <section className="contact-content"><div><p className="eyebrow">Find us here</p><a className="contact-email" href="mailto:hello@702market.com">hello@702market.com</a><p>Las Vegas, Nevada<br />Follow along for market announcements.</p><div className="sprinkle-photo" style={{ "--asset-image": `url(${siteMedia.contactCommunity})` } as React.CSSProperties} aria-hidden="true" /></div><div className="contact-links"><a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram <span>↗</span></a><Link href="/events">Upcoming markets <span>↗</span></Link><Link href="/apply">Apply to sell <span>↗</span></Link></div></section>
      <SiteFooter actionHref="/faq" actionLabel="Read the FAQ" />
    </main>
  );
}
