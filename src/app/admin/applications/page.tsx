import Link from "next/link";
import AdminShell from "@/components/admin-shell";

export const metadata = { title: "Applications | 702Market" };

export default function AdminApplicationsPage() {
  return <AdminShell title="Applications">
    <div className="admin-toolbar"><p>Review vendors, payment status, and application details.</p><button className="button button-dark" type="button">Export CSV ↓</button></div>
    <section className="admin-filter-row"><button className="filter-active" type="button">All <span>0</span></button><button type="button">Pending <span>0</span></button><button type="button">Approved <span>0</span></button><button type="button">Waitlisted <span>0</span></button></section>
    <section className="admin-empty-panel compact"><p className="eyebrow">No applications yet</p><h2>The table is<br /><em>waiting for vendors.</em></h2><p>Applications submitted through the public form will appear here once Supabase is connected.</p><Link className="button button-accent" href="/apply">Preview application form ↗</Link></section>
  </AdminShell>;
}
