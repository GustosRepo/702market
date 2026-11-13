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
        style={{ "--asset-image": "url(/assets/site/about-hero-web.webp)" } as React.CSSProperties}
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
              <strong>Pronounced: Market-Ella</strong>
              <br />
              <strong>Not Your Average Market.</strong>
            </p>
            <p>
              Marketella is more than just a market. It’s a community, a family,
              a place for the girls, the small businesses, the dreamers, and
              anyone who loves a good time! Our story started in 2023 as 702
              Market, created by two sisters, a family with big dreams, and a
              whole lot of determination. Before we became market organizers,
              we were vendors ourselves, and guess what? We still are! We know
              what it’s like to be on the other side of the booth, hoping for a
              good day, making connections, and putting everything you’ve got
              into something you love.
            </p>
            <p>
              What started as an idea turned into something we never imagined.
              Three years, countless events, late nights, stressful moments,
              happy tears, and so many amazing people later, here we are! But as
              we grew, we realized something was missing. We wanted a name that
              felt more like US. Something with personality, something feminine,
              something fun, but most importantly, something that had meaning
              behind it. And that’s how Marketella was born.
            </p>
            <p>
              In Spanish, <em>ella</em> means “she” or “her.” But to us, it
              represents so much more. She’s the dreamer, the hustler, the
              creative one, the girl who turns her little ideas into something
              big. She’s the woman building her own business, the mom chasing
              her dreams, the girl finding herself, and the goddess who knows
              she’s capable of anything.
            </p>
            <p>
              But there’s an even more personal reason we chose the name. Our
              mom’s middle name is Gabriella, and she is a huge part of why
              we’re here today. When we first started, there were moments when
              things got difficult, when we questioned ourselves, and when
              giving up honestly felt easier. But our mom was always the one
              reminding us to keep going. She believed in us even during the
              moments we struggled to believe in ourselves. Having a piece of
              her name in ours is our way of honoring the woman who never let
              us forget what we were capable of.
            </p>
            <p>
              So Marketella isn’t just a name. It’s a little piece of our mom,
              our family, our journey, and every woman who’s ever had a dream
              worth fighting for.
            </p>
            <p>
              And let’s talk about the girls for a second! We wanted to create
              something that feels like getting ready with your besties,
              grabbing your favorite drink, shopping from amazing small
              businesses, taking cute pictures, dancing to good music, and
              making memories. A place where you can show up with your girls,
              your family, your kids, or even by yourself and still feel like
              you belong. We’re all about supporting small businesses, bringing
              people together, celebrating different cultures, having fun with
              our themes, and making every event feel like more than just
              another shopping trip.
            </p>
            <p>
              We’re still the same family behind 702 Market. We still have the
              same love for our vendors and our community. We’re just growing,
              dreaming bigger, and finally stepping into something that feels
              completely like us.
            </p>
            <p>
              Marketella isn’t just a new name. It’s our story, our personality,
              and our next chapter. And trust us, we’re just getting started!
            </p>
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
          style={{ "--asset-image": "url(/assets/site/about-community-web.webp)" } as React.CSSProperties}
          aria-label="Four friends showing their 702 Market tote bags at an event."
          role="img"
        />
      </section>

      <section className="owners-section" aria-labelledby="owners-heading">
        <div className="owners-heading">
          <h2 id="owners-heading">meet the owners</h2>
        </div>
        <Image
          className="owners-feature-photo"
          src="/assets/site/owners-family-web.webp"
          alt="The family behind MarketElla posing together at a market."
          width={2400}
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
