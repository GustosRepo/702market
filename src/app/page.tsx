import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <nav className="site-nav" aria-label="Main navigation">
          <Link className="wordmark" href="/" aria-label="702Market home">
            702<span>Market</span>
          </Link>
          <div className="nav-links">
            <Link href="/events">Next market</Link>
            <a href="#about">About</a>
            <a href="#merch">Merch</a>
          </div>
          <Link className="nav-apply" href="/apply">
            Apply to sell <span aria-hidden="true">↗</span>
          </Link>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">Las Vegas, Nevada · Est. 2026</p>
          <h1>
            Find your <em>people.</em>
            <br />
            Find your <em>thing.</em>
          </h1>
          <p className="hero-copy">
            A night market for the collectors, makers, dreamers, and good
            shoppers of Las Vegas.
          </p>
          <Link className="button button-light" href="/events">
            See what&apos;s next <span aria-hidden="true">↓</span>
          </Link>
        </div>

        <div className="hero-note" aria-hidden="true">
          <span>Good finds</span>
          <span>Good people</span>
          <span>Good times</span>
        </div>
      </section>

      <section className="market-section" id="next-market">
        <div className="section-heading">
          <p className="eyebrow">Circle the date</p>
          <h2>The next one.</h2>
        </div>
        <div className="event-feature">
          <div className="event-date">
            <span>24</span>
            <small>OCT<br />2026</small>
          </div>
          <div className="event-details">
            <p className="event-kicker">702Market Night Market</p>
            <h3>Downtown after dark.</h3>
            <p>Saturday · 4:00 PM–10:00 PM · Downtown Las Vegas</p>
          </div>
          <Link className="button button-dark" href="/events/october-night-market">
            Event details <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-stamp">LV<br /><span>702</span></div>
        <div className="about-copy">
          <p className="eyebrow">A market with a pulse</p>
          <h2>Made for the wonderfully <em>different.</em></h2>
          <p>
            702Market brings together local artists, vintage hunters, small
            businesses, and the people who love finding something they didn&apos;t
            know they needed.
          </p>
        </div>
      </section>

      <section className="vendor-section" id="vendor">
        <div>
          <p className="eyebrow">Bring your best stuff</p>
          <h2>Make a little room<br /><em>for your table.</em></h2>
        </div>
        <div className="vendor-action">
          <p>Applications for the October night market are open now.</p>
          <a className="button button-accent" href="/apply/october-night-market">
            Apply to sell <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="merch-section" id="merch">
        <div>
          <p className="eyebrow">Wear the neighborhood</p>
          <h2>Market<br /><em>merch.</em></h2>
        </div>
        <a className="merch-tile" href="/merch">
          <span className="merch-circle">702</span>
          <span>Shop the drop <b aria-hidden="true">↗</b></span>
        </a>
      </section>

      <footer className="site-footer">
        <Link className="wordmark" href="/">702<span>Market</span></Link>
        <p>Las Vegas, NV · Come find us.</p>
        <a href="mailto:hello@702market.com">hello@702market.com</a>
      </footer>
    </main>
  );
}
