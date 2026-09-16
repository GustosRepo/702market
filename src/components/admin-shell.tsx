import Link from "next/link";

export default function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">702<span>Market</span><small>Admin</small></Link>
        <nav aria-label="Admin navigation">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/events">Events</Link>
          <Link href="/admin/applications">Applications</Link>
          <Link href="/admin/merch">Merch</Link>
          <Link href="/">View site ↗</Link>
        </nav>
        <p className="admin-preview-note">Preview mode<br />Supabase connection pending</p>
      </aside>
      <section className="admin-content">
        <header className="admin-topbar"><p className="eyebrow">702Market admin</p><span className="admin-user">Staff preview</span></header>
        <div className="admin-page-heading"><p className="eyebrow">Workspace</p><h1>{title}</h1></div>
        {children}
      </section>
    </main>
  );
}
