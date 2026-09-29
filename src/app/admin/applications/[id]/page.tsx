import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin-shell";
import { getApplicationById } from "@/lib/applications";
import { updateApplicationReview } from "../actions";

type ApplicationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = { title: "Application Detail | Marketella" };

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params;
  const application = await getApplicationById(id);

  if (!application) {
    notFound();
  }

  return (
    <AdminShell title={application.vendorName}>
      <div className="admin-toolbar">
        <p>{application.eventTitle} · {application.submittedAt}</p>
        <Link className="text-link" href="/admin/applications">All applications ↗</Link>
      </div>

      <section className="admin-detail-grid">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>{application.contactName}</h2>
          <p>{application.email}<br />{application.phone}</p>
          {application.instagram ? <p>{application.instagram}</p> : null}
          {application.website ? <a className="text-link" href={application.website} target="_blank" rel="noreferrer">Website ↗</a> : null}
        </div>
        <div>
          <p className="eyebrow">Products</p>
          <h2>{application.category}</h2>
          <p>{application.productDescription}</p>
          <p>{application.priceRange} · {application.boothType} booth</p>
          <p>{application.electricityRequired ? "Needs electricity" : "No electricity needed"}</p>
        </div>
      </section>

      {application.specialRequests ? (
        <section className="admin-empty-panel compact">
          <p className="eyebrow">Special requests</p>
          <p>{application.specialRequests}</p>
        </section>
      ) : null}

      <form className="admin-form" action={updateApplicationReview}>
        <input name="id" type="hidden" value={application.id} />
        <fieldset>
          <legend>Review</legend>
          <div className="form-grid two-column">
            <label>Status
              <select name="status" defaultValue={application.status}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="declined">Declined</option>
              </select>
            </label>
            <label>Payment
              <select name="paymentStatus" defaultValue={application.paymentStatus}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="waived">Waived</option>
                <option value="refunded">Refunded</option>
              </select>
            </label>
            <label>Fee<input name="applicationFee" value={formatMoney(application.applicationFee)} readOnly /></label>
            <label>Payment reference<input name="paymentReference" defaultValue={application.paymentReference || ""} /></label>
          </div>
          <label>Paid date/time<input name="paidAt" type="datetime-local" defaultValue={formatDateTimeLocal(application.paidAt)} /></label>
          <label>Internal notes<textarea name="adminNotes" rows={6} defaultValue={application.adminNotes || ""} /></label>
        </fieldset>
        <button className="button button-accent submit-button" type="submit">
          Save review <span aria-hidden="true">↗</span>
        </button>
      </form>
    </AdminShell>
  );
}
