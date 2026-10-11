import Image from "next/image";
import ContactFormSection from "@/components/contact-form-section";
import MarqueeBand from "@/components/marquee-band";
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
        <MarqueeBand
          className="about-hero-marquee"
          label="where everyone's a star"
          phrases={["where everyone's a star", "come as you are", "not your average market"]}
        />
        <h1>what the f*** is marketella?</h1>
      </section>

      <section
        className="story-split"
        id="what-is-marketella"
        style={{ "--asset-image": `url(${siteMedia.aboutStory})` } as React.CSSProperties}
      >
        <MarqueeBand
          className="story-marquee"
          label="the marketella family"
          phrases={["the marketella family", "come as you are", "where everyone's a star"]}
        />
        <div className="story-layout">
          <div className="story-reference">
            <p>
              established in 2023, marketella started with a crazy idea: what
              if we created a space where local businesses, families,
              creatives, and shoppers could all come together?
            </p>
          </div>
          <div className="story-copy">
            <p className="eyebrow">what is marketella?</p>
            <p>
              MarketElla began in 2023 as 702 Market, built by two sisters and
              a family with a lot of ideas. We started by bringing local
              businesses and shoppers together in Las Vegas. Three years later,
              we are still doing that, just with bigger ideas, more places to
              go, and a different personality for every event.
            </p>
            <p>
              One week it might be a night out with your friends. The next,
              something the whole family can come to. We love giving small
              businesses a place to show up and giving Vegas a reason to get
              out of the house.
            </p>
            <h2>the name is new. but the same experiences.</h2>
          </div>
        </div>
      </section>

      <section className="marketella-values">
        <div className="values-content">
          <div className="values-heading">
            <p className="eyebrow">what makes marketella, marketella?</p>
            <h2>what sets us apart</h2>
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
          <p className="eyebrow">meet the owners</p>
          <h2 id="owners-heading">two sisters. one family. a lot of ideas.</h2>
        </div>
        <div className="owners-grid">
          <article className="owner-card">
            <Image
              className="owner-photo owner-photo-left"
              src="/IMG_3215.JPG"
              alt="Samantha, co-founder of MarketElla."
              width={900}
              height={1100}
              sizes="(max-width: 680px) 100vw, 30vw"
            />
            <h3>Samantha</h3>
            <p>Co-founder</p>
            <span>Community builder, market maker, and one half of the sister team behind MarketElla.</span>
          </article>
          <article className="owner-card">
            <Image
              className="owner-photo owner-photo-right"
              src="/IMG_3215.JPG"
              alt="Sabrena, co-founder of MarketElla."
              width={900}
              height={1100}
              sizes="(max-width: 680px) 100vw, 30vw"
            />
            <h3>Sabrena</h3>
            <p>Co-founder</p>
            <span>Creative lead, small-business champion, and the other half of the MarketElla sister team.</span>
          </article>
          <article className="owner-card owner-card-family">
            <Image
              className="owner-photo"
              src="/IMG_3214.JPG"
              alt="The family and friends behind MarketElla."
              width={1200}
              height={900}
              sizes="(max-width: 680px) 100vw, 30vw"
            />
            <h3>the family</h3>
            <p>The MarketElla crew</p>
            <span>The people behind the setup, props, playlists, problem solving, and every market-day detail.</span>
          </article>
        </div>
      </section>

      <ContactFormSection id="about-contact" />
      <SiteFooter actionHref="/apply" actionLabel="Sell with us" />
    </main>
  );
}
