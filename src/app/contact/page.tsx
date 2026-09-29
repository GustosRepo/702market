import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getSiteMedia } from "@/lib/site-media";

export const metadata = { title: "Contact | Marketella", description: "Get in touch with the Marketella team." };

export default async function ContactPage() {
  const siteMedia = await getSiteMedia();

  return (
    <main className="page-shell contact-page">
      <SiteHeader />
      <section className="content-intro contact-intro"><p className="eyebrow">comments? questions? concerns?</p><h1>tell us<br /><em>everything.</em></h1><p>Quick question, partnership idea, sponsorship thought, or vendor chaos? Send it our way.</p></section>
      <section className="contact-content"><div><p className="eyebrow">find us here</p><a className="contact-email" href="mailto:hello@702market.com">hello@702market.com</a><p>Las Vegas, Nevada<br />Follow along for market announcements, behind the scenes, and vendor love.</p><div className="sprinkle-photo" style={{ "--asset-image": `url(${siteMedia.contactCommunity})` } as React.CSSProperties} aria-hidden="true" /></div><div className="contact-links"><a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram <span>↗</span></a><a href="https://www.facebook.com" target="_blank" rel="noreferrer">Facebook <span>↗</span></a><a href="https://www.tiktok.com" target="_blank" rel="noreferrer">TikTok <span>↗</span></a><Link href="/events">Upcoming markets <span>↗</span></Link><Link href="/apply">Apply 2 sell <span>↗</span></Link></div></section>
      <SiteFooter actionHref="/faq" actionLabel="Read the FAQ" />
    </main>
  );
}
