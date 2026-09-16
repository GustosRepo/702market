import Link from "next/link";
import { events } from "@/data/events";

export const metadata = {
  title: "Events | 702Market",
  description: "Find the next 702Market night market in Las Vegas.",
};

export default function EventsPage() {
  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const pastEvents = events.filter((event) => event.status === "completed");

  return (
    <main className="page-shell">
      <header className="page-header">
        <Link className="wordmark" href="/" aria-label="702Market home">
          702<span>Market</span>
        </Link>
        <Link className="text-link" href="/">
          Back home <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="listing-intro">
        <p className="eyebrow">Save the dates</p>
        <h1>Come find<br /><em>something.</em></h1>
        <p className="listing-copy">
          Night markets, good people, and the kind of finds you tell your
          friends about.
        </p>
      </section>

      <section className="event-list" aria-labelledby="upcoming-heading">
        <div className="list-heading">
          <p className="eyebrow" id="upcoming-heading">Upcoming markets</p>
          <span>{upcomingEvents.length} event{upcomingEvents.length === 1 ? "" : "s"}</span>
        </div>
        {upcomingEvents.map((event) => (
          <Link className="event-card" href={`/events/${event.slug}`} key={event.slug}>
            <div className="event-card-date">
              <strong>{event.dateLabel.split(" ")[1].replace(",", "")}</strong>
              <span>{event.dateLabel.split(" ")[0]}<br />{event.dateLabel.split(" ")[2]}</span>
            </div>
            <div className="event-card-details">
              <p className="event-kicker">702Market event</p>
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
          <p className="empty-state">Our first market is still ahead. See you there.</p>
        )}
      </section>

      <footer className="site-footer">
        <Link className="wordmark" href="/">702<span>Market</span></Link>
        <Link href="/apply/october-night-market">Apply to sell ↗</Link>
      </footer>
    </main>
  );
}
