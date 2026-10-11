import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin-shell";
import { getAdminPodcastEpisodeBySlug } from "@/lib/podcast";
import { updatePodcastEpisode } from "../../actions";

type EditPodcastEpisodePageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata = { title: "Edit Podcast Episode | MarketElla" };

export default async function EditPodcastEpisodePage({ params }: EditPodcastEpisodePageProps) {
  const { slug } = await params;
  const episode = await getAdminPodcastEpisodeBySlug(slug);

  if (!episode) notFound();

  return (
    <AdminShell title="Edit Podcast Episode">
      <div className="admin-toolbar">
        <p>Update the episode card, listening link, and visibility.</p>
        <Link className="text-link" href="/admin/podcast">All episodes ↗</Link>
      </div>
      <form className="admin-form" action={updatePodcastEpisode}>
        <input name="originalSlug" type="hidden" value={episode.slug} />
        <fieldset>
          <legend>Episode details</legend>
          <div className="form-grid two-column">
            <label>Episode title<input defaultValue={episode.title} name="title" required /></label>
            <label>Slug<input defaultValue={episode.slug} name="slug" required /></label>
            <label>Episode number<input defaultValue={episode.episodeNumber} min="1" name="episodeNumber" required type="number" /></label>
            <label>Display order<input defaultValue={episode.sortOrder} name="sortOrder" type="number" /></label>
          </div>
          <label>Description<textarea defaultValue={episode.description} name="description" rows={5} /></label>
          <input name="imagePath" type="hidden" value={episode.imagePath} />
          <label>Replace episode image<input accept="image/jpeg,image/png,image/webp,image/gif" name="imageFile" type="file" /></label>
          <label>Listen URL<input defaultValue={episode.listenUrl || ""} name="listenUrl" placeholder="https://" type="url" /></label>
          <label className="checkbox-label"><input defaultChecked={episode.published} name="published" type="checkbox" /> Publish on the podcast page</label>
        </fieldset>
        <button className="button button-accent submit-button" type="submit">Save episode <span aria-hidden="true">↗</span></button>
      </form>
    </AdminShell>
  );
}
