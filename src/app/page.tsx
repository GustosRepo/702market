import Image from "next/image";
import Link from "next/link";
import ContactFormSection from "@/components/contact-form-section";
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
            <svg className="butterfly-svg" viewBox="0 0 96 72" focusable="false" key={index}>
              <path className="wing wing-left" d="M45 36C34 8 7 3 4 23c-3 18 18 31 38 21 2-1 4-4 3-8Z" />
              <path className="wing wing-right" d="M51 36C62 8 89 3 92 23c3 18-18 31-38 21-2-1-4-4-3-8Z" />
              <path className="lower-wing lower-left" d="M43 40C25 40 14 52 20 63c6 10 24 3 29-16 1-4-1-7-6-7Z" />
              <path className="lower-wing lower-right" d="M53 40c18 0 29 12 23 23-6 10-24 3-29-16-1-4 1-7 6-7Z" />
              <path className="butterfly-body" d="M48 25c4 0 7 7 7 17s-3 22-7 22-7-12-7-22 3-17 7-17Z" />
              <path className="antenna" d="M45 28C38 17 31 14 24 15M51 28c7-11 14-14 21-13" />
            </svg>
          ))}
        </div>

        <div className="hero-content marketella-hero-content">
          <h1>WELCOME 2 MARKETELLA</h1>
          <p className="hero-copy">
            Not your average Las Vegas market. Shopping, food, music, photo ops,
            family, friends, and cute finds you did not plan on taking home.
          </p>
          <div className="hero-actions">
            <Link className="button button-light" href="/events">
              Tell me more <span aria-hidden="true">↓</span>
            </Link>
            <Link className="button button-accent" href="/apply">
              Apply 2 sell <span aria-hidden="true">↗</span>
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
            <svg viewBox="0 0 180 130" focusable="false">
              <path d="M82 64C55 4 7 16 14 56c6 35 45 42 68 19 4-4 4-8 0-11Z" />
              <path d="M98 64c27-60 75-48 68-8-6 35-45 42-68 19-4-4-4-8 0-11Z" />
              <path d="M78 73c-38 1-54 31-31 47 20 14 46-7 43-35-1-8-5-12-12-12Z" />
              <path d="M102 73c38 1 54 31 31 47-20 14-46-7-43-35 1-8 5-12 12-12Z" />
            </svg>
          </div>
          <div className="spray-butterfly spray-butterfly-right" aria-hidden="true">
            <svg viewBox="0 0 180 130" focusable="false">
              <path d="M82 64C55 4 7 16 14 56c6 35 45 42 68 19 4-4 4-8 0-11Z" />
              <path d="M98 64c27-60 75-48 68-8-6 35-45 42-68 19-4-4-4-8 0-11Z" />
              <path d="M78 73c-38 1-54 31-31 47 20 14 46-7 43-35-1-8-5-12-12-12Z" />
              <path d="M102 73c38 1 54 31 31 47-20 14-46-7-43-35 1-8 5-12 12-12Z" />
            </svg>
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
