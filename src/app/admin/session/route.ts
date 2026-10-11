import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  await requireAdmin();

  return new Response(null, {
    status: 204,
    headers: {
      "cache-control": "private, no-store, max-age=0",
    },
  });
}
