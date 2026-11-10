import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { getAdminHomepageContent } from "@/lib/admin-homepage-content";
import { updateHomepageContent } from "./actions";

export const metadata = { title: "Homepage | MarketElla Admin" };

export default async function AdminHomepagePage() {
  const { countdown } = await getAdminHomepageContent();

  return (
    <AdminShell title="Homepage">
      <div className="admin-toolbar">
        <p>The countdown automatically uses your next published, upcoming event. Update its date, start time, and location in <Link href="/admin/events">Events</Link>. Times use Las Vegas time.</p>
      </div>

      <form className="admin-form" action={updateHomepageContent}>
        <section className="admin-group">
          <div className="admin-group-heading">
            <h2>Next event countdown</h2>
            <span>Homepage section</span>
          </div>

          <label className="checkbox-label">
            <input name="countdown:active" type="checkbox" defaultChecked={countdown.active} />
            Show this section on the homepage
          </label>

          <label>
            Countdown heading
            <input name="countdown:heading" defaultValue={countdown.heading} maxLength={160} />
          </label>

          <label>
            Message when no events are scheduled
            <textarea name="countdown:emptyMessage" defaultValue={countdown.emptyMessage} rows={3} maxLength={500} />
          </label>
        </section>

        <button className="button button-accent submit-button" type="submit">
          Save homepage <span aria-hidden="true">↗</span>
        </button>
      </form>
    </AdminShell>
  );
}
