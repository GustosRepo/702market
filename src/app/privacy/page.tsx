import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Privacy Policy | MarketElla",
  description: "How MarketElla handles website and vendor application information.",
};

export default function PrivacyPage() {
  return (
    <main className="page-shell legal-page">
      <SiteHeader />
      <section className="legal-intro"><p className="eyebrow">The fine print</p><h1>Privacy<br /><em>policy.</em></h1><p>Last updated October 11, 2026</p></section>
      <article className="legal-copy">
        <p>MarketElla LV LLC respects your privacy. This policy explains what information we collect through this website, why we use it, and the choices available to you.</p>
        <h2>Information we collect</h2>
        <p>When you contact us or submit a vendor application, we collect the information you provide. This may include your name, email, phone number, business information, social handles, product or menu details, setup information, licenses, permits, logos, and uploaded photos or documents. Newsletter consent is recorded separately when selected.</p>
        <h2>How we use information</h2>
        <p>We use information to review and manage vendor applications, communicate about events, respond to messages, maintain records, prevent duplicate or fraudulent submissions, and operate and improve the website. We do not sell applicant or contact information.</p>
        <h2>Sharing and storage</h2>
        <p>Information may be processed by trusted providers that support website hosting, Supabase database and private file storage, email delivery, and business operations. Access to vendor records and private uploads is limited to authorized MarketElla administrators and service providers that need it to perform their work.</p>
        <h2>Retention and security</h2>
        <p>We retain records for as long as reasonably needed to review applications, operate events, resolve disputes, meet legal obligations, and maintain business records. We use access controls and private storage for sensitive application documents, but no online system can guarantee absolute security.</p>
        <h2>Your choices</h2>
        <p>You may ask us to correct or delete contact information we control, subject to legal and operational recordkeeping requirements. You may also ask to be removed from marketing updates at any time.</p>
        <h2>Children and updates</h2>
        <p>This website is not intended to collect applications from children under 13. We may update this policy when our services or practices change and will post the revised date on this page.</p>
        <h2>Questions</h2>
        <p>For privacy questions or requests, contact <a href="mailto:hello@702market.com">hello@702market.com</a>.</p>
        <Link className="text-link" href="/terms">Read the Terms ↗</Link>
      </article>
      <SiteFooter actionHref="/contact" actionLabel="Contact us" />
    </main>
  );
}
