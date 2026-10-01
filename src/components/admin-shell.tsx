import Link from "next/link";
import { signOutAdmin } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const admin = await requireAdmin();

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">Market<span>ella</span><small>Admin</small></Link>
        <nav aria-label="Admin navigation">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/homepage">Homepage</Link>
          <Link href="/admin/events">Events</Link>
          <Link href="/admin/applications">Applications</Link>
          <Link href="/admin/merch">Merch</Link>
          <Link href="/admin/media">Media</Link>
          <Link href="/">View site ↗</Link>
        </nav>
        <p className="admin-preview-note">Signed in<br />{admin.email}</p>
      </aside>
      <section className="admin-content">
        <header className="admin-topbar">
          <p className="eyebrow">Marketella admin</p>
          <div className="admin-user-menu">
            <span className="admin-user">{admin.email}</span>
            <form action={signOutAdmin}>
              <button className="text-button" type="submit">Sign out</button>
            </form>
          </div>
        </header>
        <div className="admin-page-heading"><p className="eyebrow">Workspace</p><h1>{title}</h1></div>
        {children}
      </section>
    </main>
  );
}
