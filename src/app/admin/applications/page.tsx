import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import {
  getApplications,
  getApplicationStats,
  type AdminApplication,
  type ApplicationArchiveView,
} from "@/lib/applications";
import { archiveApplication, restoreApplication } from "./actions";

export const metadata = { title: "Applications | Marketella" };

type AdminApplicationsPageProps = {
  searchParams: Promise<{
    archive?: string;
    event?: string;
    group?: string;
    status?: string;
  }>;
};

type GroupMode = "date" | "event" | "status";
type StatusFilter = "all" | "pending" | "approved" | "waitlisted" | "declined";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function cleanArchive(value?: string): ApplicationArchiveView {
  return value === "archived" || value === "all" ? value : "active";
}

function cleanGroup(value?: string): GroupMode {
  return value === "event" || value === "status" ? value : "date";
}

function cleanStatus(value?: string): StatusFilter {
  switch (value) {
    case "pending":
    case "approved":
    case "waitlisted":
    case "declined":
      return value;
    default:
      return "all";
  }
}

function makeHref(params: {
  archive: ApplicationArchiveView;
  eventSlug?: string;
  group: GroupMode;
  status: StatusFilter;
}) {
  const query = new URLSearchParams();

  if (params.archive !== "active") {
    query.set("archive", params.archive);
  }

  if (params.eventSlug) {
    query.set("event", params.eventSlug);
  }

  if (params.group !== "date") {
    query.set("group", params.group);
  }

  if (params.status !== "all") {
    query.set("status", params.status);
  }

  const value = query.toString();
  return value ? `/admin/applications?${value}` : "/admin/applications";
}

function groupApplications(
  applications: AdminApplication[],
  group: GroupMode,
) {
  return applications.reduce<Record<string, AdminApplication[]>>(
    (groups, application) => {
      const label =
        group === "event"
          ? application.eventTitle
          : group === "status"
            ? application.status
            : application.submittedMonth;

      groups[label] = groups[label] || [];
      groups[label].push(application);
      return groups;
    },
    {},
  );
}

function ApplicationRows({
  applications,
  archive,
}: {
  applications: AdminApplication[];
  archive: ApplicationArchiveView;
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Vendor</th>
          <th>Event</th>
          <th>Category</th>
          <th>Status</th>
          <th>Payment</th>
          <th>Submitted</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {applications.map((application) => (
          <tr key={application.id}>
            <td><strong>{application.vendorName}</strong><small>{application.contactName} · {application.email}</small></td>
            <td>{application.eventSlug ? <Link href={`/events/${application.eventSlug}`}>{application.eventTitle}</Link> : application.eventTitle}</td>
            <td>{application.category}<small>{application.boothType} booth</small></td>
            <td><span className={`status-pill status-${application.status}`}>{application.status}</span></td>
            <td>{formatMoney(application.applicationFee)}<small>{application.paymentStatus}</small></td>
            <td>{application.submittedAt}</td>
            <td>
              <Link className="text-button" href={`/admin/applications/${application.id}`}>Review</Link>
              <form action={archive === "archived" ? restoreApplication : archiveApplication}>
                <input name="id" type="hidden" value={application.id} />
                <button className="text-button" type="submit">
                  {archive === "archived" ? "Restore" : "Archive"}
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function AdminApplicationsPage({
  searchParams,
}: AdminApplicationsPageProps) {
  const params = await searchParams;
  const archive = cleanArchive(params.archive);
  const group = cleanGroup(params.group);
  const status = cleanStatus(params.status);
  const eventSlug = params.event;
  const [applications, stats] = await Promise.all([
    getApplications({ archive, eventSlug, status }),
    getApplicationStats({ archive, eventSlug }),
  ]);
  const groupedApplications = groupApplications(applications, group);
  const groupEntries = Object.entries(groupedApplications);
  const exportHref = makeHref({ archive, eventSlug, group, status }).replace(
    "/admin/applications",
    "/admin/applications/export",
  );

  return <AdminShell title="Applications">
    <div className="admin-toolbar"><p>Review vendors, payment status, and application details.</p><a className="button button-dark" href={exportHref}>Export CSV ↓</a></div>
    <section className="admin-filter-row" aria-label="Application archive filters">
      {(["active", "archived", "all"] as const).map((value) => (
        <Link className={archive === value ? "filter-active" : ""} href={makeHref({ archive: value, eventSlug, group, status })} key={value}>{value}</Link>
      ))}
    </section>
    <section className="admin-filter-row" aria-label="Application status filters">
      {([
        ["all", stats.total],
        ["pending", stats.pending],
        ["approved", stats.approved],
        ["waitlisted", stats.waitlisted],
        ["declined", stats.declined],
      ] as const).map(([value, count]) => (
        <Link className={status === value ? "filter-active" : ""} href={makeHref({ archive, eventSlug, group, status: value })} key={value}>{value} <span>{count}</span></Link>
      ))}
    </section>
    <section className="admin-filter-row" aria-label="Application grouping">
      {(["date", "event", "status"] as const).map((value) => (
        <Link className={group === value ? "filter-active" : ""} href={makeHref({ archive, eventSlug, group: value, status })} key={value}>Group by {value}</Link>
      ))}
      {eventSlug ? <Link href={makeHref({ archive, group, status })}>Clear event filter</Link> : null}
    </section>
    {applications.length > 0 ? (
      groupEntries.map(([label, groupApplications]) => (
        <section className="admin-group" key={label}>
          <div className="admin-group-heading">
            <h2>{label}</h2>
            <span>{groupApplications.length}</span>
          </div>
          <div className="admin-table-wrap">
            <ApplicationRows applications={groupApplications} archive={archive} />
          </div>
        </section>
      ))
    ) : (
      <section className="admin-empty-panel compact"><p className="eyebrow">No applications yet</p><h2>The table is<br /><em>waiting for vendors.</em></h2><p>Run the fake seed SQL or submit the public form to populate this page.</p><Link className="button button-accent" href="/apply">Preview application form ↗</Link></section>
    )}
  </AdminShell>;
}
