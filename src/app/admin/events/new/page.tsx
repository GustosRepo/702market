import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { createEvent } from "./actions";
import EventVendorOptionsEditor from "../EventVendorOptionsEditor";

export const metadata = { title: "New Event | MarketElla" };

export default function NewEventPage() {
  return (
    <AdminShell title="New Event">
      <div className="admin-toolbar">
        <p>Create a market and decide whether it should be public yet.</p>
        <Link className="text-link" href="/admin/events">All events ↗</Link>
      </div>
      <form className="admin-form" action={createEvent}>
        <fieldset>
          <legend>Event details</legend>
          <div className="form-grid two-column">
            <label>Title<input name="title" required /></label>
            <label>Slug<input name="slug" placeholder="auto-generated if blank" /></label>
          </div>
          <label>Description<textarea name="description" rows={5} required /></label>
          <label>Event hero image<input accept="image/jpeg,image/png,image/webp,image/gif" name="heroImageFile" type="file" /></label>
          <div className="form-grid two-column">
            <label>Date<input name="eventDate" type="date" required /></label>
            <label>Location name<input name="locationName" required /></label>
            <label>Start time<input name="startTime" type="time" required /></label>
            <label>End time<input name="endTime" type="time" required /></label>
          </div>
          <label>Address<input name="address" required /></label>
        </fieldset>

        <fieldset>
          <legend>Applications</legend>
          <div className="form-grid two-column">
            <label>Open date<input name="applicationOpenDate" type="date" /></label>
            <label>Deadline<input name="applicationDeadline" type="date" /></label>
            <label>Vendor capacity<input min="1" name="vendorCapacity" type="number" /></label>
          </div>
          <label>Status
            <select name="status" defaultValue="upcoming">
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="checkbox-label"><input name="generalApplicationsEnabled" type="checkbox" defaultChecked /> General vendor applications open</label>
          <label>General vendor note shown before continuing<textarea name="applicationNotes" rows={4} placeholder="What should general vendors know or prepare before starting?" /></label>
          <label>General vendor rules<textarea name="applicationRules" rows={6} /></label>
          <EventVendorOptionsEditor applicationType="vendor" />
          <label className="checkbox-label"><input name="foodApplicationsEnabled" type="checkbox" /> Food vendor applications open</label>
          <label>Food vendor note shown before continuing<textarea name="foodApplicationNotes" rows={4} placeholder="What should food vendors know or prepare before starting?" /></label>
          <label>Food vendor rules<textarea name="foodApplicationRules" rows={6} /></label>
          <EventVendorOptionsEditor applicationType="food" />
          <label className="checkbox-label"><input name="published" type="checkbox" defaultChecked /> Publish on the public site</label>
        </fieldset>

        <button className="button button-accent submit-button" type="submit">
          Create event <span aria-hidden="true">↗</span>
        </button>
      </form>
    </AdminShell>
  );
}
