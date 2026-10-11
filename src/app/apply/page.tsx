import Image from "next/image";
import Link from "next/link";
import ContactFormSection from "@/components/contact-form-section";
import MarqueeBand from "@/components/marquee-band";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getEvents, isApplicationTypeOpen } from "@/lib/events";
import { getSiteMedia } from "@/lib/site-media";

export const metadata = {
  title: "Apply 2 Sell | MarketElla",
  description: "Choose a MarketElla event and apply to be a vendor.",
};

const applyLocations = [
  {
    name: "fergusons downtown",
    tagline: "we take over the street.",
    description:
      "Our biggest themed markets with 70+ small businesses and full-on experiences.",
    image: "/IMG_3076.JPG",
  },
  {
    name: "cowabunga canyon",
    tagline: "where the whole family comes to play",
    description:
      "Family friendly themed markets filled with shopping, food, activities, and fun for all ages.",
    image: "/IMG_3223.JPG",
  },
  {
    name: "container park",
    tagline: "cultura meets community",
    description:
      "Culturally inspired markets celebrating our Latino community.",
    image: "/IMG_3224.JPG",
  },
];

export default async function ApplyPage() {
  const [events, siteMedia] = await Promise.all([getEvents(), getSiteMedia()]);
  const openEvents = events.filter(
    (event) =>
      isApplicationTypeOpen(event, "vendor") ||
      isApplicationTypeOpen(event, "food"),
  );

  return (
    <main className="page-shell apply-page">
      <section
        className="apply-hero"
        style={{ "--hero-image": `url(${siteMedia.socialCta})` } as React.CSSProperties}
      >
        <SiteHeader ariaLabel="Apply page navigation" className="apply-hero-nav" variant="hero" />

        <MarqueeBand
          className="apply-hero-marquee"
          label="not your average market"
          phrases={["where everyone's a star", "not your average market"]}
        />

        <div className="apply-hero-content">
          <h1>want 2 grow<br />ur business?</h1>
          <div className="apply-hero-quote">
            <Link className="button button-light" href="#open-applications">
              Join the MarketElla family <span aria-hidden="true">↓</span>
            </Link>
            <p>
              We want your products, your setup, your social page, and your
              whole vibe.
            </p>
          </div>
        </div>
      </section>

      <section className="apply-locations-section" aria-labelledby="apply-locations-heading">
        <h2 id="apply-locations-heading">our locations</h2>
        <div className="apply-location-grid">
          {applyLocations.map((location) => (
            <article className="apply-location-card" key={location.name}>
              <div className="apply-location-photo">
                <Image
                  src={location.image}
                  alt={`${location.name} MarketElla location.`}
                  fill
                  sizes="(max-width: 900px) min(100vw, 560px), 31vw"
                />
              </div>
              <div className="apply-location-copy">
                <h3>{location.name}</h3>
                <p className="apply-location-tagline">{location.tagline}</p>
                <p>{location.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="application-event-list" id="open-applications" aria-labelledby="open-events-heading">
        <div className="list-heading">
          <p className="eyebrow" id="open-events-heading">Open applications</p>
          <span>{openEvents.length} available</span>
        </div>
        {openEvents.length > 0 ? (
          openEvents.map((event) => (
            <Link className="application-event-card" href={`/apply/${event.slug}`} key={event.slug}>
              <div>
                <p className="event-kicker">{event.dateLabel}</p>
                <h2>{event.title}</h2>
                <p>{event.location} · Choose general or food vendor</p>
              </div>
              <span aria-hidden="true">Apply 2 sell ↗</span>
            </Link>
          ))
        ) : (
          <p className="empty-state">Applications are closed for now. Check back soon.</p>
        )}
      </section>

      <ContactFormSection id="apply-contact" />

      <SiteFooter actionHref="/faq" actionLabel="Vendor FAQ" />
    </main>
  );
}
