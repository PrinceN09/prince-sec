import { defineConfig, devices } from "@playwright/test";

const port = 3100;

/**
 * Tests run against a PRODUCTION build (`npm run build` first), because the CSP nonce,
 * headers and rendering behave differently in `next dev`.
 * SHOW_PLANNED=true renders planned navigation and placeholders so the full UI is scanned.
 * Set PW_CHROMIUM_PATH to use a locally installed Chromium instead of Playwright's download.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { SHOW_PLANNED: "true", NEXT_TELEMETRY_DISABLED: "1" },
  },
});
