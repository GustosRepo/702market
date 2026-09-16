import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Terms | 702Market",
  description: "Terms for using the 702Market website and vendor application process.",
};

export default function TermsPage() {
  return (
    <main className="page-shell legal-page">
      <SiteHeader />
      <section className="legal-intro"><p className="eyebrow">The fine print</p><h1>Good to<br /><em>know.</em></h1><p>Last updated September 16, 2026</p></section>
      <article className="legal-copy">
        <p>These starter terms describe the basic expectations for using the 702Market website. They should be reviewed and finalized before the site accepts live applications or payments.</p>
        <h2>Using the site</h2>
        <p>Please provide accurate information, use the application process honestly, and do not interfere with the site or submit content that you do not have permission to share.</p>
        <h2>Vendor applications</h2>
        <p>Submitting an application does not guarantee acceptance. 702Market may review, approve, waitlist, or decline applications based on event needs, category balance, capacity, and vendor requirements.</p>
        <h2>Merchandise and links</h2>
        <p>Merchandise buttons may send you to an external store or checkout. External purchases are subject to that provider&apos;s terms, pricing, availability, and privacy policy.</p>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent to <a href="mailto:hello@702market.com">hello@702market.com</a>.</p>
        <Link className="text-link" href="/privacy">Read the Privacy Policy ↗</Link>
      </article>
      <SiteFooter actionHref="/contact" actionLabel="Contact us" />
    </main>
  );
}
