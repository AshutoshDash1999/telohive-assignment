import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  tsconfig: "./tsconfig.json",
  fullyParallel: true,
  retries: 0,
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "unit",
      testMatch: ["tests/unit/**/*.spec.ts"],
    },
    {
      name: "api",
      testMatch: ["tests/api/**/*.spec.ts"],
    },
  ],
});
