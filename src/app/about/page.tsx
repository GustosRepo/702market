import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = { title: "About | 702Market", description: "Meet 702Market, a creative night market in Las Vegas." };

export default function AboutPage() {
  return (
    <main className="page-shell about-page">
      <SiteHeader />
      <section className="content-intro about-intro"><p className="eyebrow">A market with a pulse</p><h1>Made for the<br /><em>different.</em></h1><p>702Market is a Las Vegas night market for vintage hunters, local makers, collectors, and curious people.</p></section>
      <section className="story-section"><div className="about-stamp">LV<br /><span>702</span></div><div><p className="eyebrow">Our thing</p><h2>Good finds.<br />Good people.<br /><em>Good times.</em></h2><p>We believe the best markets feel a little like a party and a little like a treasure hunt. Come for the vintage, stay for the conversations, and leave with something that feels like it found you.</p><Link className="button button-accent" href="/events">Find the next market ↗</Link></div></section>
      <SiteFooter actionHref="/apply" actionLabel="Sell with us" />
    </main>
  );
}
