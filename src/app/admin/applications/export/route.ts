import { requireAdmin } from "@/lib/admin-auth";
import {
  getApplications,
  type ApplicationArchiveView,
  type ApplicationStatus,
} from "@/lib/applications";

function cleanArchive(value: string | null): ApplicationArchiveView {
  return value === "archived" || value === "all" ? value : "active";
}

function csvCell(value: string | number | null | undefined) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  await requireAdmin();

  const url = new URL(request.url);
  const archive = cleanArchive(url.searchParams.get("archive"));
  const status = url.searchParams.get("status") || "all";
  const eventSlug = url.searchParams.get("event") || undefined;
  const applicationType = url.searchParams.get("type");
  const paymentStatus = url.searchParams.get("payment");
  const statuses: ApplicationStatus[] = [
    "submitted",
    "under_review",
    "approved",
    "waitlisted",
    "rejected",
    "confirmed",
    "pending",
    "declined",
  ];
  const applications = await getApplications({
    archive,
    status: statuses.includes(status as ApplicationStatus)
      ? (status as ApplicationStatus)
      : "all",
    eventSlug,
    applicationType:
      applicationType === "vendor" || applicationType === "food"
        ? applicationType
        : "all",
    paymentStatus:
      paymentStatus === "paid" || paymentStatus === "unpaid"
        ? paymentStatus
        : "all",
  });

  const header = [
    "Vendor",
    "Contact",
    "Email",
    "Phone",
    "Event",
    "Application type",
    "Vendor option",
    "Category",
    "Status",
    "Payment",
    "Fee",
    "Submitted",
    "Reference",
  ];
  const rows = applications.map((application) => [
    application.vendorName,
    application.contactName,
    application.email,
    application.phone,
    application.eventTitle,
    application.applicationType,
    application.vendorOptionName,
    application.category,
    application.status,
    application.paymentStatus,
    application.applicationFee,
    application.submittedAt,
    application.referenceCode,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => csvCell(cell)).join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "cache-control": "private, no-store, max-age=0",
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="marketella-applications.csv"`,
      "x-content-type-options": "nosniff",
    },
  });
}
