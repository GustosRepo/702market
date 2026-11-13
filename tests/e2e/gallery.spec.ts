import { test, expect } from "./support/test";

test("gallery auto-slides every five seconds, loops, and respects motion controls", async ({ page, isMobile }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const gallery = page.getByRole("region", { name: "MarketElla photo gallery" });
  const track = gallery.getByRole("group", { name: "Gallery photos" });
  await gallery.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.mouse.move(isMobile ? 1 : -10, isMobile ? 1 : -10);
  await page.clock.runFor(100);
  const firstStop = await track.evaluate((element) => {
    const [first, second] = element.children;
    return Math.round(Math.min(element.scrollWidth - element.clientWidth, second.getBoundingClientRect().left - first.getBoundingClientRect().left));
  });
  await page.clock.runFor(4500);
  expect(await track.evaluate((element) => element.scrollLeft)).toBe(0);
  await page.clock.runFor(1000);
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeCloseTo(firstStop, 0);

  await track.evaluate((element) => element.scrollTo({ left: element.scrollWidth, behavior: "instant" }));
  await page.clock.runFor(5100);
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeLessThan(2);

  await page.getByRole("button", { name: "Pause animations", exact: true }).click();
  await gallery.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.mouse.move(isMobile ? 1 : -10, isMobile ? 1 : -10);
  await page.clock.runFor(100);
  await track.evaluate((element) => element.scrollTo({ left: 0, behavior: "instant" }));
  await page.clock.runFor(10000);
  expect(await track.evaluate((element) => element.scrollLeft)).toBe(0);
  await page.getByRole("button", { name: "Resume animations", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause animations", exact: true })).toHaveAttribute("aria-pressed", "false");
  await gallery.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.mouse.move(isMobile ? 1 : -10, isMobile ? 1 : -10);
  await page.clock.runFor(100);
  await page.clock.runFor(5100);
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeCloseTo(firstStop, 0);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.runFor(100);
  await track.evaluate((element) => element.scrollTo({ left: 0, behavior: "instant" }));
  await page.clock.runFor(10000);
  expect(await track.evaluate((element) => element.scrollLeft)).toBe(0);
});

test("gallery pauses on hover, focus, and while a photo is enlarged", async ({ page, isMobile }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const gallery = page.getByRole("region", { name: "MarketElla photo gallery" });
  const track = gallery.getByRole("group", { name: "Gallery photos" });
  await gallery.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  if (!isMobile) {
    await gallery.hover({ position: { x: 10, y: 10 } });
    await page.clock.runFor(10000);
    expect(await track.evaluate((element) => element.scrollLeft)).toBe(0);
  }
  await track.focus();
  await page.mouse.move(-10, -10);
  await page.clock.runFor(10000);
  expect(await track.evaluate((element) => element.scrollLeft)).toBe(0);
  await track.evaluate((element) => element.blur());
  await page.clock.runFor(5100);
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  await gallery.getByRole("button", { name: /^Open photo 1:/ }).click();
  const viewer = page.getByRole("dialog", { name: "MarketElla photo viewer" });
  await expect(viewer).toBeVisible();
  const before = await track.evaluate((element) => element.scrollLeft);
  await page.clock.runFor(12000);
  await expect(viewer).toContainText("Photo 1 of 16");
  expect(await track.evaluate((element) => element.scrollLeft)).toBe(before);
  await page.keyboard.press("Escape");
  await expect(viewer).not.toBeVisible();
});

test("homepage gallery opens photos, navigates, and closes with focus restored", async ({ page, isMobile }, testInfo) => {
  await page.goto("/");
  const gallery = page.getByRole("region", { name: "MarketElla photo gallery" });
  await expect(gallery).toHaveCSS("background-color", "rgb(253, 208, 204)");
  await expect(gallery.getByRole("button", { name: /^Open photo/ })).toHaveCount(16);
  await expect(page.locator(".next-market-panel")).toHaveCount(0);
  const track = gallery.getByRole("group", { name: "Gallery photos" });
  await gallery.getByRole("button", { name: "Next gallery photos", exact: true }).click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  const opener = gallery.getByRole("button", { name: /^Open photo 2:/ });
  await opener.click();
  const viewer = page.getByRole("dialog", { name: "MarketElla photo viewer" });
  await expect(viewer).toBeVisible();
  await expect(viewer).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(viewer.getByRole("button")).toHaveCount(1);
  await expect(viewer.getByRole("img")).toHaveAttribute("alt", "Vendor booth with clothing and accessories at MarketElla.");
  await expect(viewer.getByRole("button", { name: /Close/ })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(viewer).toContainText("Photo 3 of 16");
  await page.keyboard.press("ArrowRight");
  await expect(viewer).toContainText("Photo 4 of 16");
  await expect(viewer.getByRole("img")).toHaveAttribute("alt", "Pug riding in a pink stroller at MarketElla.");
  for (let step = 0; step < 3; step++) await page.keyboard.press("ArrowLeft");
  await expect(viewer).toContainText("Photo 1 of 16");
  await page.keyboard.press("ArrowLeft");
  await expect(viewer).toContainText("Photo 16 of 16");
  await expect(viewer.getByRole("img")).toHaveAttribute("alt", "Couple standing beside a mirror and flowering wall at MarketElla.");
  await page.keyboard.press("ArrowRight");
  await expect(viewer).toContainText("Photo 1 of 16");
  await page.keyboard.press("Tab");
  expect(await viewer.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("photo-viewer.png") });
  await page.keyboard.press("Escape");
  await expect(viewer).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await gallery.screenshot({ path: testInfo.outputPath("photo-carousel.png") });

  if (isMobile) {
    await opener.click();
    const image = viewer.getByRole("img");
    await image.evaluate((element) => {
      const start = new Touch({ identifier: 1, target: element, clientX: 250, clientY: 100 });
      element.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [start] }));
      const end = new Touch({ identifier: 1, target: element, clientX: 50, clientY: 100 });
      element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }));
    });
    await expect(viewer).toContainText("Photo 3 of 16");
    await viewer.getByRole("button", { name: /Close/ }).click();
    await expect(viewer).not.toBeVisible();
  }
});
