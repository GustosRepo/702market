import { requireAdmin } from "@/lib/admin-auth";
import { getApplications, type ApplicationArchiveView } from "@/lib/applications";

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
  const applications = await getApplications({
    archive,
    status: ["pending", "approved", "waitlisted", "declined"].includes(status)
      ? (status as "pending" | "approved" | "waitlisted" | "declined")
      : "all",
    eventSlug,
  });

  const header = [
    "Vendor",
    "Contact",
    "Email",
    "Phone",
    "Event",
    "Category",
    "Status",
    "Payment",
    "Fee",
    "Submitted",
  ];
  const rows = applications.map((application) => [
    application.vendorName,
    application.contactName,
    application.email,
    application.phone,
    application.eventTitle,
    application.category,
    application.status,
    application.paymentStatus,
    application.applicationFee,
    application.submittedAt,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => csvCell(cell)).join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="702market-applications.csv"`,
    },
  });
}
