import Link from "next/link";
import Image from "next/image";
import SiteFooter from "@/components/site-footer";
import { getEvents } from "@/lib/events";
import { getSiteMedia } from "@/lib/site-media";

function getDateParts(dateLabel: string) {
  const [month = "", day = "", year = ""] = dateLabel.split(" ");

  return {
    day: day.replace(",", ""),
    month,
    year,
  };
}

export default async function Home() {
  const [events, siteMedia] = await Promise.all([getEvents(), getSiteMedia()]);
  const nextEvent = events.find((event) => event.status === "upcoming");
  const nextEventDate = nextEvent ? getDateParts(nextEvent.dateLabel) : null;

  return (
    <main>
      <section
        className="hero-section"
        style={{ "--hero-image": `url(${siteMedia.homeHero})` } as React.CSSProperties}
      >
        <nav className="site-nav" aria-label="Main navigation">
          <Link className="wordmark" href="/" aria-label="702Market home">
            702<span>Market</span>
          </Link>
          <div className="nav-links">
            <Link href="/events">Next market</Link>
            <Link href="/about">About</Link>
            <Link href="/merch">Merch</Link>
            <Link href="/socials">Socials</Link>
          </div>
          <Link className="nav-apply" href="/apply">
            Apply to sell <span aria-hidden="true">↗</span>
          </Link>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">Las Vegas, Nevada · Est. 2026</p>
          <h1>
            Find your <em>people.</em>
            <br />
            Find your <em>thing.</em>
          </h1>
          <p className="hero-copy">
            A night market for the collectors, makers, dreamers, and good
            shoppers of Las Vegas.
          </p>
          <Link className="button button-light" href="/events">
            See what&apos;s next <span aria-hidden="true">↓</span>
          </Link>
        </div>

        <div className="hero-note" aria-hidden="true">
          <span>Good finds</span>
          <span>Good people</span>
          <span>Good times</span>
        </div>
      </section>

      <section className="market-section" id="next-market">
        <div className="section-heading">
          <p className="eyebrow">Circle the date</p>
          <h2>The next one.</h2>
        </div>
        <div className="event-feature">
          {nextEventDate ? (
            <div className="event-date">
              <span>{nextEventDate.day}</span>
              <small>{nextEventDate.month.slice(0, 3)}<br />{nextEventDate.year}</small>
            </div>
          ) : null}
          <div className="event-details">
            <p className="event-kicker">{nextEvent?.title || "702Market event"}</p>
            <h3>{nextEvent ? nextEvent.location : "More dates soon."}</h3>
            <p>
              {nextEvent
                ? `${nextEvent.dateLabel} · ${nextEvent.time} · ${nextEvent.location}`
                : "Check back for the next Las Vegas market."}
            </p>
          </div>
          <Link className="button button-dark" href={nextEvent ? `/events/${nextEvent.slug}` : "/events"}>
            Event details <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="about-section" id="about">
        <div
          className="about-photo"
          style={{ "--asset-image": `url(${siteMedia.aboutStory})` } as React.CSSProperties}
          aria-hidden="true"
        >
          <div className="about-stamp">LV<br /><span>702</span></div>
        </div>
        <div className="about-copy">
          <p className="eyebrow">A market with a pulse</p>
          <h2>Made for the wonderfully <em>different.</em></h2>
          <p>
            702Market brings together local artists, vintage hunters, small
            businesses, and the people who love finding something they didn&apos;t
            know they needed.
          </p>
        </div>
      </section>

      <section className="media-section" aria-labelledby="media-heading">
        <div className="section-heading">
          <p className="eyebrow">Scenes from the market</p>
          <h2 id="media-heading">A little<br /><em>texture.</em></h2>
        </div>
        <div className="media-grid">
          {siteMedia.homeGallery.map((photo, index) => (
            <figure className={`media-card media-card-${index + 1}`} key={photo.src}>
              <Image src={photo.src} alt={photo.alt} width={1200} height={1500} sizes="(max-width: 680px) 100vw, 30vw" />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="vendor-section" id="vendor">
        <div>
          <p className="eyebrow">Bring your best stuff</p>
          <h2>Make a little room<br /><em>for your table.</em></h2>
        </div>
        <div className="vendor-action">
          <p>{nextEvent ? `Applications for ${nextEvent.title} are open now.` : "Applications will open with the next market announcement."}</p>
          <Link className="button button-accent" href={nextEvent ? `/apply/${nextEvent.slug}` : "/apply"}>
            Apply to sell <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="merch-section" id="merch">
        <div>
          <p className="eyebrow">Wear the neighborhood</p>
          <h2>Market<br /><em>merch.</em></h2>
        </div>
        <a className="merch-tile" href="/merch">
          <span className="merch-circle">702</span>
          <span>Shop the drop <b aria-hidden="true">↗</b></span>
        </a>
      </section>

      <SiteFooter actionHref="mailto:hello@702market.com" actionLabel="hello@702market.com" />
    </main>
  );
}
