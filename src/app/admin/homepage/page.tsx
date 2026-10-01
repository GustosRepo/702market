import AdminShell from "@/components/admin-shell";
import { getAdminHomepageContent } from "@/lib/admin-homepage-content";
import { updateHomepageContent } from "./actions";

export const metadata = { title: "Homepage | Marketella Admin" };

export default async function AdminHomepagePage() {
  const { newLocation } = await getAdminHomepageContent();

  return (
    <AdminShell title="Homepage">
      <div className="admin-toolbar">
        <p>Edit homepage section content without changing the site design.</p>
      </div>

      <form className="admin-form" action={updateHomepageContent}>
        <section className="admin-group">
          <div className="admin-group-heading">
            <h2>New location</h2>
            <span>Homepage section</span>
          </div>

          <label className="checkbox-label">
            <input
              name="newLocation:active"
              type="checkbox"
              defaultChecked={newLocation.active}
            />
            Show this section on the homepage
          </label>

          <label>
            Top rotating text
            <input
              name="newLocation:topMarqueePhrases"
              defaultValue={newLocation.topMarqueePhrases.join(" | ")}
            />
          </label>

          <label>
            Heading label
            <input
              name="newLocation:headingLabel"
              defaultValue={newLocation.headingLabel}
            />
          </label>

          <label>
            Location name
            <input
              name="newLocation:locationName"
              defaultValue={newLocation.locationName}
            />
          </label>

          <label>
            Description
            <textarea
              name="newLocation:description"
              defaultValue={newLocation.description}
              rows={4}
            />
          </label>

          <label>
            Button label
            <input
              name="newLocation:buttonLabel"
              defaultValue={newLocation.buttonLabel}
            />
          </label>

          <label>
            Button link
            <input
              name="newLocation:buttonHref"
              defaultValue={newLocation.buttonHref}
            />
          </label>

          <label>
            Bottom rotating text
            <input
              name="newLocation:bottomMarqueePhrases"
              defaultValue={newLocation.bottomMarqueePhrases.join(" | ")}
            />
          </label>
        </section>

        <button className="button button-accent submit-button" type="submit">
          Save homepage <span aria-hidden="true">↗</span>
        </button>
      </form>
    </AdminShell>
  );
}
