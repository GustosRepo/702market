import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { getEventBySlug, isApplicationTypeOpen } from "@/lib/events";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  return {
    title: event ? `${event.title} | MarketElla` : "Event not found | MarketElla",
    description: event?.description,
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const generalOpen = isApplicationTypeOpen(event, "vendor");
  const foodOpen = isApplicationTypeOpen(event, "food");
  const anyApplicationsOpen = generalOpen || foodOpen;

  return (
    <main className="page-shell event-detail-page">
      <SiteHeader backHref="/events" backLabel="All events" />

      <section
        className="event-detail-hero"
        style={{ "--asset-image": `url(${event.heroImage})` } as React.CSSProperties}
      >
        <p className="eyebrow">MarketElla event</p>
        <h1>{event.title}</h1>
        <p className="event-detail-description">{event.description}</p>
      </section>

      <section className="event-info-grid" aria-label="Event information">
        <div>
          <p className="eyebrow">When</p>
          <h2>{event.dateLabel}</h2>
          <p>{event.time}</p>
        </div>
        <div>
          <p className="eyebrow">Where</p>
          <h2>{event.location}</h2>
          <p>{event.address}</p>
        </div>
        <div>
          <p className="eyebrow">Vendor applications</p>
          <h2>{anyApplicationsOpen ? "Open now" : "Closed"}</h2>
          <p>Deadline: {event.applicationDeadline}</p>
        </div>
      </section>

      <section className="event-detail-actions">
        <div>
          <p className="eyebrow">Apply 2 sell</p>
          <h2>bring the setup.<br /><em>bring the product.</em></h2>
        </div>
        {anyApplicationsOpen ? (
          <div className="event-application-buttons">
            {generalOpen ? (
              <Link className="button button-accent" href={`/events/${event.slug}/apply/vendor`}>
                Apply as vendor <span aria-hidden="true">↗</span>
              </Link>
            ) : null}
            {foodOpen ? (
              <Link className="button button-dark" href={`/events/${event.slug}/apply/food`}>
                Apply as food vendor <span aria-hidden="true">↗</span>
              </Link>
            ) : null}
          </div>
        ) : (
          <p className="empty-state">Applications are currently closed.</p>
        )}
      </section>

      <SiteFooter actionHref="/events" actionLabel="See all markets" />
    </main>
  );
}
