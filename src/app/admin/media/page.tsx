import AdminShell from "@/components/admin-shell";
import { getAdminSiteMedia } from "@/lib/admin-site-media";
import { updateSiteMedia } from "./actions";

export const metadata = { title: "Media | MarketElla Admin" };

export default async function AdminMediaPage() {
  const mediaSlots = await getAdminSiteMedia();
  const groups = mediaSlots.reduce<Record<string, typeof mediaSlots>>(
    (collection, slot) => {
      collection[slot.group] = collection[slot.group] || [];
      collection[slot.group].push(slot);
      return collection;
    },
    {},
  );

  return (
    <AdminShell title="Media">
      <div className="admin-toolbar">
        <p>Upload and swap the photos used across the public site. Homepage carousel photos appear below the countdown and open in a full-size viewer when clicked.</p>
      </div>

      <form className="admin-form admin-media-form" action={updateSiteMedia}>
        {Object.entries(groups).map(([group, slots]) => (
          <section className="admin-group" key={group}>
            <div className="admin-group-heading">
              <h2>{group}</h2>
              <span>{slots.length} slot{slots.length === 1 ? "" : "s"}</span>
            </div>
            {group === "Homepage carousel" ? (
              <div>
                <label>
                  Add carousel photos
                  <input name="homeGalleryFiles" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple aria-describedby="carousel-upload-help" />
                </label>
                <p id="carousel-upload-help">Select one or more photos, then save. Up to 10MB per photo and 40MB total per save. Edit their descriptions, captions, and display order below after saving. Uncheck Active to hide a photo.</p>
              </div>
            ) : null}
            <div className="admin-media-list">
              {[...slots].sort((a, b) => a.sortOrder - b.sortOrder || a.slot.localeCompare(b.slot)).map((slot) => (
                <article className="admin-media-card" key={slot.slot}>
                  <div
                    className="admin-media-preview"
                    style={{ "--asset-image": `url(${slot.storagePath})` } as React.CSSProperties}
                    aria-hidden="true"
                  />
                  <div className="admin-media-fields">
                    <p className="eyebrow">{slot.slot}</p>
                    <h3>{slot.label}</h3>
                    <label>
                      Upload picture
                      <input
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        name={`${slot.slot}:file`}
                        type="file"
                      />
                    </label>
                    <input
                      name={`${slot.slot}:storagePath`}
                      type="hidden"
                      value={slot.storagePath}
                    />
                    <label>
                      Alt text
                      <input
                        name={`${slot.slot}:altText`}
                        defaultValue={slot.altText}
                      />
                    </label>
                    <label>
                      Caption
                      <input
                        name={`${slot.slot}:caption`}
                        defaultValue={slot.caption}
                      />
                    </label>
                    <label className="checkbox-label">
                      <input
                        name={`${slot.slot}:active`}
                        type="checkbox"
                        defaultChecked={slot.active}
                      />
                      Active
                    </label>
                    {slot.slot.startsWith("home.gallery.") ? (
                      <label>
                        Display order
                        <input name={`${slot.slot}:sortOrder`} type="number" min={0} max={1000000} step={1} defaultValue={slot.sortOrder} />
                      </label>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <button className="button button-accent submit-button" type="submit">
          Save media <span aria-hidden="true">↗</span>
        </button>
      </form>
    </AdminShell>
  );
}
