import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { events } from "@/data/events";

export const metadata = { title: "Admin Dashboard | 702Market" };

export default function AdminDashboard() {
  const nextEvent = events[0];
  return <AdminShell title="Dashboard">
    <section className="admin-event-banner"><div><p className="eyebrow">Next event</p><h2>{nextEvent.title}</h2><p>{nextEvent.dateLabel} · {nextEvent.location}</p></div><Link className="button button-dark" href="/admin/events">Manage events ↗</Link></section>
    <section className="admin-stat-grid" aria-label="Application overview">
      <div><span>Applications</span><strong>0</strong><small>Awaiting connection</small></div>
      <div><span>Pending</span><strong>0</strong><small>Ready for review</small></div>
      <div><span>Approved</span><strong>0</strong><small>No submissions yet</small></div>
      <div><span>Revenue</span><strong>$0</strong><small>Paid applications</small></div>
    </section>
    <section className="admin-empty-panel"><p className="eyebrow">Your workspace</p><h2>Once vendors apply,<br /><em>they&apos;ll show up here.</em></h2><p>Application review, payment tracking, and event reporting will be connected when the Supabase project is ready.</p><Link className="button button-accent" href="/admin/applications">View applications ↗</Link></section>
  </AdminShell>;
}
