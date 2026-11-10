import type { Locator } from "@playwright/test";
import { test, expect } from "./support/test";

async function checkContinuousLoop(band: Locator) {
  await expect.poll(() => band.evaluate((element) => {
    const track = element.querySelector<HTMLElement>(".marquee-track")!;
    return track.getBoundingClientRect().width >= element.getBoundingClientRect().width * 2;
  })).toBe(true);
  const loop = await band.evaluate((element) => {
    const track = element.querySelector<HTMLElement>(".marquee-track")!;
    const animation = track.getAnimations()[0];
    if (!animation) throw new Error("Expected an animated marquee");
    animation.pause();
    const duration = Number(animation.effect!.getTiming().duration);
    const bounds = element.getBoundingClientRect();
    const visible = (time: number) => {
      animation.currentTime = time;
      return [...track.querySelectorAll("span")].map((span) => {
        const rect = span.getBoundingClientRect();
        return { text: span.textContent, left: rect.left - bounds.left, right: rect.right - bounds.left };
      }).filter((phrase) => phrase.right > 0 && phrase.left < bounds.width);
    };
    const start = visible(0);
    const end = visible(duration - 1);
    const gaps = [0, 0.25, 0.5, 0.75, 0.99999].map((progress) => {
      let right = 0;
      let largest = 0;
      for (const phrase of visible(duration * progress)) {
        largest = Math.max(largest, phrase.left - right);
        right = Math.min(bounds.width, phrase.right);
      }
      return Math.max(largest, bounds.width - right);
    });
    return { start, end, largestGap: Math.max(...gaps), width: bounds.width };
  });

  // The visible words and their positions must match just before wrapping.
  expect(loop.end.map((phrase) => phrase.text)).toEqual(loop.start.map((phrase) => phrase.text));
  loop.end.forEach((phrase, index) => expect(Math.abs(phrase.left - loop.start[index].left)).toBeLessThan(1));
  expect(loop.largestGap).toBeLessThan(64);
}

test("contact banners repeat continuously on every page that uses them", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const path of ["/", "/about", "/events", "/merch", "/podcast", "/contact", "/apply"]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await checkContinuousLoop(page.locator(".marquee-contact"));
  }
});

test("Apply hero keeps evenly spaced text across resizing and very wide screens", async ({ page, isMobile }) => {
  test.skip(isMobile, "The shared mobile banner is covered by the page and loop checks.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/apply");
  await page.evaluate(() => document.fonts.ready);
  for (const width of [390, 1440, 3840, 7680]) {
    await page.setViewportSize({ width, height: 900 });
    const band = page.locator(".apply-hero-marquee");
    const bounds = await band.boundingBox();
    expect(bounds!.x).toBeCloseTo(0, 0);
    expect(bounds!.width).toBeCloseTo(width, 0);
    await checkContinuousLoop(band);
  }
});

test("wide-screen contact and hero banners never run out of text", async ({ page }) => {
  await page.setViewportSize({ width: 3840, height: 1080 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const path of ["/contact", "/apply", "/faq", "/podcast"]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    for (const band of await page.locator(".marquee-band").all()) {
      await checkContinuousLoop(band);
    }
  }
});
