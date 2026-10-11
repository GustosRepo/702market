import ContactFormSection from "@/components/contact-form-section";
import MarqueeBand from "@/components/marquee-band";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import PodcastSubmissionForm from "@/components/podcast-submission-form";
import { getPodcastEpisodes } from "@/lib/podcast";

export const metadata = {
  title: "702 Chisme Podcast | MarketElla",
  description: "Market talk, real stories, and behind the scenes from MarketElla.",
};

export default async function PodcastPage() {
  const episodes = await getPodcastEpisodes();

  return (
    <main className="podcast-page">
      <section className="podcast-hero">
        <SiteHeader ariaLabel="Podcast navigation" className="podcast-hero-nav" variant="hero" />
        <div className="podcast-hero-content">
          <div className="podcast-hero-title">
            <p className="eyebrow">market talk, real stories</p>
            <h1>the 702 chisme podcast</h1>
            <p>Market talk, real stories, behind the scenes, and whatever is on our minds.</p>
          </div>
          <div className="podcast-hero-photo" aria-label="MarketElla podcast hosts" role="img" />
        </div>
        <MarqueeBand
          className="podcast-hero-marquee"
          label="market talk. real stories. behind the scenes."
          phrases={["market talk", "real stories", "behind the scenes", "randomness"]}
        />
      </section>

      <section className="podcast-episodes" aria-labelledby="episodes-heading">
        <div className="podcast-episodes-heading">
          <p className="eyebrow">episodes</p>
          <h2 id="episodes-heading">pick one. we have a lot to say.</h2>
        </div>
        {episodes.length ? <div className="episode-grid">
          {episodes.map((episode) => (
            <article className="episode-card" key={episode.slug}>
              <div className="episode-photo" style={{ "--asset-image": `url(${episode.imagePath})` } as React.CSSProperties} aria-hidden="true" />
              <p className="episode-number">{String(episode.episodeNumber).padStart(2, "0")}</p>
              <h3>{episode.title}</h3>
              <p>{episode.description || "Episode coming soon."}</p>
              {episode.listenUrl ? (
                <a href={episode.listenUrl} rel="noreferrer" target="_blank">listen now</a>
              ) : (
                <span>listen soon</span>
              )}
            </article>
          ))}
        </div> : <div className="podcast-empty-state"><p className="eyebrow">recording in progress</p><h3>new chisme<br />is loading.</h3><p>Fresh episodes will appear here as soon as they are ready to listen.</p></div>}
      </section>

      <section className="podcast-submissions" aria-label="Podcast submissions">
        <PodcastSubmissionForm
          buttonLabel="Tell us your story"
          className="podcast-form-story"
          description="Sometimes each other. Sometimes vendors. Sometimes business owners. Sometimes people with really interesting stories. The story can be yours."
          eyebrow="we'll use your story"
          fieldLabel="Your story"
          heading="who are we talking to?"
          type="podcast_story"
        />
        <PodcastSubmissionForm
          buttonLabel="Drop 702 chisme"
          className="podcast-form-chisme"
          description="Dating disaster? Family situation? Business story? Need advice? Have an unpopular opinion? Want us to settle an argument?"
          eyebrow="real life chisme"
          fieldLabel="Drop the chisme"
          heading="what are you chisme-ing?"
          type="podcast_chisme"
        />
      </section>

      <ContactFormSection id="podcast-contact" />
      <SiteFooter actionHref="/socials" actionLabel="Follow along" />
    </main>
  );
}
