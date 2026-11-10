import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3100";
const fixtureURL = "http://127.0.0.1:54329";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  globalTimeout: 10 * 60_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", testIgnore: "**/homepage-admin.spec.ts", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", testIgnore: "**/homepage-admin.spec.ts", use: { ...devices["Pixel 7"] } },
    {
      name: "homepage-admin",
      testMatch: "**/homepage-admin.spec.ts",
      // These checks change global homepage settings; run after public readers.
      dependencies: ["chromium", "mobile-chromium"],
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node tests/e2e/support/supabase-server.mjs",
      url: `${fixtureURL}/__test/health`,
      reuseExistingServer: false,
    },
    {
      command: "npm run build && npm run start -- --hostname 127.0.0.1 --port 3100",
      url: `${baseURL}/admin/login`,
      timeout: 180_000,
      reuseExistingServer: false,
      env: {
        E2E_TEST: "1",
        NEXT_TELEMETRY_DISABLED: "1",
        NEXT_PUBLIC_SITE_URL: baseURL,
        NEXT_PUBLIC_SUPABASE_URL: fixtureURL,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "e2e-publishable-key",
        SUPABASE_SERVICE_ROLE_KEY: "e2e-service-role-key",
        ADMIN_EMAILS: "admin@example.test",
        ADMIN_SESSION_SECRET: "e2e-only-admin-session-secret-at-least-32-characters",
        ADMIN_IDLE_TIMEOUT_MINUTES: "30",
        ADMIN_MAX_SESSION_HOURS: "12",
        RESEND_API_KEY: "",
        APPLICATION_FROM_EMAIL: "",
      },
    },
  ],
});
