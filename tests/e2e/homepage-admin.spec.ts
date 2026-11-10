import { test, expect, fixtureURL } from "./support/test";
import type { Page } from "@playwright/test";
import { defaultVendorTerms } from "../../src/lib/vendor-terms";
import { openEvent } from "./support/data.mjs";
import sharp from "sharp";

test("vendor agreement is editable per event, persists, and appears in the application", async ({ page, request }) => {
  const original = (await (await request.get(`${fixtureURL}/rest/v1/events?slug=eq.${openEvent.slug}`)).json())[0];
  const editedTerms = `${defaultVendorTerms}\n\n8. EVENT NOTE\n\nBring a pink tablecloth for this market.`;
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page.getByLabel("Password", { exact: true }).fill("e2e-valid-admin-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL("/admin");
  try {
    await page.goto("/admin/events/new");
    await expect(page.getByLabel("General vendor terms & agreement", { exact: true })).toHaveValue(defaultVendorTerms);
    await page.goto(`/admin/events/${openEvent.slug}/edit`);
    await page.getByLabel("General vendor terms & agreement", { exact: true }).fill(editedTerms);
    await page.getByRole("button", { name: "Save event" }).click();
    await expect(page).toHaveURL("/admin/events");
    await page.goto(`/admin/events/${openEvent.slug}/edit`);
    await expect(page.getByLabel("General vendor terms & agreement", { exact: true })).toHaveValue(editedTerms);
    const stored = (await (await request.get(`${fixtureURL}/rest/v1/events?slug=eq.${openEvent.slug}`)).json())[0];
    expect(stored.food_application_rules).toBe(original.food_application_rules);
    await page.goto(`/events/${openEvent.slug}/apply/vendor`);
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByLabel("First name", { exact: true }).fill("Taylor");
    await page.getByLabel("Last name", { exact: true }).fill("Maker");
    await page.getByLabel("Email", { exact: true }).fill("terms@example.test");
    await page.getByLabel("Phone", { exact: true }).fill("7025550123");
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByLabel("Business name", { exact: true }).fill("Themed Booth");
    await page.getByLabel("Primary category").selectOption("Art");
    await page.getByLabel("List every product you plan to sell").fill("Character art");
    await page.getByLabel("How will you fit the theme?").fill("Pink art and decor");
    for (let index = 0; index < 3; index++) await page.getByRole("button", { name: "Next", exact: true }).click();
    const agreement = page.getByRole("region", { name: "Event terms and agreement" });
    await expect(agreement).toBeVisible();
    await expect(agreement.getByRole("heading", { name: "VENDOR TERMS & AGREEMENT", exact: true })).toBeVisible();
    await expect(agreement.getByRole("heading", { name: "8. EVENT NOTE", exact: true })).toHaveCount(1);
    await expect(agreement).toContainText("Bring a pink tablecloth for this market.");
  } finally {
    await request.patch(`${fixtureURL}/rest/v1/events?slug=eq.${openEvent.slug}`, { data: original });
  }
});

async function saveHomepage(page: Page) {
  const saved = page.waitForResponse((response) =>
    response.request().method() === "POST" && response.url().endsWith("/admin/homepage"),
  );
  await page.getByRole("button", { name: "Save homepage" }).click();
  await saved;
  await page.reload();
}

test("admin countdown settings save, persist visibility, and retire announcement controls", async ({ page, request }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page.getByLabel("Password", { exact: true }).fill("e2e-valid-admin-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL("/admin");
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  try {
    await page.goto("/admin/homepage");
    await expect(page.getByRole("heading", { name: "Next event countdown" })).toBeVisible();
    await expect(page.getByLabel("Location name", { exact: true })).toHaveCount(0);
    await expect(page.getByLabel("Button link", { exact: true })).toHaveCount(0);
    await expect(page.locator(".admin-toolbar").getByRole("link", { name: "Events", exact: true })).toHaveAttribute("href", "/admin/events");
    await page.getByLabel("Countdown heading", { exact: true }).fill("see you at the next market");
    await page.getByLabel("Message when no events are scheduled").fill("New dates soon!");
    await saveHomepage(page);
    await expect(page.getByLabel("Countdown heading", { exact: true })).toHaveValue("see you at the next market");
    await expect(page.getByLabel("Message when no events are scheduled")).toHaveValue("New dates soon!");
    await page.goto("/");
    await expect(page.getByRole("region", { name: "see you at the next market" })).toBeVisible();

    await page.goto("/admin/homepage");
    await page.getByLabel("Show this section on the homepage").uncheck();
    await saveHomepage(page);
    await expect(page.getByLabel("Show this section on the homepage")).not.toBeChecked();
    await page.goto("/");
    await expect(page.locator(".countdown-section")).toHaveCount(0);
    await page.reload();
    await expect(page.locator(".countdown-section")).toHaveCount(0);

    await page.goto("/admin/homepage");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByLabel("Show this section on the homepage").check();
    await saveHomepage(page);
    await expect(page.getByLabel("Show this section on the homepage")).toBeChecked();
    await page.goto("/");
    await expect(page.getByRole("region", { name: "see you at the next market" })).toBeVisible();
    await page.goto("/admin/media");
    await expect(page.getByText("New location strip", { exact: true })).toHaveCount(0);
  } finally {
    await request.post(`${fixtureURL}/rest/v1/site_content`, {
      data: {
        key: "home.countdown", active: true,
        content: { heading: "UPCOMING MARKET", emptyMessage: "More market dates coming soon. Stay tuned!" },
      },
    });
  }
});

test("admin uploads, orders, captions, and hides homepage carousel photos", async ({ page, request }) => {
  const originalRows = await (await request.get(`${fixtureURL}/rest/v1/site_media`)).json();
  const photo = await sharp({ create: { width: 800, height: 600, channels: 3, background: "#ecc0c1" } }).png().toBuffer();
  // Image optimization is separate from the simulated Supabase service boundary.
  await page.route("**/_next/image?**", async (route) => {
    const source = new URL(route.request().url()).searchParams.get("url") || "";
    if (source.includes("/storage/v1/object/public/site-assets/")) {
      await route.fulfill({ contentType: "image/png", body: photo });
    } else await route.continue();
  });
  async function saveMedia() {
    const saved = page.waitForResponse((response) => response.request().method() === "POST" && response.url().endsWith("/admin/media"));
    await page.getByRole("button", { name: "Save media" }).click();
    await saved;
    await page.reload();
  }
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page.getByLabel("Password", { exact: true }).fill("e2e-valid-admin-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL("/admin");
  try {
    await page.goto("/admin/media");
    await page.getByLabel("Add carousel photos", { exact: true }).setInputFiles([
      { name: "new-market.png", mimeType: "image/png", buffer: photo },
      { name: "another-market.png", mimeType: "image/png", buffer: photo },
    ]);
    await saveMedia();
    const rows = await (await request.get(`${fixtureURL}/rest/v1/site_media`)).json();
    const uploaded = rows.find((row: { alt_text: string }) => row.alt_text === "new market");
    expect(uploaded.storage_path).toContain("/storage/v1/object/public/site-assets/home.gallery.");
    const card = page.locator(".admin-media-card").filter({ has: page.locator(`input[name="${uploaded.slot}:altText"]`) });
    await card.getByLabel("Alt text", { exact: true }).fill("Our newest market photo");
    await card.getByLabel("Caption", { exact: true }).fill("Made for market days");
    await card.getByLabel("Display order", { exact: true }).fill("0");
    await saveMedia();
    await page.goto("/");
    const gallery = page.getByRole("region", { name: "MarketElla photo gallery" });
    await expect(gallery.getByRole("button", { name: /^Open photo/ })).toHaveCount(5);
    const first = gallery.getByRole("button", { name: "Open photo 1: Our newest market photo", exact: true });
    await expect(first).toContainText("Made for market days");
    await first.click();
    const viewer = page.getByRole("dialog", { name: "MarketElla photo viewer" });
    await expect(viewer.getByRole("img")).toHaveAttribute("alt", "Our newest market photo");
    await viewer.getByRole("button", { name: /Close/ }).click();

    await page.goto("/admin/media");
    const group = page.locator(".admin-group").filter({ has: page.getByRole("heading", { name: "Homepage carousel", exact: true }) });
    for (const checkbox of await group.getByRole("checkbox", { name: "Active", exact: true }).all()) {
      await checkbox.uncheck();
    }
    await saveMedia();
    await page.goto("/");
    await expect(page.getByRole("region", { name: "MarketElla photo gallery" })).toHaveCount(0);
  } finally {
    const rows = await (await request.get(`${fixtureURL}/rest/v1/site_media`)).json();
    const originalSlots = new Set(originalRows.map((row: { slot: string }) => row.slot));
    await request.post(`${fixtureURL}/rest/v1/site_media`, {
      data: [
        ...originalRows,
        ...rows.filter((row: { slot: string }) => !originalSlots.has(row.slot)).map((row: object) => ({ ...row, active: false })),
      ],
    });
  }
});
