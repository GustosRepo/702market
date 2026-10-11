import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Terms | MarketElla",
  description: "Terms for using the MarketElla website and vendor application process.",
};

export default function TermsPage() {
  return (
    <main className="page-shell legal-page">
      <SiteHeader />
      <section className="legal-intro"><p className="eyebrow">The fine print</p><h1>Good to<br /><em>know.</em></h1><p>Last updated October 11, 2026</p></section>
      <article className="legal-copy">
        <p>These terms govern your use of the MarketElla website and vendor application process. By using the site or submitting an application, you agree to these terms and any event-specific rules shown before submission.</p>
        <h2>Using the site</h2>
        <p>Provide accurate, current information and submit only content and documents you have permission to use. Do not misuse the site, attempt unauthorized access, interfere with its operation, or submit unlawful or harmful material.</p>
        <h2>Vendor applications</h2>
        <p>Submitting an application does not guarantee acceptance, placement, exclusivity, attendance, or sales. MarketElla may approve, waitlist, reject, or revoke an application based on event needs, category balance, capacity, safety, venue requirements, accuracy of submitted information, and compliance with event rules.</p>
        <h2>Fees and event changes</h2>
        <p>Fees, refunds, transfers, arrival requirements, and cancellation terms are governed by the rules presented for the selected event. MarketElla may adjust event times, locations, layouts, or operational requirements when reasonably necessary for safety, weather, venue needs, or circumstances outside normal control.</p>
        <h2>Uploads and media</h2>
        <p>You retain ownership of materials you submit. You grant MarketElla permission to review and store those materials for application and event operations. Event participation may also include photography or recording as described in the event rules you acknowledge.</p>
        <h2>Merchandise and links</h2>
        <p>Merchandise buttons may send you to an external store or checkout. External purchases are subject to that provider&apos;s terms, pricing, availability, and privacy policy.</p>
        <h2>Website content</h2>
        <p>MarketElla names, branding, page content, graphics, and original media may not be copied, reproduced, or distributed without written permission, except where applicable law permits.</p>
        <h2>Availability and responsibility</h2>
        <p>We work to keep the website accurate and available but do not guarantee uninterrupted access or error-free content. To the fullest extent permitted by law, MarketElla is not responsible for indirect or consequential losses arising from use of the site, third-party services, or event participation.</p>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent to <a href="mailto:hello@702market.com">hello@702market.com</a>.</p>
        <Link className="text-link" href="/privacy">Read the Privacy Policy ↗</Link>
      </article>
      <SiteFooter actionHref="/contact" actionLabel="Contact us" />
    </main>
  );
}
