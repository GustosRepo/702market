import MarqueeBand from "@/components/marquee-band";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata = {
  title: "FAQ | MarketElla",
  description: "Frequently asked questions about vending and shopping at MarketElla.",
};

const questions = [
  {
    question: "Wait... how do I actually vend with you?",
    answer: [
      "Okay, this part is easy, promise. Pick your MarketElla event. Apply. Show us what you got.",
      "Yes, we will stalk your business page a little. We wanna see your products, your setup, your vibe... the whole thing. If you are accepted, you will get all the info to lock in your spot.",
      "Applying does not automatically mean you are accepted, though. We try really hard not to have 17 people selling the exact same thing standing next to each other. Awkward.",
    ],
  },
  {
    question: "Do I need a business license to sell with you?",
    answer: [
      "Yes. Every applicant must provide the business license requested in the application. Food vendors must also provide current health department numbers and permits for their setup.",
      "We carry event-level coverage, but that does not replace the permits, licenses, or insurance your own business may be legally required to maintain.",
    ],
  },
  {
    question: "What can I sell?",
    answer: [
      "Cute shit. Okay, legally we probably need to elaborate.",
      "Clothing, vintage, handmade goods, jewelry, art, accessories, collectibles, home decor, beauty, food, desserts, drinks, and all the random little things you absolutely did not need but somehow leave the market carrying.",
      "We do limit categories because nobody wants to walk down an aisle and see the same thing eight times. So if you sell something we have not seen before? Please. Come here. We wanna see.",
    ],
  },
  {
    question: "Do you accept brand new businesses?",
    answer: [
      "Yes. You do not need 10K followers, a perfect booth, or three years in business. Show us what you are building. You do need a business social page and the required license documents before submitting.",
    ],
  },
  {
    question: "What's it actually like vending with you?",
    answer: [
      "A little chaotic. In a cute way.",
      "You will probably see one sister running across the event, the other answering questions, our dad setting up props, our mom being our mental support, but somehow everything comes together.",
      "But one thing we are serious about: our vendors are not just booth numbers to us. We want to know your business. We want to see you grow. We want you making content, meeting people, talking to customers, making friends, and actually taking advantage of the event. We will bring the market. You bring the reason someone stops at your booth. Deal?",
    ],
  },
  {
    question: "Can you guarantee I'll make money?",
    answer: [
      "If somebody tells you they can guarantee sales at a market... girl, walk away.",
      "We can advertise, create content, build an experience, bring entertainment, choose locations, and work our asses off to get people there. But what happens at your booth matters too.",
      "Talk to people. Make your setup cute. Post that you are coming. Have customer service. Create content. Give people a reason to remember you. We bring the opportunity. You do your thing with it.",
    ],
  },
  {
    question: "How do I contact you?",
    answer: [
      "Quick question? DM us. Something serious, sponsorship, business, or partnership related? Use our website contact form.",
      "And if it is market day and it takes us a minute to answer... we are probably physically running around the event and cannot get to our phone right away.",
    ],
  },
  {
    question: "Okay, but can I just come shop?",
    answer: [
      "Girl, yes. That is the whole point. MarketElla is free entry and all ages.",
      "Come with your girls, bring the kids, bring your mom, make it a date, or come by yourself. You do not need a ticket and you definitely do not need an excuse to come hang out.",
      "Shop small businesses, grab something to eat, get a drink, stay for the music, and see what we have going on that day. MarketElla is for all the girlies. And yes, the guys can come too. We promise. If you have time, come say hi to us.",
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="faq-page">
      <section className="faq-hero">
        <SiteHeader ariaLabel="FAQ navigation" className="faq-hero-nav" variant="hero" />
        <MarqueeBand
          className="faq-hero-marquee"
          label="comments? questions? concerns?"
          phrases={["comments? questions? concerns?", "we got u", "marketella help desk"]}
        />
        <h1>comments? questions? concerns?</h1>
      </section>

      <section className="faq-section" aria-labelledby="faq-heading">
        <div className="faq-section-heading">
          <p className="eyebrow">q&amp;a separate for you</p>
          <h2 id="faq-heading">let us help.<br />we got u!</h2>
        </div>
        <div className="faq-accordion">
          {questions.map(({ question, answer }) => (
            <details key={question}>
              <summary>
                <span>{question}</span>
                <b aria-hidden="true">+</b>
              </summary>
              <div className="faq-answer">
                {answer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </details>
          ))}
        </div>
      </section>

      <SiteFooter actionHref="/apply" actionLabel="Apply to sell" />
    </main>
  );
}
