import type { Page } from "@playwright/test";
import { test, expect, fixtureURL } from "./support/test";

async function fillContact(page: Page, email: string) {
  await page.getByLabel("First Name", { exact: false }).fill("Taylor");
  await page.getByLabel("Last Name", { exact: false }).fill("Maker");
  await page.getByLabel("Email", { exact: false }).fill(email);
  await page.getByLabel("Subject", { exact: false }).fill("Market partnership");
  await page.getByLabel("Message", { exact: false }).fill("I would like to partner with the next market.");
}

test("contact form validates required fields before submitting", async ({ page, request, email }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByLabel("First Name", { exact: false })).toBeFocused();
  await fillContact(page, email);
  await page.getByLabel("Sign up for news and updates").check();
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Message sent. We will get back to you soon.");
  const state = await (await request.get(`${fixtureURL}/__test/state`)).json();
  expect(state.contact_submissions.filter((row: { email: string }) => row.email === email)).toEqual([
    expect.objectContaining({
      submission_type: "contact", first_name: "Taylor", last_name: "Maker", email,
      subject: "Market partnership", newsletter_opt_in: true,
    }),
  ]);
});

test("contact form displays server validation and allows correction", async ({ page, email }) => {
  await page.goto("/contact");
  await fillContact(page, email);
  await page.getByLabel("Message", { exact: false }).fill("x".repeat(5001));
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("Please shorten your message and try again.");
  await page.getByLabel("Message", { exact: false }).fill("A shorter message.");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Message sent.");
});

test("contact form preserves input after a backend failure and can retry", async ({ page, request, email }) => {
  const response = await request.post(`${fixtureURL}/__test/fail-next`, {
    data: { operation: "contact_submissions", match: { email } },
  });
  expect(response.ok()).toBeTruthy();
  await page.goto("/contact");
  await fillContact(page, email);
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("We could not send that right now.");
  await expect(page.getByLabel("Email", { exact: false })).toHaveValue(email);
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Message sent.");
});

for (const type of ["podcast_story", "podcast_chisme"] as const) {
  test(`${type} is saved with the correct submission type`, async ({ page, request, email }) => {
    await page.goto("/podcast");
    const buttonName = type === "podcast_story" ? "Tell us your story" : "Drop 702 chisme";
    const form = page.locator("form").filter({ has: page.getByRole("button", { name: buttonName, exact: true }) });
    await form.getByLabel("Name", { exact: true }).fill("Taylor");
    await form.getByLabel("Email", { exact: true }).fill(email);
    await form.getByRole("textbox").last().fill("x".repeat(5001));
    await form.getByRole("button", { name: buttonName, exact: true }).click();
    await expect(form.getByRole("alert")).toHaveText("Please shorten your message and try again.");
    await expect(form.getByLabel("Email", { exact: true })).toHaveValue(email);
    await form.getByRole("textbox").last().fill("My story from the market.");
    await form.getByRole("button", { name: buttonName, exact: true }).click();
    await expect(page.getByRole("status")).toContainText("Sent. Thanks for trusting us with it.");
    const state = await (await request.get(`${fixtureURL}/__test/state`)).json();
    expect(state.contact_submissions).toContainEqual(expect.objectContaining({ email, submission_type: type, message: "My story from the market." }));
  });
}
