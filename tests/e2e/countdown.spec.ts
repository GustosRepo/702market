import { test, expect } from "./support/test";
import { openEvent } from "./support/data.mjs";
import { events as fallbackEvents } from "../../src/data/events";
import { countdownUnits, eventTimestamp, getCountdownEvents } from "../../src/lib/event-countdown";

// Visitors in other timezones must still count down to the Las Vegas start.
test.use({ timezoneId: "Asia/Tokyo" });

test("event timing respects daylight saving, ordering, statuses, and overnight markets", () => {
  expect(eventTimestamp("2027-07-10", "16:00:00")).toBe(Date.parse("2027-07-10T23:00:00Z"));
  expect(eventTimestamp("2027-01-10", "16:00")).toBe(Date.parse("2027-01-11T00:00:00Z"));
  expect(eventTimestamp("2027-03-14", "16:00")).toBe(Date.parse("2027-03-14T23:00:00Z"));
  expect(eventTimestamp("2027-11-07", "16:00")).toBe(Date.parse("2027-11-08T00:00:00Z"));
  const market = { ...fallbackEvents[0], date: "2027-07-10", startTime: "20:00", endTime: "02:00" };
  const now = Date.parse("2027-07-10T00:00:00Z");
  const candidates = getCountdownEvents([
    { ...market, slug: "later", date: "2027-07-12" },
    { ...market, slug: "cancelled", status: "cancelled" },
    { ...market, slug: "completed", status: "completed" },
    { ...market, slug: "old", date: "2027-07-01" },
    { ...market, slug: "next" },
  ], now);
  expect(candidates.map((event) => event.slug)).toEqual(["next", "later"]);
  expect(candidates[0].endsAt).toBe(Date.parse("2027-07-11T09:00:00Z"));
  expect(countdownUnits(now - 1000, now).map((unit) => unit.value)).toEqual([0, 0, 0, 0]);
});

test("homepage countdown uses event details, requested colors, and a live timer", async ({ page }, testInfo) => {
  const startsAt = eventTimestamp(openEvent.event_date, openEvent.start_time);
  await page.clock.install({ time: new Date(startsAt - 90_061_000) });
  await page.goto("/");
  await page.clock.runFor(1000);
  const section = page.getByRole("region", { name: "UPCOMING MARKET", exact: true });
  await expect(section.getByRole("link", { name: openEvent.title })).toHaveAttribute("href", `/events/${openEvent.slug}`);
  await expect(section).toContainText(openEvent.location_name);
  await expect(section.locator(".countdown-number")).toHaveText(["01", "01", "01", "00"]);
  await page.clock.runFor(1000);
  await expect(section.locator(".countdown-number")).toHaveText(["01", "01", "00", "59"]);
  await expect(section.locator(".countdown-box")).toHaveCSS("background-color", "rgb(253, 208, 204)");
  await expect(section.getByRole("timer")).toHaveCSS("color", "rgb(252, 87, 79)");
  await expect(page.getByText("we heard the 702 needed", { exact: false })).toHaveCount(0);
  const bounds = await section.locator(".countdown-box").boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  await section.screenshot({ path: testInfo.outputPath("countdown.png") });
});

test("countdown reaches zero and shows the empty state after the event ends", async ({ page }) => {
  const startsAt = eventTimestamp(openEvent.event_date, openEvent.start_time);
  const endsAt = eventTimestamp(openEvent.event_date, openEvent.end_time);
  await page.clock.install({ time: new Date(startsAt - 1000) });
  await page.goto("/");
  await page.clock.runFor(1000);
  const section = page.getByRole("region", { name: "UPCOMING MARKET", exact: true });
  await expect(section.locator(".countdown-number")).toHaveText(["00", "00", "00", "00"]);
  await expect(section.getByRole("status")).toHaveText("It's market time!");
  await page.clock.fastForward(endsAt - startsAt + 1000);
  await expect(section.getByRole("status")).toHaveText("More market dates coming soon. Stay tuned!");
  await expect(section.getByRole("timer")).toHaveCount(0);
});
