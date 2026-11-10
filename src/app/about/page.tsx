import Image from "next/image";
import ContactFormSection from "@/components/contact-form-section";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getSiteMedia } from "@/lib/site-media";

export const metadata = { title: "About | MarketElla", description: "Meet MarketElla, a creative market family in Las Vegas." };

export default async function AboutPage() {
  const siteMedia = await getSiteMedia();

  return (
    <main className="page-shell about-page">
      <section
        className="what-splash"
        style={{ "--asset-image": "url(/assets/site/img-3076-web.webp)" } as React.CSSProperties}
      >
        <SiteHeader ariaLabel="About page navigation" className="about-hero-nav" variant="hero" />
        <h1>what the f*** is marketella?</h1>
      </section>

      <section
        className="story-split"
        id="what-is-marketella"
        style={{ "--asset-image": `url(${siteMedia.aboutStory})` } as React.CSSProperties}
      >
        <div className="story-layout">
          <div className="story-copy">
            <p>
              MarketElla began in 2023 as 702 Market, built by two sisters and
              a family with a lot of ideas. We started by bringing local
              businesses and shoppers together in Las Vegas. Three years later,
              we’re still doing that, just with bigger ideas, more places to
              go, and a different personality for every event.
            </p>
            <p>
              One week it might be a night out with your friends. The next,
              something the whole family can come to. We love giving small
              businesses a place to show up and giving Vegas a reason to get
              out of the house.
            </p>
            <h2>The name is new, but the same experiences</h2>
          </div>
        </div>
      </section>

      <section className="marketella-values">
        <div className="values-content">
          <div className="values-heading">
            <h2>what makes marketella, marketella?</h2>
          </div>
          <div className="values-grid">
            <div>
              <h3>built around our community</h3>
              <p>
                We have always been about the people. We have watched businesses
                grow, made real friendships, and met so many people who continue
                to show up for us. We want everyone who comes through our
                markets to feel welcomed and supported.
              </p>
            </div>
            <div>
              <h3>every market is different</h3>
              <p>
                We put a lot of thought into every event. New themes, different
                locations, activities, food, photo ops, and little details that
                make each market feel special. We never want it to feel like you
                are coming to the same event again and over again.
              </p>
            </div>
            <div>
              <h3>more than a market</h3>
              <p>
                Yes, you are here to shop small, but it has become so much more
                than that. It is somewhere to bring your friends and family,
                discover a new favorite business, eat something good, take
                pictures, and just have a good time. That is what we want
                MarketElla to feel like.
              </p>
            </div>
          </div>
        </div>
        <div
          className="values-photo"
          style={{ "--asset-image": `url(${siteMedia.homeGallery[1].src})` } as React.CSSProperties}
          aria-label="MarketElla vendor market"
          role="img"
        />
      </section>

      <section className="owners-section" aria-labelledby="owners-heading">
        <div className="owners-heading">
          <h2 id="owners-heading">meet the owners</h2>
        </div>
        <Image
          className="owners-feature-photo"
          src="/IMG_3215.JPG"
          alt="The MarketElla co-founders together at a market."
          width={1200}
          height={1800}
          sizes="(max-width: 680px) calc(100vw - 44px), 86vw"
        />
        <div className="owners-grid">
          <article className="owner-card">
            <h3>Samantha</h3>
            <p>[28] | SINGLE MOM</p>
            <span>The single mama juggling motherhood, vendor applications, permits, and property relationships. From coordinating with venues to making sure everything comes together behind the scenes, she’s always got a million things on her plate. One half of the sister duo making Marketella happen.</span>
          </article>
          <article className="owner-card">
            <h3>Sabrena</h3>
            <p>[23] | DOG MOM</p>
            <span>The dog mama behind Marketella’s social media, marketing, and advertising. From creating content and promoting events to keeping everyone updated, she’s the creative mind helping bring Marketella to your screens. The other half of the sister duo making it all happen.</span>
          </article>
          <article className="owner-card owner-card-family">
            <h3>the family</h3>
            <p>the heart and soul</p>
            <span>The family behind the early mornings, late nights, setups, breakdowns, and everything in between. From lending a helping hand to stepping in whenever things get chaotic, they’re the backbone of Marketella. What started as a family idea continues to be a family effort, and we wouldn’t have it any other way.</span>
          </article>
        </div>
      </section>

      <ContactFormSection id="about-contact" />
      <SiteFooter />
    </main>
  );
}
