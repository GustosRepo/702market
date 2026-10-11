import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { getEventBySlug, isApplicationTypeOpen } from "@/lib/events";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type ApplicationPageProps = {
  params: Promise<{ eventSlug: string }>;
};

export function generateStaticParams() {
  return events.map((event) => ({ eventSlug: event.slug }));
}

export async function generateMetadata({ params }: ApplicationPageProps) {
  const { eventSlug } = await params;
  const event = await getEventBySlug(eventSlug);

  return {
    title: event ? `Apply for ${event.title} | MarketElla` : "Apply | MarketElla",
    description: event?.description,
  };
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { eventSlug } = await params;
  const event = await getEventBySlug(eventSlug);

  if (!event) {
    notFound();
  }

  const generalOpen = isApplicationTypeOpen(event, "vendor");
  const foodOpen = isApplicationTypeOpen(event, "food");

  if (!generalOpen && !foodOpen) {
    return (
      <main className="page-shell application-page">
        <SiteHeader backHref="/events" backLabel="All events" />
        <section className="application-closed">
          <p className="eyebrow">Applications closed</p>
          <h1>This one is<br /><em>full up.</em></h1>
          <Link className="button button-dark" href="/events">See other events ↗</Link>
        </section>
        <SiteFooter actionHref="/faq" actionLabel="Vendor FAQ" />
      </main>
    );
  }

  return (
    <main className="page-shell application-page">
      <SiteHeader backHref={`/events/${event.slug}`} backLabel="Event details" />

      <section className="application-header">
        <p className="eyebrow">Choose your application</p>
        <h1>{event.title}<br /><em>starts here.</em></h1>
        <p className="application-header-meta">
          {event.dateLabel} · {event.location}
        </p>
      </section>
      <section className="application-type-chooser">
        {generalOpen ? (
          <Link className="application-type-choice" href={`/events/${event.slug}/apply/vendor`}>
            <p className="eyebrow">General vendor</p>
            <h2>Products, vintage,<br />art, and more.</h2>
            <span>Start vendor application ↗</span>
          </Link>
        ) : null}
        {foodOpen ? (
          <Link className="application-type-choice" href={`/events/${event.slug}/apply/food`}>
            <p className="eyebrow">Food vendor</p>
            <h2>Trucks, tents,<br />stands, and drinks.</h2>
            <span>Start food application ↗</span>
          </Link>
        ) : null}
      </section>
      <SiteFooter actionHref="/faq" actionLabel="Vendor FAQ" />
    </main>
  );
}
