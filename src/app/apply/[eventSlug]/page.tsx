import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/data/events";
import { getEventBySlug } from "@/lib/events";
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
    title: event ? `Apply for ${event.title} | 702Market` : "Apply | 702Market",
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
        <header className="page-header">
          <Link className="wordmark" href="/" aria-label="702Market home">
            702<span>Market</span>
          </Link>
          <Link className="text-link" href="/events">All events ↗</Link>
        </header>
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
      <header className="page-header">
        <Link className="wordmark" href="/" aria-label="702Market home">
          702<span>Market</span>
        </Link>
        <Link className="text-link" href={`/events/${event.slug}`}>
          Event details <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="application-header">
        <p className="eyebrow">Vendor application</p>
        <h1>{event.title}<br /><em>starts here.</em></h1>
        <p>{event.dateLabel} · {event.location} · {event.applicationFee} application fee</p>
      </section>

      <ApplicationForm
        eventSlug={event.slug}
        eventTitle={event.title}
        submitAction={submitApplication.bind(null, event.slug)}
      />
    </main>
  );
}
