import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import type { ApplicationType } from "@/data/events";
import { getEventBySlug, isApplicationTypeOpen } from "@/lib/events";
import ApplicationFlow from "./ApplicationFlow";
import { submitVendorApplication } from "./actions";

type VendorApplicationPageProps = {
  params: Promise<{ slug: string; applicationType: string }>;
};

export default async function VendorApplicationPage({ params }: VendorApplicationPageProps) {
  const { slug, applicationType: typeParam } = await params;
  if (typeParam !== "vendor" && typeParam !== "food") notFound();

  const applicationType: ApplicationType = typeParam;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const open = isApplicationTypeOpen(event, applicationType);
  const options = event.vendorOptions.filter((option) => option.active && option.applicationType === applicationType);

  return (
    <main className="page-shell application-page">
      <SiteHeader backHref={`/events/${event.slug}`} backLabel="Event details" />
      <section className="application-header">
        <p className="eyebrow">{applicationType === "food" ? "Food vendor application" : "General vendor application"}</p>
        <h1>{event.title}<br /><em>starts here.</em></h1>
        <p className="application-header-meta">{event.dateLabel} · {event.location}</p>
      </section>
      {open ? (
        <ApplicationFlow
          applicationType={applicationType}
          eventDate={event.dateLabel}
          eventLocation={event.location}
          eventTitle={event.title}
          options={options}
          applicationNote={applicationType === "food" ? event.foodApplicationNotes : event.applicationNotes}
          rules={applicationType === "food" ? event.foodApplicationRules : event.applicationRules}
          submissionToken={randomUUID()}
          submitAction={submitVendorApplication.bind(null, event.slug, applicationType)}
        />
      ) : (
        <section className="application-closed">
          <p className="eyebrow">Applications closed</p>
          <h1>This application<br /><em>isn&apos;t open.</em></h1>
        </section>
      )}
      <SiteFooter actionHref="/faq" actionLabel="Vendor FAQ" />
    </main>
  );
}
