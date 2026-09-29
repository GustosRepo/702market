import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getSiteMedia } from "@/lib/site-media";

export const metadata = { title: "About | Marketella", description: "Meet Marketella, a creative market family in Las Vegas." };

export default async function AboutPage() {
  const siteMedia = await getSiteMedia();

  return (
    <main className="page-shell about-page">
      <SiteHeader />
      <section className="content-intro about-intro"><p className="eyebrow">what is marketella?</p><h1>not your<br /><em>average market.</em></h1><p>Marketella began as 702 Market: two sisters, one family, local businesses, and a lot of ideas for getting Vegas out of the house.</p></section>
      <section className="story-section"><div className="about-photo large" style={{ "--asset-image": `url(${siteMedia.aboutStory})` } as React.CSSProperties} aria-hidden="true"><div className="about-stamp">est.<br /><span>2023</span></div></div><div><p className="eyebrow">our thing</p><h2>market talk.<br />real stories.<br /><em>good chaos.</em></h2><p>Every market has its own personality: night out, family day, cultura, food, photo ops, and small businesses worth remembering.</p><Link className="button button-accent" href="/events">Find the next market ↗</Link></div></section>
      <section className="about-gallery" aria-label="Marketella photo moments">
        {siteMedia.aboutGallery.map((photo, index) => (
          <figure className={`media-card media-card-${index + 1}`} key={photo.src}>
            <Image src={photo.src} alt={photo.alt} width={1200} height={1500} sizes="(max-width: 680px) 100vw, 25vw" />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </section>
      <SiteFooter actionHref="/apply" actionLabel="Sell with us" />
    </main>
  );
}
