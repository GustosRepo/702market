import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getEvents } from "@/lib/events";

export const metadata = {
  title: "Apply 2 Sell | Marketella",
  description: "Choose a Marketella event and apply to be a vendor.",
};

export default async function ApplyPage() {
  const events = await getEvents();
  const openEvents = events.filter(
    (event) => event.status === "upcoming" && event.applicationsEnabled,
  );

  return (
    <main className="page-shell">
      <SiteHeader backHref="/events" backLabel="View events" />

      <section className="apply-intro">
        <p className="eyebrow">apply 2 sell</p>
        <h1>bring your<br /><em>good stuff.</em></h1>
        <p className="listing-copy">
          We want your products, your setup, your social page, and your whole
          vibe. Pick a market below to start your application.
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
              <span aria-hidden="true">Apply 2 sell ↗</span>
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
