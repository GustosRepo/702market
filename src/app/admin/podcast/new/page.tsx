import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { createPodcastEpisode } from "../actions";

export const metadata = { title: "New Podcast Episode | MarketElla" };

export default function NewPodcastEpisodePage() {
  return (
    <AdminShell title="Add Podcast Episode">
      <div className="admin-toolbar">
        <p>Create an episode card and choose when it should appear publicly.</p>
        <Link className="text-link" href="/admin/podcast">All episodes ↗</Link>
      </div>
      <form className="admin-form" action={createPodcastEpisode}>
        <fieldset>
          <legend>Episode details</legend>
          <div className="form-grid two-column">
            <label>Episode title<input name="title" required /></label>
            <label>Slug<input name="slug" placeholder="auto-generated if blank" /></label>
            <label>Episode number<input min="1" name="episodeNumber" required type="number" /></label>
            <label>Display order<input defaultValue="0" name="sortOrder" type="number" /></label>
          </div>
          <label>Description<textarea name="description" rows={5} /></label>
          <label>Episode image<input accept="image/jpeg,image/png,image/webp,image/gif" name="imageFile" type="file" /></label>
          <label>Listen URL<input name="listenUrl" placeholder="https://" type="url" /></label>
          <label className="checkbox-label"><input defaultChecked name="published" type="checkbox" /> Publish on the podcast page</label>
        </fieldset>
        <button className="button button-accent submit-button" type="submit">Add episode <span aria-hidden="true">↗</span></button>
      </form>
    </AdminShell>
  );
}
