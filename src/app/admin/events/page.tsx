import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { AdminConfirmAction } from "@/components/admin-confirm-action";
import { getApplicationCountsByEvent } from "@/lib/applications";
import { getAdminEvents, type EventArchiveView } from "@/lib/admin-events";
import { archiveEvent, restoreEvent, toggleEventApplications, toggleEventPublished } from "./actions";

export const metadata = { title: "Manage Events | MarketElla" };

type AdminEventsPageProps = { searchParams: Promise<{ archive?: string }> };

function cleanArchive(value?: string): EventArchiveView {
  return value === "archived" || value === "all" ? value : "active";
}

function archiveHref(archive: EventArchiveView) {
  return archive === "active" ? "/admin/events" : `/admin/events?archive=${archive}`;
}

export default async function AdminEventsPage({ searchParams }: AdminEventsPageProps) {
  const params = await searchParams;
  const archive = cleanArchive(params.archive);
  const [events, applicationCounts] = await Promise.all([
    getAdminEvents(archive),
    getApplicationCountsByEvent(),
  ]);

  function applicationLabel(event: (typeof events)[number]) {
    if (event.generalApplicationsEnabled && event.foodApplicationsEnabled) return "General + food open";
    if (event.generalApplicationsEnabled) return "General open";
    if (event.foodApplicationsEnabled) return "Food open";
    return "Closed";
  }

  return (
    <AdminShell title="Events">
      <div className="admin-toolbar">
        <p>Manage public markets and application windows.</p>
        <Link className="button button-accent" href="/admin/events/new">+ New event</Link>
      </div>
      <section className="admin-filter-row" aria-label="Event archive filters">
        {(["active", "archived", "all"] as const).map((value) => (
          <Link className={archive === value ? "filter-active" : ""} href={archiveHref(value)} key={value}>{value}</Link>
        ))}
      </section>
      <section className="admin-table-wrap">
        <table>
          <thead><tr><th>Event</th><th>Date</th><th>Applications</th><th>Status</th><th>Controls</th><th /></tr></thead>
          <tbody>
            {events.map((event) => {
              const nextPublished = !event.published;
              const nextGeneralOpen = !event.generalApplicationsEnabled;
              return (
                <tr key={event.slug}>
                  <td><strong>{event.title}</strong><small>{event.location}</small></td>
                  <td>{event.dateLabel}</td>
                  <td><Link href={`/admin/applications?event=${event.slug}&group=status`}>{applicationCounts[event.slug] || 0} applications</Link><small>{applicationLabel(event)}</small></td>
                  <td><span className={`status-pill status-${event.status}`}>{event.status}</span>{event.published ? <span className="status-pill status-active">Published</span> : <span className="status-pill status-cancelled">Draft</span>}</td>
                  <td className="admin-row-actions">
                    <AdminConfirmAction
                      action={toggleEventPublished}
                      confirmLabel={nextPublished ? "Publish event" : "Unpublish event"}
                      fields={{ slug: event.slug, published: String(event.published) }}
                      message={nextPublished ? `Make “${event.title}” visible on the public site?` : `Hide “${event.title}” from the public site? Existing application records will remain available.`}
                      title={nextPublished ? "Publish this event?" : "Unpublish this event?"}
                      tone={nextPublished ? "default" : "danger"}
                      triggerLabel={nextPublished ? "Publish" : "Unpublish"}
                    />
                    <AdminConfirmAction
                      action={toggleEventApplications}
                      confirmLabel={nextGeneralOpen ? "Open applications" : "Close applications"}
                      fields={{ slug: event.slug, generalApplicationsEnabled: String(event.generalApplicationsEnabled), foodApplicationsEnabled: String(event.foodApplicationsEnabled) }}
                      message={nextGeneralOpen ? `Allow new general-vendor applications for “${event.title}”?` : `Stop new general-vendor applications for “${event.title}”? Food applications will not be changed.`}
                      title={nextGeneralOpen ? "Open general applications?" : "Close general applications?"}
                      tone={nextGeneralOpen ? "default" : "danger"}
                      triggerLabel={nextGeneralOpen ? "Open general apps" : "Close general apps"}
                    />
                    {event.archivedAt ? (
                      <form action={restoreEvent}><input name="slug" type="hidden" value={event.slug} /><button className="text-button" type="submit">Restore</button></form>
                    ) : (
                      <AdminConfirmAction action={archiveEvent} confirmLabel="Archive event" fields={{ slug: event.slug }} message={`Archive “${event.title}”? It will leave active admin lists, but its applications and event data will be preserved.`} title="Archive this event?" tone="danger" triggerLabel="Archive" />
                    )}
                  </td>
                  <td className="admin-row-links"><Link className="text-button" href={`/admin/events/${event.slug}/edit`}>Edit</Link><Link className="text-button" href={`/events/${event.slug}`}>View ↗</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}
