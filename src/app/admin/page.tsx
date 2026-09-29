import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { getEvents } from "@/lib/events";
import { getApplicationStats } from "@/lib/applications";

export const metadata = { title: "Admin Dashboard | Marketella" };

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminDashboard() {
  const [events, stats] = await Promise.all([
    getEvents(),
    getApplicationStats(),
  ]);
  const nextEvent = events[0];

  return <AdminShell title="Dashboard">
    <section className="admin-event-banner"><div><p className="eyebrow">Next event</p><h2>{nextEvent?.title || "No published events"}</h2><p>{nextEvent ? `${nextEvent.dateLabel} · ${nextEvent.location}` : "Add an event in Supabase to start."}</p></div><Link className="button button-dark" href="/admin/events">Manage events ↗</Link></section>
    <section className="admin-stat-grid" aria-label="Application overview">
      <div><span>Applications</span><strong>{stats.total}</strong><small>{stats.waitlisted} waitlisted</small></div>
      <div><span>Pending</span><strong>{stats.pending}</strong><small>Ready for review</small></div>
      <div><span>Approved</span><strong>{stats.approved}</strong><small>{stats.paid} paid</small></div>
      <div><span>Revenue</span><strong>{formatMoney(stats.revenue)}</strong><small>Paid applications</small></div>
    </section>
    <section className="admin-empty-panel"><p className="eyebrow">Your workspace</p><h2>{stats.total > 0 ? "Vendor review is" : "Once vendors apply,"}<br /><em>{stats.total > 0 ? "ready to go." : "they'll show up here."}</em></h2><p>{stats.total > 0 ? "Seed applications are loaded so you can review statuses, payments, and event demand." : "Run the fake seed SQL or submit the public form to populate the admin workspace."}</p><Link className="button button-accent" href="/admin/applications">View applications ↗</Link></section>
  </AdminShell>;
}
