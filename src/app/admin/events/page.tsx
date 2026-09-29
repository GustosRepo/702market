import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { getApplicationCountsByEvent } from "@/lib/applications";
import {
  getAdminEvents,
  type EventArchiveView,
} from "@/lib/admin-events";
import {
  archiveEvent,
  restoreEvent,
  toggleEventApplications,
  toggleEventPublished,
} from "./actions";

export const metadata = { title: "Manage Events | Marketella" };

type AdminEventsPageProps = {
  searchParams: Promise<{
    archive?: string;
  }>;
};

function cleanArchive(value?: string): EventArchiveView {
  return value === "archived" || value === "all" ? value : "active";
}

function archiveHref(archive: EventArchiveView) {
  return archive === "active" ? "/admin/events" : `/admin/events?archive=${archive}`;
}

export default async function AdminEventsPage({
  searchParams,
}: AdminEventsPageProps) {
  const params = await searchParams;
  const archive = cleanArchive(params.archive);
  const [events, applicationCounts] = await Promise.all([
    getAdminEvents(archive),
    getApplicationCountsByEvent(),
  ]);

  return <AdminShell title="Events">
    <div className="admin-toolbar"><p>Manage public markets and application windows.</p><Link className="button button-accent" href="/admin/events/new">+ New event</Link></div>
    <section className="admin-filter-row" aria-label="Event archive filters">
      {(["active", "archived", "all"] as const).map((value) => (
        <Link className={archive === value ? "filter-active" : ""} href={archiveHref(value)} key={value}>{value}</Link>
      ))}
    </section>
    <section className="admin-table-wrap"><table><thead><tr><th>Event</th><th>Date</th><th>Applications</th><th>Status</th><th>Controls</th><th /></tr></thead><tbody>{events.map((event) => <tr key={event.slug}><td><strong>{event.title}</strong><small>{event.location}</small></td><td>{event.dateLabel}</td><td><Link href={`/admin/applications?event=${event.slug}&group=status`}>{applicationCounts[event.slug] || 0} applications</Link><small>{event.applicationsEnabled ? "Open" : "Closed"}</small></td><td><span className={`status-pill status-${event.status}`}>{event.status}</span>{event.published ? <span className="status-pill status-active">Published</span> : <span className="status-pill status-cancelled">Draft</span>}</td><td><form action={toggleEventPublished}><input name="slug" type="hidden" value={event.slug} /><input name="published" type="hidden" value={String(event.published)} /><button className="text-button" type="submit">{event.published ? "Unpublish" : "Publish"}</button></form><form action={toggleEventApplications}><input name="slug" type="hidden" value={event.slug} /><input name="applicationsEnabled" type="hidden" value={String(event.applicationsEnabled)} /><button className="text-button" type="submit">{event.applicationsEnabled ? "Close apps" : "Open apps"}</button></form><form action={event.archivedAt ? restoreEvent : archiveEvent}><input name="slug" type="hidden" value={event.slug} /><button className="text-button" type="submit">{event.archivedAt ? "Restore" : "Archive"}</button></form></td><td><Link className="text-button" href={`/admin/events/${event.slug}/edit`}>Edit</Link><Link className="text-button" href={`/events/${event.slug}`}>View ↗</Link></td></tr>)}</tbody></table></section>
  </AdminShell>;
}
