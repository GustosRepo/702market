import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { events } from "@/data/events";

export const metadata = { title: "Manage Events | 702Market" };

export default function AdminEventsPage() {
  return <AdminShell title="Events">
    <div className="admin-toolbar"><p>Manage public markets and application windows.</p><button className="button button-accent" type="button">+ New event</button></div>
    <section className="admin-table-wrap"><table><thead><tr><th>Event</th><th>Date</th><th>Applications</th><th>Status</th><th /></tr></thead><tbody>{events.map((event) => <tr key={event.slug}><td><strong>{event.title}</strong><small>{event.location}</small></td><td>{event.dateLabel}</td><td>{event.applicationsEnabled ? "Open" : "Closed"}</td><td><span className="status-pill status-upcoming">{event.status}</span></td><td><Link href={`/events/${event.slug}`}>View ↗</Link></td></tr>)}</tbody></table></section>
  </AdminShell>;
}
