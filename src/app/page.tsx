import Image from "next/image";
import Link from "next/link";
import ContactFormSection from "@/components/contact-form-section";
import DetailedButterfly from "@/components/detailed-butterfly";
import MarqueeBand from "@/components/marquee-band";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getEvents, isUpcomingEvent } from "@/lib/events";
import { siteConfig } from "@/lib/site-config";
import { getHomepageContent } from "@/lib/homepage-content";
import { getSiteMedia } from "@/lib/site-media";

export default async function Home() {
  const [events, siteMedia, homepageContent] = await Promise.all([
    getEvents(),
    getSiteMedia(),
    getHomepageContent(),
  ]);
  const upcomingEvents = events.filter(isUpcomingEvent);
  const newLocation = homepageContent.newLocation;
  const nextMarketPanels = [
    {
      event: upcomingEvents[0],
      image: "/IMG_3217.JPG",
      fallbackTitle: "more dates soon",
      fallbackSubtitle: "The next MarketElla date is on the way.",
      fallbackButtonLabel: "calendar info",
    },
    {
      event: upcomingEvents[1],
      image: "/IMG_3226.JPG",
      fallbackTitle: "new markets soon",
      fallbackSubtitle: "Keep an eye on the calendar for the next drop.",
      fallbackButtonLabel: "more info",
    },
  ];

  return (
    <main className="marketella-home">
      <section
        className="marketella-hero"
        style={{ "--hero-image": `url(${siteMedia.homeHero})` } as React.CSSProperties}
      >
        <SiteHeader ariaLabel="Main navigation" calendarHref="#calendar" variant="hero" />

        <div className="butterfly-field" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, index) => (
            <DetailedButterfly className="butterfly-svg" animated key={index} />
          ))}
        </div>

        <div className="hero-content marketella-hero-content">
          <h1 aria-label="WELCOME 2 MARKETELLA">
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
              <text className="hero-title-welcome" textAnchor="middle">
                <textPath
                  href="#home-hero-welcome-arch"
                  startOffset="50%"
                  textLength="780"
                  lengthAdjust="spacingAndGlyphs"
                >
                  WELCOME 2
                </textPath>
              </text>{" "}
              <text className="hero-title-marketella" textAnchor="middle">
                <textPath
                  href="#home-hero-marketella-arch"
                  startOffset="50%"
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

      {newLocation.active ? (
        <section
          className="new-location-section"
          aria-labelledby="new-location-heading"
          style={
            {
              "--new-location-strip-image": `url(${siteMedia.newLocationStrip})`,
            } as React.CSSProperties
          }
        >
          <MarqueeBand
            className="marquee-soft"
            label={newLocation.topMarqueePhrases[0]}
            phrases={newLocation.topMarqueePhrases}
          />
          <div className="spray-butterfly spray-butterfly-left" aria-hidden="true">
            <DetailedButterfly />
          </div>
          <div className="spray-butterfly spray-butterfly-right" aria-hidden="true">
            <DetailedButterfly />
          </div>
          <div className="new-location-content">
            <h2 id="new-location-heading">
              {newLocation.headingLabel}
              <br />
              {newLocation.locationName}
            </h2>
            <p>{newLocation.description}</p>
            <Link className="new-location-button" href={newLocation.buttonHref}>
              {newLocation.buttonLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <MarqueeBand
            className="marquee-apply"
            label={newLocation.bottomMarqueePhrases[0]}
            phrases={newLocation.bottomMarqueePhrases}
          />
        </section>
      ) : null}

      <section className="market-section marketella-next" id="calendar" aria-labelledby="next-market-heading">
        <h2 className="visually-hidden" id="next-market-heading">Upcoming markets</h2>
        {nextMarketPanels.map((panel, index) => {
          const href = panel.event ? `/events/${panel.event.slug}` : "/events";
          const title = panel.event ? panel.event.location : panel.fallbackTitle;
          const subtitle = panel.event ? panel.event.title : panel.fallbackSubtitle;
          const buttonLabel = panel.event ? "market info" : panel.fallbackButtonLabel;

          return (
            <article className="next-market-panel" key={`${title}-${index}`}>
              <Image
                src={panel.image}
                alt={panel.event ? `${panel.event.title} at ${panel.event.location}.` : "MarketElla vendor setup."}
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
              <div className="next-market-panel-content">
                <p className="next-market-tag">next market</p>
                <div>
                  <h3>{title}</h3>
                  <p>{subtitle}</p>
                </div>
                <Link className="next-market-info" href={href}>
                  {buttonLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="press-strip" aria-labelledby="press-heading">
        <h2 id="press-heading">
          the big leagues called.
          <br />
          obviously we answered
        </h2>
        <div className="press-copy">
          <p className="press-kicker">maybe you&apos;ve heard of us???</p>
          <p>idk we&apos;ve been in a few papers hehe.</p>
          <div className="press-links" aria-label="Press links">
            {siteConfig.press.map((link, index) => (
              <a href={link.href} key={link.name} target="_blank" rel="noreferrer">
                {link.name}
                {index < siteConfig.press.length - 1 ? <span aria-hidden="true"> • </span> : null}
              </a>
            ))}
          </div>
        </div>
      </section>

      <ContactFormSection />

      <SiteFooter actionHref="/apply" actionLabel="Apply 2 sell" />
    </main>
  );
}
