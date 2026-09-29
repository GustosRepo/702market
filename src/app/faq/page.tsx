import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata = { title: "FAQ | Marketella", description: "Frequently asked questions about Marketella." };

const questions = [
  ["Wait... how do I actually vend with you?", "Pick your Marketella event, apply, and show us what you got. We want to see your products, setup, social page, and overall vibe."],
  ["What can I sell?", "Vintage, clothing, handmade goods, jewelry, art, accessories, collectibles, home decor, beauty, food, desserts, drinks, and anything with a point of view."],
  ["Do I need a business license?", "We handle event licenses and insurance, but if you have one, pass it our way. Food vendors still need the correct health department paperwork."],
  ["Can you guarantee I'll make money?", "No honest market can guarantee sales. We bring the event, promotion, location, and energy. Your setup, product, content, and customer service matter too."],
  ["Can I just come shop?", "Girl, yes. Marketella is free entry, all ages, and built for shoppers, friends, families, dates, and anyone who needs a reason to get out of the house."],
];

export default function FaqPage() {
  return (
    <main className="page-shell faq-page">
      <SiteHeader />
      <section className="content-intro faq-intro"><p className="eyebrow">q&a separate for you</p><h1>questions<br /><em>here.</em></h1><p>Everything you need before you visit, apply, or bring your table.</p></section>
      <section className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</section>
      <SiteFooter actionHref="/contact" actionLabel="Still curious?" />
    </main>
  );
}
