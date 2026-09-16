import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = { title: "FAQ | 702Market", description: "Frequently asked questions about 702Market." };

const questions = [
  ["What kind of vendors do you welcome?", "Vintage, clothing, jewelry, art, food, collectibles, handmade goods, beauty, accessories, and anything with a point of view."],
  ["Do I need a business license?", "Please bring whatever permits your category and setup require. Food vendors should be prepared to provide applicable health documentation."],
  ["How much is a vendor application?", "The current application fee is listed on each event page. For the October Night Market, it is $50."],
  ["Do vendors need a tent or table?", "Yes. Vendors are responsible for their own table, display, and weather-ready setup unless an event listing says otherwise."],
  ["When will I hear back?", "Our team reviews applications after the deadline and emails every applicant with their status."],
];

export default function FaqPage() {
  return (
    <main className="page-shell faq-page">
      <SiteHeader />
      <section className="content-intro faq-intro"><p className="eyebrow">You asked, we answered</p><h1>Questions,<br /><em>answered.</em></h1><p>Everything you need before you visit or bring your table.</p></section>
      <section className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</section>
      <SiteFooter actionHref="/contact" actionLabel="Still curious?" />
    </main>
  );
}
