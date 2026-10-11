import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function NotFound() {
  return (
    <main className="page-shell fallback-page">
      <SiteHeader />
      <section className="fallback-panel">
        <p className="eyebrow">404 · not at this market</p>
        <h1>this page<br /><em>packed up.</em></h1>
        <p>The link may be old, or this market moment moved somewhere else.</p>
        <div className="fallback-actions"><Link className="button button-dark" href="/">Go home</Link><Link className="button button-accent" href="/events">See the calendar</Link></div>
      </section>
      <SiteFooter />
    </main>
  );
}
