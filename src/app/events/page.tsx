import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getEvents } from "@/lib/events";
import { eventHeroAsset } from "@/lib/site-assets";

export const metadata = {
  title: "Events | Marketella",
  description: "Find the next Marketella market in Las Vegas.",
};

export default async function EventsPage() {
  const events = await getEvents();
  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const pastEvents = events.filter((event) => event.status === "completed");

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="listing-intro">
        <p className="eyebrow">calendar</p>
        <h1>pull up to<br /><em>marketella.</em></h1>
        <p className="listing-copy">
          Markets with a different personality every time. Shop small, eat
          something good, take pictures, and make a day out of it.
        </p>
      </section>

      <section className="event-list" aria-labelledby="upcoming-heading">
        <div className="list-heading">
          <p className="eyebrow" id="upcoming-heading">Upcoming markets</p>
          <span>{upcomingEvents.length} event{upcomingEvents.length === 1 ? "" : "s"}</span>
        </div>
        {upcomingEvents.map((event) => (
          <Link className="event-card" href={`/events/${event.slug}`} key={event.slug}>
            <span
              className="event-card-media"
              style={{ "--asset-image": `url(${eventHeroAsset(event.slug)})` } as React.CSSProperties}
              aria-hidden="true"
            />
            <div className="event-card-date">
              <strong>{event.dateLabel.split(" ")[1].replace(",", "")}</strong>
              <span>{event.dateLabel.split(" ")[0]}<br />{event.dateLabel.split(" ")[2]}</span>
            </div>
            <div className="event-card-details">
              <p className="event-kicker">Marketella event</p>
              <h2>{event.title}</h2>
              <p>{event.time} · {event.location}</p>
            </div>
            <span className="event-card-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </section>

      <section className="past-events" aria-labelledby="past-heading">
        <div className="list-heading">
          <p className="eyebrow" id="past-heading">Past markets</p>
          <span>Archive</span>
        </div>
        {pastEvents.length > 0 ? (
          pastEvents.map((event) => <p key={event.slug}>{event.title}</p>)
        ) : (
          <p className="empty-state">More Marketella memories are coming soon.</p>
        )}
      </section>

      <SiteFooter actionHref="/apply/october-night-market" />
    </main>
  );
}
