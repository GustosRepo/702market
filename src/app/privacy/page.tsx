import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Privacy Policy | 702Market",
  description: "How 702Market handles website and vendor application information.",
};

export default function PrivacyPage() {
  return (
    <main className="page-shell legal-page">
      <SiteHeader />
      <section className="legal-intro"><p className="eyebrow">The fine print</p><h1>Privacy<br /><em>policy.</em></h1><p>Last updated September 16, 2026</p></section>
      <article className="legal-copy">
        <p>This starter policy explains how 702Market may handle information submitted through this website. It should be reviewed and finalized with the business&apos;s legal and privacy requirements before launch.</p>
        <h2>Information we collect</h2>
        <p>We may collect contact, business, event, and product information when a vendor submits an application or contacts 702Market. We may also receive basic technical information needed to keep the website secure and working.</p>
        <h2>How we use information</h2>
        <p>We use submitted information to review vendor applications, communicate about events, respond to inquiries, manage merchandise links, and operate the 702Market website.</p>
        <h2>Sharing and storage</h2>
        <p>Information may be processed by service providers that support hosting, database storage, file storage, email delivery, and website operations. We do not sell vendor application information.</p>
        <h2>Questions</h2>
        <p>For privacy questions or requests, contact <a href="mailto:hello@702market.com">hello@702market.com</a>.</p>
        <Link className="text-link" href="/terms">Read the Terms ↗</Link>
      </article>
      <SiteFooter actionHref="/contact" actionLabel="Contact us" />
    </main>
  );
}
