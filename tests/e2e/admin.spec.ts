import { test, expect } from "./support/test";

test("admin event locations use a dropdown and preserve other existing venues", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page.getByLabel("Password", { exact: true }).fill("e2e-valid-admin-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL("/admin");
  await page.goto("/admin/events/new");
  const location = page.getByLabel("Location", { exact: true });
  await location.selectOption("cowabunga-canyon");
  await expect(page.getByLabel("Other location name", { exact: true })).toHaveCount(0);
  await location.selectOption("other");
  await expect(page.getByLabel("Other location name", { exact: true })).toHaveAttribute("required", "");
  await page.goto("/admin/events/e2e-night-market/edit");
  await expect(location).toHaveValue("fergusons-downtown");
  await page.goto("/admin/events/e2e-closed-market/edit");
  await expect(location).toHaveValue("other");
  await expect(page.getByLabel("Other location name", { exact: true })).toHaveValue("Arts District Courtyard");
});

for (const path of ["/admin", "/admin/events", "/admin/applications", "/admin/applications/export", "/admin/messages", "/admin/media", "/admin/homepage", "/admin/session"]) {
  test(`anonymous access to ${path} redirects to login`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(new URL(response.headers().location, response.url()).pathname).toBe("/admin/login");
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
  });
}

test("admin login rejects an unlisted email and invalid credentials", async ({ page }) => {
  await page.goto("/admin/events");
  await expect(page).toHaveURL("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill("stranger@example.test");
  await page.getByLabel("Password", { exact: true }).fill("invalid-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("The email or password is incorrect.");

  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page.getByLabel("Password", { exact: true }).fill("invalid-password");
  const loginResponse = page.waitForResponse((response) =>
    response.request().method() === "POST" && response.url().endsWith("/admin/login"),
  );
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await loginResponse;
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("The email or password is incorrect.");
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeEnabled();
  await expect(page).toHaveURL("/admin/login");
});
