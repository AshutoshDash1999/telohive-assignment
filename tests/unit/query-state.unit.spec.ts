import { expect, test } from "@playwright/test";

import {
  DEFAULT_SPACES_QUERY,
  parseSpacesQueryFromSearchParams,
  toSpacesSearchParams,
} from "../../src/lib/discovery/query-state";
import {
  DEFAULT_BOOKINGS_QUERY,
  parseBookingsQueryFromSearchParams,
  toBookingsSearchParams,
} from "../../src/lib/bookings/query-state";

test.describe("query-state serialization", () => {
  test("serializes and parses discovery query params", () => {
    const initial = {
      ...DEFAULT_SPACES_QUERY,
      q: "studio",
      categories: ["Studio", "Meeting Room"],
      cities: ["Austin"],
      amenities: ["WiFi", "Parking"],
      minPrice: 100,
      maxPrice: 500,
      minCapacity: 10,
      maxCapacity: 250,
      minRating: 4,
      availabilityDate: "2026-04-10",
      sort: "rating_desc" as const,
      page: 2,
      pageSize: 24,
    };

    const serialized = toSpacesSearchParams(initial);
    const parsed = parseSpacesQueryFromSearchParams(serialized);

    expect(parsed).toEqual(initial);
  });

  test("falls back to defaults for invalid discovery params", () => {
    const parsed = parseSpacesQueryFromSearchParams(
      new URLSearchParams("sort=not_valid&page=-1&pageSize=1000&minPrice=abc")
    );

    expect(parsed.sort).toBe(DEFAULT_SPACES_QUERY.sort);
    expect(parsed.page).toBe(DEFAULT_SPACES_QUERY.page);
    expect(parsed.pageSize).toBe(DEFAULT_SPACES_QUERY.pageSize);
    expect(parsed.minPrice).toBeNull();
  });

  test("serializes and parses bookings query params", () => {
    const initial = {
      ...DEFAULT_BOOKINGS_QUERY,
      q: "alpha",
      statuses: ["pending", "confirmed"] as const,
      startDate: "2026-05-01",
      endDate: "2026-05-31",
      sortField: "amount" as const,
      sortDirection: "asc" as const,
    };

    const serialized = toBookingsSearchParams({
      ...initial,
      statuses: [...initial.statuses],
    });
    const parsed = parseBookingsQueryFromSearchParams(serialized);

    expect(parsed).toEqual({
      ...initial,
      statuses: [...initial.statuses],
    });
  });
});
