import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import ContactFormSection from "@/components/contact-form-section";
import EventCountdown from "@/components/event-countdown";
import PhotoCarousel from "@/components/photo-carousel";
import DetailedButterfly from "@/components/detailed-butterfly";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getEvents } from "@/lib/events";
import { prepareEventCountdown } from "@/lib/event-countdown";
import { siteConfig } from "@/lib/site-config";
import { getHomepageContent } from "@/lib/homepage-content";
import { getSiteMedia } from "@/lib/site-media";

const shrikhand = localFont({
  src: "./fonts/Shrikhand-Regular.ttf",
  variable: "--font-hero",
  weight: "400",
  style: "normal",
  display: "swap",
});

export default async function Home() {
  const [events, siteMedia, homepageContent] = await Promise.all([
    getEvents(),
    getSiteMedia(),
    getHomepageContent(),
  ]);
  const countdown = homepageContent.countdown;
  const countdownData = prepareEventCountdown(events);

  return (
    <main className="marketella-home">
      <section
        className="marketella-hero"
        style={{ "--hero-image": `url(${siteMedia.homeHero})` } as React.CSSProperties}
      >
        <SiteHeader ariaLabel="Main navigation" variant="hero" />

        <div className="butterfly-field" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, index) => (
            <DetailedButterfly className="butterfly-svg" animated key={index} />
          ))}
        </div>

        <div className="hero-content marketella-hero-content">
          <h1 className={shrikhand.variable} aria-label="WELCOME 2 MARKETELLA">
            <svg
              className="hero-title-curve"
              viewBox="0 0 1200 470"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <path id="home-hero-welcome-arch" d="M 180 200 Q 600 40 1020 200" />
                <path id="home-hero-marketella-arch" d="M 60 425 Q 600 185 1140 425" />
              </defs>
              {/* Half the spare path length centers text without Safari's stretched-text anchor bug. */}
              <text className="hero-title-welcome" textAnchor="start">
                <textPath
                  href="#home-hero-welcome-arch"
                  startOffset="39.949"
                  textLength="780"
                  lengthAdjust="spacingAndGlyphs"
                >
                  WELCOME 2
                </textPath>
              </text>{" "}
              <text className="hero-title-marketella" textAnchor="start">
                <textPath
                  href="#home-hero-marketella-arch"
                  startOffset="7.285"
                  textLength="1100"
                  lengthAdjust="spacingAndGlyphs"
                >
                  MARKETELLA
                </textPath>
              </text>
            </svg>
          </h1>
          <p className="hero-copy">Not your average Las Vegas market</p>
          <div className="hero-actions">
            <Link className="button button-light" href="/events">
              Tell me more <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-accent" href="/apply">
              Apply 2 sell <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {countdown.active ? (
        <EventCountdown content={countdown} events={countdownData.events} initialNow={countdownData.initialNow} />
      ) : null}

      <PhotoCarousel photos={siteMedia.homeGallery} />

      <section className="press-strip" aria-labelledby="press-heading">
        <h2 id="press-heading">
          the big leagues called.
          <br />
          obviously we answered
        </h2>
        <div className="press-copy">
          <p className="press-kicker">maybe you&apos;ve heard of us???</p>
          <p>idk we&apos;ve been making headlines, hitting your screens, and spilling the story on a few podcasts hehe.</p>
        </div>
        <div className="press-links" aria-label="Press links">
          {siteConfig.press.map((link) => (
            <a className="press-card" href={link.href} key={link.href} target="_blank" rel="noreferrer">
              <div className="press-card-image">
                <Image src={link.image} alt={link.imageAlt} fill sizes="(max-width: 680px) 90vw, (max-width: 900px) 45vw, 33vw" style={{ objectFit: link.type === "Podcast" || link.type === "Instagram" ? "contain" : "cover" }} />
                <span className="press-card-type">{link.type}</span>
              </div>
              <div className="press-card-body">
                <p className="press-card-outlet">{link.name}</p>
                <h3 className="press-card-title">{link.title}</h3>
                <span className="press-card-cta">{link.cta} <span aria-hidden="true">↗</span></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <ContactFormSection />

      <SiteFooter />
    </main>
  );
}
