import { createHash } from "node:crypto";
import { test as base, expect } from "@playwright/test";

export const fixtureURL = "http://127.0.0.1:54329";

// Unique identities keep writes and injected failures isolated across workers,
// browser projects, repeat runs, and retries without resetting shared state.
export const test = base.extend<{ email: string }>({
  email: async ({}, provide, testInfo) => {
    const id = createHash("sha256")
      .update(`${testInfo.testId}:${testInfo.retry}:${testInfo.repeatEachIndex}`)
      .digest("hex").slice(0, 16);
    await provide(`e2e-${id}@example.test`);
  },
});

export { expect };
