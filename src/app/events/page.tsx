import Link from "next/link";
import ContactFormSection from "@/components/contact-form-section";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getGoogleCalendarUrl, getMapUrl } from "@/lib/event-calendar";
import { getEvents, isUpcomingEvent } from "@/lib/events";

export const metadata = {
  title: "Calendar | MarketElla",
  description: "Find the next MarketElla market in Las Vegas.",
};

export default async function EventsPage() {
  const events = await getEvents();
  const upcomingEvents = events.filter(isUpcomingEvent);

  return (
    <main className="calendar-page">
      <SiteHeader ariaLabel="Calendar navigation" />
      <section className="calendar-events" aria-labelledby="calendar-heading">
        <div className="calendar-page-heading">
          <p className="eyebrow">market calendar</p>
          <h1 id="calendar-heading">where to find us.</h1>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="calendar-event-list">
            {upcomingEvents.map((event) => (
              <article className="calendar-event" key={event.slug}>
                <div
                  className="calendar-event-photo"
                  style={{ "--asset-image": `url(${event.heroImage})` } as React.CSSProperties}
                  aria-hidden="true"
                />
                <div className="calendar-event-copy">
                  <p className="calendar-event-date">{event.dateLabel}</p>
                  <h2>{event.title}</h2>
                  <p className="calendar-event-time">{event.time}</p>
                  <div className="calendar-event-links" aria-label={`Calendar options for ${event.title}`}>
                    <a href={getMapUrl(event)} target="_blank" rel="noreferrer">Map</a>
                    <a href={getGoogleCalendarUrl(event)} target="_blank" rel="noreferrer">Google Calendar</a>
                    <a href={`/events/${event.slug}/calendar.ics`}>ICS</a>
                  </div>
                  <p className="calendar-event-description">{event.description}</p>
                  <div className="calendar-event-actions">
                    <Link className="button button-dark" href={`/events/${event.slug}`}>
                      View event <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="calendar-empty-state">
            <p>Fresh dates are coming soon. Keep an eye on our socials for the next MarketElla.</p>
          </div>
        )}
      </section>
      <ContactFormSection id="calendar-contact" />
      <SiteFooter actionHref="/apply" actionLabel="Apply to sell" />
    </main>
  );
}
