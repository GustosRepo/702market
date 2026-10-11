import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin-shell";
import { getAdminEventBySlug } from "@/lib/admin-events";
import { updateEvent } from "../../actions";
import EventVendorOptionsEditor from "../../EventVendorOptionsEditor";

type EditEventPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata = { title: "Edit Event | MarketElla" };

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { slug } = await params;
  const event = await getAdminEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <AdminShell title="Edit Event">
      <div className="admin-toolbar">
        <p>Update market details, public visibility, and application settings.</p>
        <Link className="text-link" href="/admin/events">All events ↗</Link>
      </div>
      <form className="admin-form" action={updateEvent}>
        <input name="originalSlug" type="hidden" value={event.slug} />
        <fieldset>
          <legend>Event details</legend>
          <div className="form-grid two-column">
            <label>Title<input name="title" defaultValue={event.title} required /></label>
            <label>Slug<input name="slug" defaultValue={event.slug} required /></label>
          </div>
          <label>Description<textarea name="description" rows={5} defaultValue={event.description} required /></label>
          <input name="heroImage" type="hidden" value={event.heroImage} />
          <label>Replace event hero image<input accept="image/jpeg,image/png,image/webp,image/gif" name="heroImageFile" type="file" /></label>
          <div className="form-grid two-column">
            <label>Date<input name="eventDate" type="date" defaultValue={event.date} required /></label>
            <label>Location name<input name="locationName" defaultValue={event.location} required /></label>
            <label>Start time<input name="startTime" type="time" defaultValue={event.startTime} required /></label>
            <label>End time<input name="endTime" type="time" defaultValue={event.endTime} required /></label>
          </div>
          <label>Address<input name="address" defaultValue={event.address} required /></label>
        </fieldset>

        <fieldset>
          <legend>Applications</legend>
          <div className="form-grid two-column">
            <label>Open date<input name="applicationOpenDate" type="date" defaultValue={event.applicationOpenDate || ""} /></label>
            <label>Deadline<input name="applicationDeadline" type="date" defaultValue={event.applicationDeadline || ""} /></label>
            <label>Vendor capacity<input min="1" name="vendorCapacity" type="number" defaultValue={event.vendorCapacity || ""} /></label>
          </div>
          <label>Status
            <select name="status" defaultValue={event.status}>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="checkbox-label"><input name="generalApplicationsEnabled" type="checkbox" defaultChecked={event.generalApplicationsEnabled} /> General vendor applications open</label>
          <label>General vendor note shown before continuing<textarea name="applicationNotes" rows={4} defaultValue={event.applicationNotes} placeholder="What should general vendors know or prepare before starting?" /></label>
          <label>General vendor rules<textarea name="applicationRules" rows={6} defaultValue={event.applicationRules} /></label>
          <EventVendorOptionsEditor applicationType="vendor" initialOptions={event.vendorOptions.filter((option) => option.applicationType === "vendor")} />
          <label className="checkbox-label"><input name="foodApplicationsEnabled" type="checkbox" defaultChecked={event.foodApplicationsEnabled} /> Food vendor applications open</label>
          <label>Food vendor note shown before continuing<textarea name="foodApplicationNotes" rows={4} defaultValue={event.foodApplicationNotes} placeholder="What should food vendors know or prepare before starting?" /></label>
          <label>Food vendor rules<textarea name="foodApplicationRules" rows={6} defaultValue={event.foodApplicationRules} /></label>
          <EventVendorOptionsEditor applicationType="food" initialOptions={event.vendorOptions.filter((option) => option.applicationType === "food")} />
          <label className="checkbox-label"><input name="published" type="checkbox" defaultChecked={event.published} /> Publish on the public site</label>
        </fieldset>

        <button className="button button-accent submit-button" type="submit">
          Save event <span aria-hidden="true">↗</span>
        </button>
      </form>
    </AdminShell>
  );
}
