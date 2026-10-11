import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { AdminConfirmAction } from "@/components/admin-confirm-action";
import {
  getAdminPodcastEpisodes,
  type PodcastArchiveView,
} from "@/lib/podcast";
import {
  archivePodcastEpisode,
  restorePodcastEpisode,
  togglePodcastEpisodePublished,
} from "./actions";

export const metadata = { title: "Podcast | MarketElla Admin" };

type AdminPodcastPageProps = {
  searchParams: Promise<{ archive?: string }>;
};

function cleanArchive(value?: string): PodcastArchiveView {
  return value === "archived" || value === "all" ? value : "active";
}

function archiveHref(archive: PodcastArchiveView) {
  return archive === "active" ? "/admin/podcast" : `/admin/podcast?archive=${archive}`;
}

export default async function AdminPodcastPage({ searchParams }: AdminPodcastPageProps) {
  const { archive } = await searchParams;
  const archiveView = cleanArchive(archive);
  const episodes = await getAdminPodcastEpisodes(archiveView);

  return (
    <AdminShell title="Podcast">
      <div className="admin-toolbar">
        <p>Manage 702 Chisme episodes, photos, listening links, and public visibility.</p>
        <Link className="button button-accent" href="/admin/podcast/new">+ Add episode</Link>
      </div>
      <section className="admin-filter-row" aria-label="Podcast archive filters">
        {(["active", "archived", "all"] as const).map((value) => (
          <Link className={archiveView === value ? "filter-active" : ""} href={archiveHref(value)} key={value}>
            {value}
          </Link>
        ))}
      </section>
      {episodes.length ? (
        <section className="admin-product-list">
          {episodes.map((episode) => (
            <article key={episode.slug}>
              <div className="admin-product-art">{String(episode.episodeNumber).padStart(2, "0")}</div>
              <div>
                <h2>{episode.title}</h2>
                <p>{episode.description || "No episode description yet."}</p>
                <span className={`status-pill ${episode.published ? "status-active" : "status-cancelled"}`}>
                  {episode.published ? "Published" : "Draft"}
                </span>
                {!episode.listenUrl && <span className="status-pill status-featured">Listen link pending</span>}
              </div>
              <Link className="text-button" href={`/admin/podcast/${episode.slug}/edit`}>Edit</Link>
              <AdminConfirmAction
                action={togglePodcastEpisodePublished}
                confirmLabel={episode.published ? "Unpublish episode" : "Publish episode"}
                fields={{ slug: episode.slug, published: String(episode.published) }}
                message={episode.published ? `Hide “${episode.title}” from the public podcast page?` : `Make “${episode.title}” visible on the public podcast page?`}
                title={episode.published ? "Unpublish this episode?" : "Publish this episode?"}
                tone={episode.published ? "danger" : "default"}
                triggerLabel={episode.published ? "Unpublish" : "Publish"}
              />
              {episode.archivedAt ? (
                <form action={restorePodcastEpisode}><input name="slug" type="hidden" value={episode.slug} /><button className="text-button" type="submit">Restore</button></form>
              ) : (
                <AdminConfirmAction action={archivePodcastEpisode} confirmLabel="Archive episode" fields={{ slug: episode.slug }} message={`Archive “${episode.title}”? Its content and media references will be preserved.`} title="Archive this episode?" tone="danger" triggerLabel="Archive" />
              )}
            </article>
          ))}
        </section>
      ) : (
        <section className="admin-empty-panel compact">
          <p className="eyebrow">No episodes yet</p>
          <h2>Start the<br /><em>chisme.</em></h2>
          <p>Add an episode when it is ready for the public podcast page.</p>
          <Link className="button button-accent" href="/admin/podcast/new">Add episode ↗</Link>
        </section>
      )}
    </AdminShell>
  );
}
