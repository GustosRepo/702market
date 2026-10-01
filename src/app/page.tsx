import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import { getEvents } from "@/lib/events";
import { getHomepageContent } from "@/lib/homepage-content";
import { getSiteMedia } from "@/lib/site-media";

const marqueePhrases = [
  "not your average market",
  "market talk",
  "real stories",
  "behind the scenes",
  "shop small",
  "vegas outside",
];

const locations = [
  {
    name: "fergusons downtown",
    tagline: "we take over the street.",
    description:
      "Our biggest themed markets with 70+ small businesses and full-on experiences.",
    image: "/IMG_3076.JPG",
    href: "https://www.google.com/maps/search/?api=1&query=Fergusons+Downtown+Las+Vegas",
  },
  {
    name: "cowabunga canyon",
    tagline: "where the whole family comes to play",
    description:
      "Family-friendly themed markets filled with shopping, food, activities, and fun.",
    image: "/IMG_3223.JPG",
    href: "https://www.google.com/maps/search/?api=1&query=Cowabunga+Canyon+Las+Vegas",
  },
  {
    name: "container park",
    tagline: "cultura meets community",
    description:
      "Culturally inspired markets celebrating our Latino community and small businesses.",
    image: "/IMG_3224.JPG",
    href: "https://www.google.com/maps/search/?api=1&query=Downtown+Container+Park+Las+Vegas",
  },
];

const pressLinks = [
  { name: "channel 8", href: "https://www.8newsnow.com/" },
  { name: "influence.vegas", href: "https://influence.vegas/" },
  { name: "fox 5", href: "https://www.fox5vegas.com/" },
];

const faqs = [
  [
    "wait... how do i actually vend with you?",
    "Pick your Marketella event. Apply. Show us what you got. Yes, we will stalk your business page a little. We want to see your products, setup, vibe, and the whole thing.",
  ],
  [
    "what's it actually like vending with you?",
    "A little chaotic, in a cute way. One sister may be running across the event, the other answering questions, and somehow everything comes together. We bring the market. You bring the reason someone stops at your booth.",
  ],
  [
    "do i need a business license?",
    "We handle event licenses and insurance, but if you have your own license, send it our way. Food vendors still need the correct health department numbers and permits.",
  ],
  [
    "what can i sell?",
    "Cute stuff. Clothing, vintage, handmade goods, jewelry, art, accessories, collectibles, home decor, beauty, food, desserts, drinks, and the random little things people absolutely did not need but leave carrying.",
  ],
  [
    "do you accept brand new businesses?",
    "Yes. You do not need 10K followers or a perfect booth. We want to see what you are building and how you show up.",
  ],
  [
    "can you guarantee i'll make money?",
    "No honest market can guarantee sales. We bring the event, promotion, location, and energy. Your setup, content, product, and customer service matter too.",
  ],
  [
    "okay, but can i just come shop?",
    "Girl, yes. Marketella is free entry, all ages, and built for shoppers, families, friends, dates, and anyone who needs a reason to get out of the house.",
  ],
  [
    "how do i contact you?",
    "Quick question? DM us. Something serious, sponsorship, business, or partnership related? Use the contact form. If it is market day, give us a minute because we are probably running around the event.",
  ],
];

function getDateParts(dateLabel: string) {
  const [month = "", day = "", year = ""] = dateLabel.split(" ");

  return {
    day: day.replace(",", ""),
    month,
    year,
  };
}

function MarqueeBand({
  label = "not your average market",
  phrases = marqueePhrases,
  className = "",
}: {
  label?: string;
  phrases?: string[];
  className?: string;
}) {
  const repeated = [...phrases, label, ...phrases];

  return (
    <div className={`marquee-band ${className}`.trim()} aria-hidden="true">
      <div className="marquee-track">
        {repeated.map((phrase, index) => (
          <span key={`${phrase}-${index}`}>{phrase}</span>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const [events, siteMedia, homepageContent] = await Promise.all([
    getEvents(),
    getSiteMedia(),
    getHomepageContent(),
  ]);
  const nextEvent = events.find((event) => event.status === "upcoming");
  const nextEventDate = nextEvent ? getDateParts(nextEvent.dateLabel) : null;
  const newLocation = homepageContent.newLocation;

  return (
    <main className="marketella-home">
      <section
        className="marketella-hero"
        style={{ "--hero-image": `url(${siteMedia.homeHero})` } as React.CSSProperties}
      >
        <nav className="site-nav marketella-nav" aria-label="Main navigation">
          <Link className="wordmark marketella-wordmark" href="/" aria-label="Marketella home">
            Marketella
            <small>est. 2023</small>
          </Link>
          <div className="nav-links">
            <Link href="/apply">Apply 2 Sell</Link>
            <Link href="#what-is-marketella">What&apos;s Marketella?</Link>
            <Link href="/merch">Shop</Link>
            <Link href="#calendar">Calendar</Link>
            <Link href="#faq">FAQ</Link>
            <Link href="/socials">Link Tree</Link>
            <Link href="#podcast">Podcast</Link>
          </div>
        </nav>

        <div className="butterfly-field" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, index) => (
            <svg className="butterfly-svg" viewBox="0 0 96 72" focusable="false" key={index}>
              <path className="wing wing-left" d="M45 36C34 8 7 3 4 23c-3 18 18 31 38 21 2-1 4-4 3-8Z" />
              <path className="wing wing-right" d="M51 36C62 8 89 3 92 23c3 18-18 31-38 21-2-1-4-4-3-8Z" />
              <path className="lower-wing lower-left" d="M43 40C25 40 14 52 20 63c6 10 24 3 29-16 1-4-1-7-6-7Z" />
              <path className="lower-wing lower-right" d="M53 40c18 0 29 12 23 23-6 10-24 3-29-16-1-4 1-7 6-7Z" />
              <path className="butterfly-body" d="M48 25c4 0 7 7 7 17s-3 22-7 22-7-12-7-22 3-17 7-17Z" />
              <path className="antenna" d="M45 28C38 17 31 14 24 15M51 28c7-11 14-14 21-13" />
            </svg>
          ))}
        </div>

        <div className="hero-content marketella-hero-content">
          <h1>WELCOME 2 MARKETELLA</h1>
          <p className="hero-copy">
            Not your average Las Vegas market. Shopping, food, music, photo ops,
            family, friends, and cute finds you did not plan on taking home.
          </p>
          <div className="hero-actions">
            <Link className="button button-light" href="/events">
              Tell me more <span aria-hidden="true">↓</span>
            </Link>
            <Link className="button button-accent" href="/apply">
              Apply 2 sell <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {newLocation.active ? (
        <section
          className="new-location-section"
          aria-labelledby="new-location-heading"
          style={
            {
              "--new-location-strip-image": `url(${siteMedia.newLocationStrip})`,
            } as React.CSSProperties
          }
        >
          <MarqueeBand
            className="marquee-soft"
            label={newLocation.topMarqueePhrases[0]}
            phrases={newLocation.topMarqueePhrases}
          />
          <div className="spray-butterfly spray-butterfly-left" aria-hidden="true">
            <svg viewBox="0 0 180 130" focusable="false">
              <path d="M82 64C55 4 7 16 14 56c6 35 45 42 68 19 4-4 4-8 0-11Z" />
              <path d="M98 64c27-60 75-48 68-8-6 35-45 42-68 19-4-4-4-8 0-11Z" />
              <path d="M78 73c-38 1-54 31-31 47 20 14 46-7 43-35-1-8-5-12-12-12Z" />
              <path d="M102 73c38 1 54 31 31 47-20 14-46-7-43-35 1-8 5-12 12-12Z" />
            </svg>
          </div>
          <div className="spray-butterfly spray-butterfly-right" aria-hidden="true">
            <svg viewBox="0 0 180 130" focusable="false">
              <path d="M82 64C55 4 7 16 14 56c6 35 45 42 68 19 4-4 4-8 0-11Z" />
              <path d="M98 64c27-60 75-48 68-8-6 35-45 42-68 19-4-4-4-8 0-11Z" />
              <path d="M78 73c-38 1-54 31-31 47 20 14 46-7 43-35-1-8-5-12-12-12Z" />
              <path d="M102 73c38 1 54 31 31 47-20 14-46-7-43-35 1-8 5-12 12-12Z" />
            </svg>
          </div>
          <div className="new-location-content">
            <h2 id="new-location-heading">
              {newLocation.headingLabel}
              <br />
              {newLocation.locationName}
            </h2>
            <p>{newLocation.description}</p>
            <Link className="new-location-button" href={newLocation.buttonHref}>
              {newLocation.buttonLabel}
            </Link>
          </div>
          <MarqueeBand
            className="marquee-apply"
            label={newLocation.bottomMarqueePhrases[0]}
            phrases={newLocation.bottomMarqueePhrases}
          />
        </section>
      ) : null}

      <section className="market-section marketella-next" id="calendar">
        <div className="section-heading">
          <p className="eyebrow">upcoming market</p>
          <h2>next market</h2>
        </div>
        <div className="next-market-collage" aria-label="Marketella next market photos">
          <Image src="/IMG_3217.JPG" alt="Marketella vendor setup and shoppers." width={1100} height={760} sizes="(max-width: 680px) 100vw, 45vw" />
          <Image src="/IMG_3226.JPG" alt="Marketella community moment." width={1100} height={760} sizes="(max-width: 680px) 100vw, 45vw" />
        </div>
        <div className="event-feature marketella-event-feature">
          {nextEventDate ? (
            <div className="event-date">
              <span>{nextEventDate.day}</span>
              <small>
                {nextEventDate.month.slice(0, 3)}
                <br />
                {nextEventDate.year}
              </small>
            </div>
          ) : null}
          <div className="event-details">
            <p className="event-kicker">{nextEvent?.title || "Marketella event"}</p>
            <h3>{nextEvent ? nextEvent.location : "More dates soon."}</h3>
            <p>
              {nextEvent
                ? `${nextEvent.dateLabel} · ${nextEvent.time} · ${nextEvent.location}`
                : "Check back for the next Las Vegas market."}
            </p>
          </div>
          <div className="event-actions">
            <Link className="button button-dark" href={nextEvent ? `/events/${nextEvent.slug}` : "/events"}>
              Event details <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/events">
              Add us to your calendar <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="press-strip" aria-labelledby="press-heading">
        <p className="eyebrow" id="press-heading">same wording</p>
        <h2>maybe you&apos;ve heard of us?</h2>
        <div className="press-links">
          {pressLinks.map((link) => (
            <a href={link.href} key={link.name} target="_blank" rel="noreferrer">
              {link.name} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="apply-splash" id="apply">
        <div>
          <p className="eyebrow">apply to sell</p>
          <h2>bring the setup. bring the product. bring the reason they stop.</h2>
        </div>
        <Link className="button button-light" href={nextEvent ? `/apply/${nextEvent.slug}` : "/apply"}>
          Apply now <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section
        className="family-splash"
        style={{ "--asset-image": `url(${siteMedia.socialCta})` } as React.CSSProperties}
      >
        <MarqueeBand label="join the marketella family" />
        <div>
          <p className="eyebrow">same wording</p>
          <h2>join the marketella family</h2>
          <Link className="button button-light" href="/apply">
            Learn more <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="locations-section" id="locations" aria-labelledby="locations-heading">
        <div className="section-heading">
          <p className="eyebrow">our locations</p>
          <h2 id="locations-heading">same marketella, different personality.</h2>
        </div>
        <div className="location-grid">
          {locations.map((location) => (
            <article className="location-card" key={location.name}>
              <Image src={location.image} alt={`${location.name} market location`} width={900} height={1100} sizes="(max-width: 680px) 100vw, 30vw" />
              <div>
                <h3>{location.name}</h3>
                <p className="location-tagline">{location.tagline}</p>
                <p>{location.description}</p>
                <a href={location.href} target="_blank" rel="noreferrer">
                  Open map <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="map-calendar-section">
        <div>
          <p className="eyebrow">map</p>
          <h2>pick the place. pull up.</h2>
          <p>Every location card has a map link so you can get there without decoding our captions like a treasure map.</p>
          <a className="button button-dark" href="https://www.google.com/maps/search/?api=1&query=Marketella+Las+Vegas" target="_blank" rel="noreferrer">
            Open map <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div>
          <p className="eyebrow">calendar</p>
          <h2>add us before you forget.</h2>
          <p>Until the Google Calendar feed is wired, the events page is the source of truth for dates, times, and applications.</p>
          <Link className="button button-accent" href="/events">
            See calendar <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section
        className="what-splash"
        style={{ "--asset-image": `url(${siteMedia.contactCommunity})` } as React.CSSProperties}
      >
        <MarqueeBand label="what the f**** is marketella????" />
        <h2>what the f**** is marketella????</h2>
      </section>

      <section
        className="story-split"
        id="what-is-marketella"
        style={{ "--asset-image": `url(${siteMedia.aboutStory})` } as React.CSSProperties}
      >
        <div className="story-reference">
          <p>
            established in 2023, 702 market started with a crazy idea: what if
            we created a space where local businesses, families, creatives, and
            shoppers could all come together?
          </p>
        </div>
        <div className="story-copy">
          <p className="eyebrow">what is marketella?</p>
          <h2>the name is new. the experience is not.</h2>
          <p>
            Marketella began in 2023 as 702 Market, built by two sisters and a
            family with a lot of ideas. We started by bringing local businesses
            and shoppers together in Las Vegas. Three years later, we are still
            doing that, just with bigger ideas, more places to go, and a
            different personality for every event.
          </p>
          <p>
            One week it might be a night out with your friends. The next,
            something the whole family can come to. We love giving small
            businesses a place to show up and giving Vegas a reason to get out
            of the house.
          </p>
        </div>
      </section>

      <section className="owners-section">
        <div className="section-heading">
          <p className="eyebrow">meet the owners</p>
          <h2>two sisters. one family. a lot of ideas.</h2>
        </div>
        <div className="owners-grid">
          <Image src="/IMG_3214.JPG" alt="Marketella founders and community moment." width={900} height={1100} sizes="(max-width: 680px) 100vw, 38vw" />
          <div>
            <p>
              Marketella is built by family, friends, and the people who show up
              with tables, racks, playlists, props, and a little bit of chaos.
            </p>
            <p>
              We are saving this space for the real owner photos and bios, but
              the feeling is already here: personal, community-first, and very
              much not a corporate market.
            </p>
          </div>
        </div>
      </section>

      <section className="marketella-values">
        <div>
          <p className="eyebrow">what makes marketella, marketella?</p>
          <h2>built around our community</h2>
          <p>
            We have watched businesses grow, made real friendships, and met so
            many people who continue to show up for us.
          </p>
        </div>
        <div>
          <h3>every market is different</h3>
          <p>
            New themes, different locations, activities, food, photo ops, and
            little details that make each market feel special.
          </p>
        </div>
        <div>
          <h3>more than a market</h3>
          <p>
            Bring your friends, bring your family, discover a new favorite
            business, eat something good, take pictures, and hang out.
          </p>
        </div>
      </section>

      <section className="media-section marketella-media" aria-labelledby="media-heading">
        <div className="section-heading">
          <p className="eyebrow">marketella moments</p>
          <h2 id="media-heading">pics or it happened anyway.</h2>
        </div>
        <div className="media-grid">
          {siteMedia.homeGallery.map((photo, index) => (
            <figure className={`media-card media-card-${index + 1}`} key={photo.src}>
              <Image src={photo.src} alt={photo.alt} width={1200} height={1500} sizes="(max-width: 680px) 100vw, 30vw" />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="contact-splash">
        <MarqueeBand label="comments? questions? concerns?" />
        <div>
          <h2>comments? questions? concerns?</h2>
          <Link className="button button-light" href="/contact">
            Tell us <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="faq-home" id="faq">
        <div className="section-heading">
          <p className="eyebrow">q&a separate for you</p>
          <h2>questions here</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="social-podcast" id="podcast">
        <div>
          <p className="eyebrow">702 chisme podcast</p>
          <h2>market talk. real stories. behind the scenes. randomness.</h2>
          <p>
            A home for the stories, small business lessons, event chaos, and
            market-day conversations that do not fit in a caption.
          </p>
        </div>
        <Image className="podcast-photo" src="/IMG_3075.JPG" alt="Marketella podcast and behind the scenes placeholder." width={900} height={900} sizes="(max-width: 680px) 100vw, 26vw" />
        <div className="social-stack">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook ↗</a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">TikTok ↗</a>
          <Link href="/socials">Link tree ↗</Link>
        </div>
      </section>

      <SiteFooter actionHref="/apply" actionLabel="Apply 2 sell" />
    </main>
  );
}
