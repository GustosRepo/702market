import Link from "next/link";
import { events } from "@/data/events";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Apply to Sell | 702Market",
  description: "Choose a 702Market event and apply to be a vendor.",
};

export default function ApplyPage() {
  const openEvents = events.filter(
    (event) => event.status === "upcoming" && event.applicationsEnabled,
  );

  return (
    <main className="page-shell">
      <SiteHeader backHref="/events" backLabel="View events" />

      <section className="apply-intro">
        <p className="eyebrow">Your table starts here</p>
        <h1>Bring your<br /><em>good stuff.</em></h1>
        <p className="listing-copy">
          Vintage, handmade, art, food, and the wonderfully unexpected. Pick a
          market below to start your application.
        </p>
      </section>

      <section className="application-event-list" aria-labelledby="open-events-heading">
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
                <p>{event.location} · Application fee {event.applicationFee}</p>
              </div>
              <span aria-hidden="true">Start application ↗</span>
            </Link>
          ))
        ) : (
          <p className="empty-state">Applications are closed for now. Check back soon.</p>
        )}
      </section>

      <SiteFooter actionHref="/faq" actionLabel="Vendor FAQ" />
    </main>
  );
}
