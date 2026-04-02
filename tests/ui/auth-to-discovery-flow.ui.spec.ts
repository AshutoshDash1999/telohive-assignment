import { expect, test, type Page } from "@playwright/test";

function seedAuthenticatedState(page: Page) {
  return page.addInitScript(() => {
    window.localStorage.setItem(
      "th:auth:session:v1",
      JSON.stringify({
        user: {
          id: "e2e-user-1",
          email: "e2e@example.com",
          firstName: "E2E",
          lastName: "User",
        },
      })
    );

    window.localStorage.setItem(
      "th:saved:spaces:v1",
      JSON.stringify({
        state: {
          savedSpaceIds: [1, 2, 3, 4, 5],
        },
        version: 0,
      })
    );
  });
}

test.describe("app events and URL state", () => {
  test("login, navigate each page, and logout", async ({ page }) => {
    await page.goto("/login");

    await Promise.all([
      page.waitForURL("**/discovery**"),
      page.getByRole("button", { name: "Google" }).click(),
    ]);

    await expect(page.getByRole("heading", { name: "Discovery" })).toBeVisible();

    await page.getByTestId("app-nav-saved").click();
    await page.waitForURL("**/saved**");
    await expect(page.getByRole("heading", { name: "Saved" })).toBeVisible();

    await page.getByTestId("app-nav-dashboard").click();
    await page.waitForURL("**/dashboard**");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await page.getByTestId("app-nav-bookings").click();
    await page.waitForURL("**/bookings**");
    await expect(page.getByRole("heading", { name: "Bookings" })).toBeVisible();

    await page.getByTestId("app-logout-button").click();
    await page.waitForURL("**/login**");
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });

  test("applies discovery filters and pagination with URL updates", async ({ page }) => {
    await seedAuthenticatedState(page);
    await page.goto("/discovery");

    await expect(page.getByTestId("discovery-pagination-next")).toBeEnabled();
    await page.getByTestId("discovery-pagination-next").click();
    await expect.poll(() => new URL(page.url()).searchParams.get("page")).toBe("2");

    await page.getByTestId("discovery-search-input").fill("a");
    await expect.poll(() => new URL(page.url()).searchParams.get("q")).toBe("a");

    await page.getByTestId("discovery-sort-select").selectOption("price_desc");
    await expect.poll(() => new URL(page.url()).searchParams.get("sort")).toBe("price_desc");

    await page.getByTestId("discovery-open-filters-button").click();
    await page.getByTestId("discovery-filter-section-category").click();
    await page
      .getByTestId("discovery-filters-modal")
      .locator('input[type="checkbox"]')
      .first()
      .check();
    await page.getByTestId("discovery-apply-filters-button").click();

    await expect
      .poll(() => new URL(page.url()).searchParams.get("category"))
      .not.toBeNull();

    await page.getByTestId("discovery-page-size-select").selectOption("24");
    await expect.poll(() => new URL(page.url()).searchParams.get("pageSize")).toBe("24");
  });

  test("applies bookings filters/sort and updates URL parameters", async ({ page }) => {
    await seedAuthenticatedState(page);
    await page.goto("/bookings");

    await page.getByTestId("bookings-sort-amount").click();
    await expect.poll(() => new URL(page.url()).searchParams.get("sort")).toBe("amount");
    await expect.poll(() => new URL(page.url()).searchParams.get("dir")).toBe("asc");

    await page.getByTestId("bookings-sort-amount").click();
    await expect.poll(() => new URL(page.url()).searchParams.get("dir")).toBeNull();

    await page.getByTestId("bookings-search-input").fill("room");
    await expect.poll(() => new URL(page.url()).searchParams.get("q")).toBe("room");

    await page.getByTestId("bookings-status-checkbox-pending").click();
    await expect
      .poll(() => new URL(page.url()).searchParams.getAll("status"))
      .toContain("pending");
  });

  test("applies and clears filters on saved page", async ({ page }) => {
    await seedAuthenticatedState(page);
    await page.goto("/saved");

    await expect(page.getByTestId("saved-toolbar")).toBeVisible();
    await page.getByTestId("saved-search-input").fill("studio");
    await expect(page.getByText(/Showing \d+ of \d+ saved spaces/)).toBeVisible();

    await page.getByTestId("saved-category-select").selectOption({ index: 1 });
    await page.getByTestId("saved-city-select").selectOption({ index: 1 });
    await page.getByTestId("saved-clear-filters-button").click();

    await expect(page.getByTestId("saved-search-input")).toHaveValue("");
    await expect(page.getByTestId("saved-category-select")).toHaveValue("");
    await expect(page.getByTestId("saved-city-select")).toHaveValue("");
  });
});
