import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { AdminConfirmAction } from "@/components/admin-confirm-action";
import { getAdminEvents } from "@/lib/admin-events";
import {
  getApplications,
  getApplicationStats,
  type AdminApplication,
  type ApplicationArchiveView,
  type ApplicationStatus,
} from "@/lib/applications";
import { archiveApplication, restoreApplication } from "./actions";

export const metadata = { title: "Applications | MarketElla" };

type AdminApplicationsPageProps = {
  searchParams: Promise<{ archive?: string; event?: string; group?: string; status?: string; type?: string; payment?: string }>;
};

type GroupMode = "date" | "event" | "status";
type StatusFilter = ApplicationStatus | "all";
type TypeFilter = "vendor" | "food" | "all";
type PaymentFilter = "unpaid" | "paid" | "all";

const statusValues: StatusFilter[] = ["all", "submitted", "under_review", "approved", "waitlisted", "rejected", "confirmed"];

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function cleanArchive(value?: string): ApplicationArchiveView {
  return value === "archived" || value === "all" ? value : "active";
}

function cleanGroup(value?: string): GroupMode {
  return value === "event" || value === "status" ? value : "date";
}

function cleanStatus(value?: string): StatusFilter {
  const supported: StatusFilter[] = [...statusValues, "pending", "declined"];
  return supported.includes(value as StatusFilter) ? (value as StatusFilter) : "all";
}

function cleanType(value?: string): TypeFilter {
  return value === "vendor" || value === "food" ? value : "all";
}

function cleanPayment(value?: string): PaymentFilter {
  return value === "paid" || value === "unpaid" ? value : "all";
}

function makeHref(params: {
  archive: ApplicationArchiveView;
  eventSlug?: string;
  group: GroupMode;
  status: StatusFilter;
  applicationType: TypeFilter;
  paymentStatus: PaymentFilter;
}) {
  const query = new URLSearchParams();
  if (params.archive !== "active") query.set("archive", params.archive);
  if (params.eventSlug && params.eventSlug !== "all") query.set("event", params.eventSlug);
  if (params.group !== "date") query.set("group", params.group);
  if (params.status !== "all") query.set("status", params.status);
  if (params.applicationType !== "all") query.set("type", params.applicationType);
  if (params.paymentStatus !== "all") query.set("payment", params.paymentStatus);
  const value = query.toString();
  return value ? `/admin/applications?${value}` : "/admin/applications";
}

function groupApplications(applications: AdminApplication[], group: GroupMode) {
  return applications.reduce<Record<string, AdminApplication[]>>((groups, application) => {
    const label = group === "event"
      ? application.eventTitle
      : group === "status"
        ? application.status.replaceAll("_", " ")
        : application.submittedMonth;
    groups[label] = groups[label] || [];
    groups[label].push(application);
    return groups;
  }, {});
}

function ApplicationRows({ applications, archive }: { applications: AdminApplication[]; archive: ApplicationArchiveView }) {
  return (
    <table>
      <thead><tr><th>Business</th><th>Applicant</th><th>Event</th><th>Type / option</th><th>Status</th><th>Payment</th><th>Submitted</th><th /></tr></thead>
      <tbody>
        {applications.map((application) => (
          <tr key={application.id}>
            <td><strong>{application.vendorName}</strong><small>{application.referenceCode || application.id.slice(0, 8)}</small></td>
            <td>{application.contactName}<small>{application.email}</small></td>
            <td>{application.eventSlug ? <Link href={`/events/${application.eventSlug}`}>{application.eventTitle}</Link> : application.eventTitle}</td>
            <td>{application.applicationType === "food" ? "Food vendor" : "General vendor"}<small>{application.vendorOptionName}</small></td>
            <td><span className={`status-pill status-${application.status}`}>{application.status.replaceAll("_", " ")}</span></td>
            <td>{formatMoney(application.applicationFee)}<small>{application.paymentStatus}</small></td>
            <td>{application.submittedAt}</td>
            <td>
              <Link className="text-button" href={`/admin/applications/${application.id}`}>Review</Link>
              {archive === "archived" ? (
                <form action={restoreApplication}><input name="id" type="hidden" value={application.id} /><button className="text-button" type="submit">Restore</button></form>
              ) : (
                <AdminConfirmAction
                  action={archiveApplication}
                  confirmLabel="Archive application"
                  fields={{ id: application.id }}
                  message={`Archive the application from “${application.vendorName}”? The record and private uploads will be preserved.`}
                  title="Archive this application?"
                  tone="danger"
                  triggerLabel="Archive"
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function AdminApplicationsPage({ searchParams }: AdminApplicationsPageProps) {
  const params = await searchParams;
  const archive = cleanArchive(params.archive);
  const group = cleanGroup(params.group);
  const status = cleanStatus(params.status);
  const applicationType = cleanType(params.type);
  const paymentStatus = cleanPayment(params.payment);
  const eventSlug = params.event;
  const query = { archive, eventSlug, status, applicationType, paymentStatus };
  const [applications, stats, events] = await Promise.all([
    getApplications(query),
    getApplicationStats({ archive, eventSlug, applicationType, paymentStatus }),
    getAdminEvents("active"),
  ]);
  const groupedApplications = groupApplications(applications, group);
  const exportHref = makeHref({ archive, eventSlug, group, status, applicationType, paymentStatus }).replace("/admin/applications", "/admin/applications/export");

  return (
    <AdminShell title="Applications">
      <div className="admin-toolbar"><p>Review vendors, private documents, status, and payments.</p><a className="button button-dark" href={exportHref}>Export CSV ↓</a></div>
      <section className="admin-filter-row" aria-label="Application archive filters">
        {(["active", "archived", "all"] as const).map((value) => (
          <Link className={archive === value ? "filter-active" : ""} href={makeHref({ archive: value, eventSlug, group, status, applicationType, paymentStatus })} key={value}>{value}</Link>
        ))}
      </section>
      <form action="/admin/applications" className="admin-application-filters" method="get">
        {archive !== "active" ? <input name="archive" type="hidden" value={archive} /> : null}
        {group !== "date" ? <input name="group" type="hidden" value={group} /> : null}
        <label>Event<select defaultValue={eventSlug || "all"} name="event"><option value="all">All events</option>{events.map((event) => <option key={event.slug} value={event.slug}>{event.title}</option>)}</select></label>
        <label>Application<select defaultValue={applicationType} name="type"><option value="all">All types</option><option value="vendor">General vendor</option><option value="food">Food vendor</option></select></label>
        <label>Status<select defaultValue={status} name="status">{statusValues.map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select></label>
        <label>Payment<select defaultValue={paymentStatus} name="payment"><option value="all">All payments</option><option value="unpaid">Unpaid</option><option value="paid">Paid</option></select></label>
        <button className="button button-accent" type="submit">Filter</button>
      </form>
      <section className="admin-filter-row" aria-label="Application grouping">
        {(["date", "event", "status"] as const).map((value) => (
          <Link className={group === value ? "filter-active" : ""} href={makeHref({ archive, eventSlug, group: value, status, applicationType, paymentStatus })} key={value}>Group by {value}</Link>
        ))}
        <span>{stats.total} result{stats.total === 1 ? "" : "s"}</span>
      </section>
      {applications.length ? Object.entries(groupedApplications).map(([label, grouped]) => (
        <section className="admin-group" key={label}>
          <div className="admin-group-heading"><h2>{label}</h2><span>{grouped.length}</span></div>
          <div className="admin-table-wrap"><ApplicationRows applications={grouped} archive={archive} /></div>
        </section>
      )) : (
        <section className="admin-empty-panel compact"><p className="eyebrow">No matching applications</p><h2>The review queue<br /><em>is clear.</em></h2><p>Change the filters or submit a public application to test the flow.</p><Link className="button button-accent" href="/apply">Preview application flow ↗</Link></section>
      )}
    </AdminShell>
  );
}
