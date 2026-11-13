import Image from "next/image";
import Link from "next/link";
import ContactFormSection from "@/components/contact-form-section";
import MarqueeBand from "@/components/marquee-band";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getEvents, isApplicationTypeOpen } from "@/lib/events";
import { findMarketLocation, marketLocations } from "@/lib/market-locations";

export const metadata = {
  title: "Apply 2 Sell | MarketElla",
  description: "Choose a MarketElla event and apply to be a vendor.",
};

const applyLocations = [
  {
    id: "fergusons-downtown",
    name: "fergusons downtown",
    tagline: "we take over the street.",
    description:
      "Our biggest themed markets with 70+ small businesses and full-on experiences.",
    image: "/assets/site/fergusons-downtown-web.webp",
  },
  {
    id: "cowabunga-canyon",
    name: "cowabunga canyon",
    tagline: "where the whole family comes to play",
    description:
      "Family friendly themed markets filled with shopping, food, activities, and fun for all ages.",
    image: "/assets/site/cowabunga-canyon-web.webp",
  },
  {
    id: "container-park",
    name: "container park",
    tagline: "cultura meets community",
    description:
      "Culturally inspired markets celebrating our Latino community.",
    image: "/assets/site/container-park-web.webp",
  },
];

export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ location?: string | string[] }> }) {
  const locationParam = (await searchParams).location;
  const selectedLocation = typeof locationParam === "string"
    ? marketLocations.find((location) => location.id === locationParam)
    : undefined;
  const events = await getEvents();
  const openEvents = events.filter(
    (event) =>
      isApplicationTypeOpen(event, "vendor") ||
      isApplicationTypeOpen(event, "food"),
  );
  const filteredEvents = selectedLocation
    ? openEvents.filter((event) => findMarketLocation(event.location)?.id === selectedLocation.id)
    : openEvents;

  return (
    <main className="page-shell apply-page">
      <section
        className="apply-hero"
        style={{ "--hero-image": "url(/assets/site/apply-hero-web.webp)" } as React.CSSProperties}
      >
        <SiteHeader ariaLabel="Apply page navigation" className="apply-hero-nav" variant="hero" />

        <MarqueeBand
          className="apply-hero-marquee"
          label="Join the family"
          phrases={["Join the family"]}
        />

        <div className="apply-hero-content">
          <h1>want 2 grow<br />ur business?</h1>
          <div className="apply-hero-quote">
            <Link className="button button-light" href="/apply#open-applications">
              Join the MarketElla family <span aria-hidden="true">→</span>
            </Link>
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
              <Link className="button apply-location-cta" href={`/apply?location=${location.id}#open-applications`}>
                Apply 2 sell <span aria-hidden="true">→</span>
              </Link>
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
          <h2 id="open-events-heading">Open applications</h2>
          <span>{filteredEvents.length} available</span>
        </div>
        <nav className="application-location-filters" aria-label="Filter applications by location">
          <Link href="/apply#open-applications" aria-current={!selectedLocation ? "true" : undefined}>All locations</Link>
          {marketLocations.map((location) => (
            <Link key={location.id} href={`/apply?location=${location.id}#open-applications`} aria-current={selectedLocation?.id === location.id ? "true" : undefined}>
              {location.name}
            </Link>
          ))}
        </nav>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link className="application-event-card" href={`/apply/${event.slug}`} key={event.slug}>
              <div>
                <p className="event-kicker">{event.dateLabel}</p>
                <h3>{event.title}</h3>
                <p>{event.location} · {isApplicationTypeOpen(event, "vendor") && isApplicationTypeOpen(event, "food") ? "Choose general or food vendor" : isApplicationTypeOpen(event, "food") ? "Food vendor applications" : "General vendor applications"}</p>
              </div>
              <span aria-hidden="true">Apply 2 sell ↗</span>
            </Link>
          ))
        ) : (
          <p className="empty-state">{selectedLocation ? `No applications currently open at ${selectedLocation.name}.` : "Applications are closed for now. Check back soon."}</p>
        )}
      </section>

      <ContactFormSection id="apply-contact" />

      <SiteFooter actionHref="/faq" actionLabel="Vendor FAQ" />
    </main>
  );
}
