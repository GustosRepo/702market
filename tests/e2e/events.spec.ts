import { test, expect } from "./support/test";
import { openEvent, closedEvent, pastEvent } from "./support/data.mjs";

test("calendar leads to event details and both application types", async ({ page }) => {
  await page.goto("/events");
  await expect(page.getByRole("heading", { name: pastEvent.title })).toHaveCount(0);
  const event = page.getByRole("article").filter({ hasText: openEvent.title });
  await expect(event).toContainText(openEvent.description);
  const calendarURL = new URL((await event.getByRole("link", { name: "Google Calendar", exact: true }).getAttribute("href"))!);
  expect(calendarURL.searchParams.get("text")).toBe(openEvent.title);
  expect(calendarURL.searchParams.get("ctz")).toBe("America/Los_Angeles");
  await expect(event.getByRole("link", { name: "Map", exact: true })).toHaveAttribute("href", /google\.com\/maps/);

  const downloadPromise = page.waitForEvent("download");
  await event.getByRole("link", { name: "ICS", exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(`${openEvent.slug}.ics`);
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const calendar = Buffer.concat(chunks).toString();
  expect(calendar).toContain("BEGIN:VCALENDAR");
  expect(calendar).toContain(`SUMMARY:${openEvent.title}`);
  expect(calendar).toContain(`DTSTART;TZID=America/Los_Angeles:${openEvent.event_date.replaceAll("-", "")}T160000`);

  await event.getByRole("link", { name: /View event/ }).click();
  await expect(page).toHaveURL(`/events/${openEvent.slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(openEvent.title);
  await expect(page.getByRole("heading", { name: "Open now", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Apply as vendor", exact: true }).click();
  await expect(page).toHaveURL(`/events/${openEvent.slug}/apply/vendor`);
  await expect(page.getByRole("group", { name: "Your application", exact: true })).toBeVisible();

  await page.goto(`/events/${openEvent.slug}`);
  await page.getByRole("link", { name: "Apply as food vendor", exact: true }).click();
  await expect(page).toHaveURL(`/events/${openEvent.slug}/apply/food`);
  await expect(page.getByRole("group", { name: "Your application", exact: true })).toContainText("Food vendor");
});

test("apply directory only offers open events and lets vendors choose their type", async ({ page }) => {
  await page.goto("/apply");
  await expect(page.getByRole("link", { name: new RegExp(closedEvent.title) })).toHaveCount(0);
  await page.getByRole("link", { name: new RegExp(openEvent.title) }).click();
  await expect(page).toHaveURL(`/apply/${openEvent.slug}`);
  await expect(page.getByRole("link", { name: /Start vendor application/ })).toBeVisible();
  await page.getByRole("link", { name: /Start food application/ }).click();
  await expect(page).toHaveURL(`/events/${openEvent.slug}/apply/food`);
});

test("closed events cannot be applied to through direct links", async ({ page }) => {
  await page.goto(`/events/${closedEvent.slug}`);
  await expect(page.getByRole("heading", { name: "Closed", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Apply as/ })).toHaveCount(0);

  await page.goto(`/apply/${closedEvent.slug}`);
  await expect(page.getByText("Applications closed", { exact: true })).toBeVisible();
  for (const type of ["vendor", "food"]) {
    await page.goto(`/events/${closedEvent.slug}/apply/${type}`);
    await expect(page.getByText("Applications closed", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Next/ })).toHaveCount(0);
  }
});

test("missing calendar event returns a 404", async ({ request }) => {
  const response = await request.get("/events/missing-event/calendar.ics");
  expect(response.status()).toBe(404);
  expect(await response.text()).toBe("Event not found");
});
