import { test, expect } from "./support/test";

test("home navigation reaches the public pages", async ({ page }) => {
  const pages = [
    { link: "Apply 2 Sell", path: "/apply", heading: /want 2 grow/i },
    { link: "What's MarketElla?", path: "/about", heading: /what the f\*\*\* is marketella/i },
    { link: "Shop", path: "/merch", heading: /the marketella shop/i },
    { link: "Calendar", path: "/events", heading: /where to find us/i },
    { link: "FAQ", path: "/faq", heading: /comments\? questions\? concerns\?/i },
    { link: "Link Tree", path: "/socials", heading: /find us/i },
    { link: "Podcast", path: "/podcast", heading: /the 702 chisme podcast/i },
  ];
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("WELCOME 2 MARKETELLA");

  for (const destination of pages) {
    await page.getByRole("navigation").getByRole("link", { name: destination.link, exact: true }).click();
    await expect(page).toHaveURL(destination.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(destination.heading);
  }
  await page.getByRole("link", { name: "MarketElla home", exact: true }).click();
  await expect(page).toHaveURL("/");
});

test("FAQ answers can be expanded and collapsed", async ({ page }) => {
  await page.goto("/faq");
  const question = page.locator("details").filter({ hasText: "Do I need a business license to sell with you?" });
  const answer = question.getByText(/Every applicant must provide the business license/);
  await expect(answer).toBeHidden();
  await question.locator("summary").click();
  await expect(answer).toBeVisible();
  await question.locator("summary").click();
  await expect(answer).toBeHidden();
});

test("shop and podcast show published content with outbound links", async ({ page }) => {
  await page.goto("/merch");
  const product = page.getByRole("article").filter({ hasText: "MarketElla Test Tee" });
  await expect(product).toContainText("$25");
  await expect(product.getByRole("link", { name: /Shop now/ })).toHaveAttribute("href", "https://example.test/shop/tee");

  await page.goto("/podcast");
  const episode = page.getByRole("article").filter({ hasText: "Inside the Night Market" });
  await expect(episode.getByRole("link", { name: "listen now" })).toHaveAttribute("href", "https://example.test/podcast/1");
});

test("privacy and terms link to each other", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Privacy\s*policy\./);
  await page.getByRole("link", { name: /Read the Terms/ }).click();
  await expect(page).toHaveURL("/terms");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Good to\s*know\./);
  await page.getByRole("link", { name: /Read the Privacy Policy/ }).click();
  await expect(page).toHaveURL("/privacy");
});

for (const path of ["/missing-page", "/events/missing-event", "/events/e2e-night-market/apply/invalid"]) {
  test(`unknown route ${path} offers recovery`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/this page\s*packed up\./);
    await page.getByRole("link", { name: "Go home", exact: true }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("WELCOME 2 MARKETELLA");
  });
}
