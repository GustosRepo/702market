import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin-shell";
import { getApplicationById } from "@/lib/applications";
import { updateApplicationReview } from "../actions";

type ApplicationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = { title: "Application Detail | MarketElla" };

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
        <p>{application.eventTitle} · {application.applicationType === "food" ? "Food vendor" : "General vendor"} · {application.submittedAt}</p>
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
          <p className="eyebrow">{application.applicationType === "food" ? "Menu and setup" : "Products"}</p>
          <h2>{application.vendorOptionName}</h2>
          <p>{application.foodMenu || application.productDescription}</p>
          {application.priceRange ? <p>{application.priceRange}</p> : null}
          {application.setupMeasurements ? <p>Measurements: {application.setupMeasurements}</p> : null}
          {application.businessLicenseNumber ? <p>Business license: {application.businessLicenseNumber}</p> : null}
          {application.healthDepartmentNumber ? <p>Health department: {application.healthDepartmentNumber}</p> : null}
        </div>
      </section>

      <section className="admin-application-reference">
        <div><span>Reference</span><strong>{application.referenceCode || application.id}</strong></div>
        <div><span>Rules</span><strong>{application.rulesAcknowledged ? "Acknowledged" : "Not recorded"}</strong></div>
      </section>

      <section className="admin-group">
        <div className="admin-group-heading"><h2>Private uploads</h2><span>{application.uploads.length}</span></div>
        {application.uploads.length ? (
          <div className="admin-upload-list">
            {application.uploads.map((upload) => (
              <a href={upload.signedUrl || "#"} key={upload.id} rel="noreferrer" target="_blank">
                <strong>{upload.documentType.replaceAll("_", " ")}</strong>
                <span>{upload.originalName}</span>
                <small>{upload.sizeBytes ? `${(upload.sizeBytes / 1024 / 1024).toFixed(1)} MB` : "Open file"} ↗</small>
              </a>
            ))}
          </div>
        ) : <p>No uploads are attached to this application.</p>}
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
                <option value="submitted">Submitted</option>
                <option value="under_review">Under review</option>
                <option value="approved">Approved</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="rejected">Rejected</option>
                <option value="confirmed">Confirmed</option>
                {application.status === "pending" ? <option value="pending">Pending (legacy)</option> : null}
                {application.status === "declined" ? <option value="declined">Declined (legacy)</option> : null}
              </select>
            </label>
            <label>Payment
              <select name="paymentStatus" defaultValue={application.paymentStatus}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
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
