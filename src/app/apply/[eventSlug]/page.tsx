import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { getEventBySlug } from "@/lib/events";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ApplicationForm from "./ApplicationForm";
import { submitApplication } from "./actions";

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
    title: event ? `Apply for ${event.title} | Marketella` : "Apply | Marketella",
    description: event?.description,
  };
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { eventSlug } = await params;
  const event = await getEventBySlug(eventSlug);

  if (!event) {
    notFound();
  }

  if (!event.applicationsEnabled) {
    return (
      <main className="page-shell">
        <SiteHeader backHref="/events" backLabel="All events" />
        <section className="application-closed">
          <p className="eyebrow">Applications closed</p>
          <h1>This one is<br /><em>full up.</em></h1>
          <Link className="button button-dark" href="/events">See other events ↗</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell application-page">
      <SiteHeader backHref={`/events/${event.slug}`} backLabel="Event details" />

      <section className="application-header">
        <p className="eyebrow">Apply 2 sell</p>
        <h1>{event.title}<br /><em>starts here.</em></h1>
        <p>{event.dateLabel} · {event.location} · {event.applicationFee} application fee</p>
      </section>

      <ApplicationForm
        eventSlug={event.slug}
        eventTitle={event.title}
        submitAction={submitApplication.bind(null, event.slug)}
      />
      <SiteFooter actionHref="/faq" actionLabel="Vendor FAQ" />
    </main>
  );
}
