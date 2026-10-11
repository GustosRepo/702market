import ContactFormSection from "@/components/contact-form-section";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = { title: "Contact | MarketElla", description: "Get in touch with the MarketElla team." };

export default function ContactPage() {
  return (
    <main className="page-shell contact-page">
      <SiteHeader />
      <ContactFormSection id="contact-page" />
      <SiteFooter actionHref="/faq" actionLabel="Read the FAQ" />
    </main>
  );
}
