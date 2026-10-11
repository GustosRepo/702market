import { getIcsCalendar } from "@/lib/event-calendar";
import { getEventBySlug } from "@/lib/events";

export async function GET(
  _request: Request,
  context: RouteContext<"/events/[slug]/calendar.ics">,
) {
  const { slug } = await context.params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  return new Response(getIcsCalendar(event), {
    headers: {
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
      "Content-Type": "text/calendar; charset=utf-8",
    },
  });
}
