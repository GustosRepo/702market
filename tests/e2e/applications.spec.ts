import type { Page } from "@playwright/test";
import { test, expect, fixtureURL } from "./support/test";
import { openEvent, vendorOptions } from "./support/data.mjs";

const photo = {
  name: "booth.png",
  mimeType: "image/png",
  buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXioAAAAASUVORK5CYII=", "base64"),
};
const license = { name: "license.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\nE2E test license\n%%EOF") };

async function next(page: Page, legend: string) {
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByRole("group", { name: legend, exact: true })).toBeVisible();
}

async function fillApplication(page: Page, email: string, type: "vendor" | "food", uploadFiles = true) {
  await page.goto(`/events/${openEvent.slug}/apply/${type}`);
  await next(page, "About you");
  await page.getByLabel("First name", { exact: true }).fill("Taylor");
  await page.getByLabel("Last name", { exact: true }).fill("Maker");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Phone", { exact: true }).fill("7025550123");
  await next(page, "Your business");
  await page.getByLabel("Business name", { exact: true }).fill("Taylor's Market Booth");
  if (uploadFiles) await page.getByLabel("City of Las Vegas business license number").fill("G00-1234");
  if (type === "food") {
    await page.getByLabel("Setup measurements").fill("10 x 10 tent");
    await page.getByLabel("Health department number").fill("HEALTH-1234");
    await page.getByLabel("Complete food and drink menu").fill("Tacos and lemonade");
  } else {
    await page.getByLabel("Primary category").selectOption("Handmade");
    await page.getByLabel("List every product you plan to sell").fill("Handmade ceramic mugs");
  }
  await page.getByLabel("How will you fit the theme?").fill("Character art, themed booth decor, and matching merch.");
  await next(page, "Choose your setup");
  await page.getByRole("radio", { name: type === "food" ? /Food Tent/ : /Standard Vendor Space/ }).check();
  await next(page, "Documents and photos");
  if (uploadFiles) {
    await page.getByLabel("Business license upload (optional)", { exact: true }).setInputFiles(license);
    await page.getByLabel("Setup, truck, tent, and booth photos (optional)", { exact: true }).setInputFiles(photo);
    if (type === "food") {
      await page.getByLabel("Health permit upload (optional)", { exact: true }).setInputFiles({ ...license, name: "health-permit.pdf" });
      await page.getByLabel("Business logo (optional)", { exact: true }).setInputFiles({ ...photo, name: "logo.png" });
    }
  }
  await next(page, "Rules and review");
  if (type === "vendor") await page.getByRole("checkbox", { name: /I’m following MarketElla on Instagram/ }).check();
  await page.getByRole("checkbox", { name: /I read and agree/ }).check();
}

test("application steps validate fields and retain input when going back", async ({ page, email }) => {
  await page.goto(`/events/${openEvent.slug}/apply/vendor`);
  await next(page, "About you");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByLabel("First name", { exact: true })).toBeFocused();
  await expect(page.getByRole("group", { name: "About you", exact: true })).toBeVisible();
  await page.getByLabel("First name", { exact: true }).fill("Taylor");
  await page.getByLabel("Last name", { exact: true }).fill("Maker");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Phone", { exact: true }).fill("7025550123");
  await next(page, "Your business");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue("Taylor");
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(email);
});

for (const type of ["vendor", "food"] as const) {
  test(`${type} application can submit without any documents or photos`, async ({ page, request, email }) => {
    await fillApplication(page, email, type, false);
    await expect(page.locator('input[type="file"][required]')).toHaveCount(0);
    await page.getByRole("button", { name: "Submit application", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Application submitted" })).toBeVisible();
    const state = await (await request.get(`${fixtureURL}/__test/state`)).json();
    const application = state.applications.find((row: { email: string }) => row.email === email);
    expect(application).toMatchObject({ application_type: type, business_license_number: "", website: null, instagram: null, special_requests: null, price_range: "" });
    expect(state.application_images.filter((row: { application_id: string }) => row.application_id === application.id)).toHaveLength(0);
    expect(state.uploads.filter((row: { email: string }) => row.email === email)).toHaveLength(0);
  });

  test(`${type} application saves the selected space, documents, and reference`, async ({ page, request, email }) => {
    await fillApplication(page, email, type);
    await page.getByRole("button", { name: "Submit application", exact: true }).click();
    const success = page.getByRole("status").filter({ hasText: "Application submitted" });
    await expect(success).toContainText("Taylor's Market Booth");
    await expect(success).toContainText("is in review.");
    await expect(success).toContainText(/MKT-[A-Z0-9]+-[A-Z0-9]+/);

    const state = await (await request.get(`${fixtureURL}/__test/state`)).json();
    const applications = state.applications.filter((row: { email: string }) => row.email === email);
    expect(applications).toHaveLength(1);
    const application = applications[0];
    expect(application).toMatchObject({
      event_id: openEvent.id,
      application_type: type,
      business_name: "Taylor's Market Booth",
      status: "submitted",
      payment_status: "unpaid",
      rules_acknowledged: true,
      theme_fit: "Character art, themed booth decor, and matching merch.",
      following_instagram: type === "vendor",
      vendor_option_id: vendorOptions[type === "food" ? 2 : 0].id,
      application_fee: type === "food" ? 175 : 95,
    });
    await expect(success).toContainText(application.reference_code);
    const documents = state.application_images.filter((row: { application_id: string }) => row.application_id === application.id);
    expect(documents.map((row: { document_type: string }) => row.document_type).sort()).toEqual(
      type === "food" ? ["business_license", "health_permit", "logo", "setup_photo"] : ["business_license", "setup_photo"],
    );
    for (const document of documents) {
      expect(document.size_bytes).toBeGreaterThan(0);
      expect(state.uploads).toContainEqual(expect.objectContaining({ path: document.storage_path }));
    }
    await page.goto("/admin/login");
    await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
    await page.getByLabel("Password", { exact: true }).fill("e2e-valid-admin-password");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page).toHaveURL("/admin");
    await page.goto(`/admin/applications/${application.id}`);
    await expect(page.getByText("Character art, themed booth decor, and matching merch.", { exact: true })).toBeVisible();
    await expect(page.getByText(type === "vendor" ? "Confirmed by applicant" : "Not confirmed", { exact: true })).toBeVisible();
    const exported = await page.request.get("/admin/applications/export");
    expect(exported.ok()).toBe(true);
    const csv = await exported.text();
    expect(csv).toContain('"Theme fit","Following MarketElla on Instagram"');
    expect(csv).toContain("Character art, themed booth decor, and matching merch.");
  });
}

test("theme fit is required on the client and server", async ({ page, email }) => {
  await fillApplication(page, email, "vendor");
  await expect(page.getByRole("link", { name: "Follow MarketElla on Instagram" })).toHaveAttribute("href", "https://instagram.com/702market_");
  await page.locator('[name="themeFit"]').evaluate((field: HTMLTextAreaElement) => { field.value = ""; });
  await page.getByRole("button", { name: "Submit application", exact: true }).click();
  await expect(page.getByRole("group", { name: "Your business", exact: true })).toBeVisible();
  await expect(page.getByLabel("How will you fit the theme?")).toBeFocused();
  await page.getByLabel("How will you fit the theme?").fill("   ");
  await next(page, "Choose your setup");
  await next(page, "Documents and photos");
  await next(page, "Rules and review");
  await page.getByRole("button", { name: "Submit application", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("Please complete every required field before submitting.");
});

test("unsupported uploads show a server error and can be replaced", async ({ page, email }) => {
  await fillApplication(page, email, "vendor");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByLabel("Business license upload (optional)", { exact: true }).setInputFiles({
    name: "license.txt", mimeType: "text/plain", buffer: Buffer.from("invalid document"),
  });
  await next(page, "Rules and review");
  await page.getByRole("button", { name: "Submit application", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("license.txt must be a JPG, PNG, WebP, or PDF.");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByLabel("Business license upload (optional)", { exact: true }).setInputFiles(license);
  await next(page, "Rules and review");
  await page.getByRole("button", { name: "Submit application", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Application submitted" })).toBeVisible();
});

test("failed uploads roll back the application and allow a retry", async ({ page, request, email }) => {
  await fillApplication(page, email, "vendor");
  const response = await request.post(`${fixtureURL}/__test/fail-next`, {
    data: { operation: "upload", match: { email, documentType: "setup_photo" } },
  });
  expect(response.ok()).toBeTruthy();
  await page.getByRole("button", { name: "Submit application", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("One or more files could not be uploaded.");
  const state = await (await request.get(`${fixtureURL}/__test/state`)).json();
  expect(state.applications.filter((row: { email: string }) => row.email === email)).toHaveLength(0);
  expect(state.uploads.filter((row: { email: string }) => row.email === email)).toHaveLength(0);
  await page.getByRole("button", { name: "Submit application", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Application submitted" })).toBeVisible();
});
