import { test, expect } from "./support/test";

for (const path of ["/admin", "/admin/events", "/admin/applications", "/admin/applications/export", "/admin/messages", "/admin/media", "/admin/session"]) {
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
