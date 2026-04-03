import { expect, test } from "@playwright/test";

import { querySpaces } from "../../src/lib/server/spaces-query";
import { DEFAULT_SPACES_QUERY } from "../../src/lib/discovery/query-state";
import type { Space } from "../../src/types/entities";

const spaces: Space[] = [
  {
    id: 10,
    name: "Alpha Studio",
    city: "New York",
    category: "Studio",
    pricePerDay: 200,
    capacity: 50,
    rating: 4.8,
    reviewCount: 102,
    amenities: ["WiFi", "Parking", "AV Equipment"],
    imageUrl: "https://example.com/alpha.jpg",
    description: "Large studio for events",
    createdAt: "2025-02-10",
  },
  {
    id: 11,
    name: "Beta Room",
    city: "New York",
    category: "Meeting Room",
    pricePerDay: 200,
    capacity: 20,
    rating: 4.2,
    reviewCount: 48,
    amenities: ["WiFi"],
    imageUrl: "https://example.com/beta.jpg",
    description: "Compact meeting room",
    createdAt: "2025-03-05",
  },
  {
    id: 12,
    name: "Gamma Hall",
    city: "Austin",
    category: "Event Space",
    pricePerDay: 300,
    capacity: 100,
    rating: 4.9,
    reviewCount: 216,
    amenities: ["WiFi", "Parking", "Catering"],
    imageUrl: "https://example.com/gamma.jpg",
    description: "Hall for large teams",
    createdAt: "2025-01-22",
  },
];

test.describe("querySpaces", () => {
  test("composes filters with AND logic", () => {
    const result = querySpaces(spaces, {
      ...DEFAULT_SPACES_QUERY,
      q: "studio",
      categories: ["Studio"],
      cities: ["New York"],
      amenities: ["WiFi", "Parking"],
      minPrice: 150,
      maxPrice: 250,
      minCapacity: 40,
      maxCapacity: 60,
      minRating: 4.5,
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe(10);
    expect(result.meta.filteredTotal).toBe(1);
  });

  test("applies sort and deterministic tie-break", () => {
    const result = querySpaces(spaces, {
      ...DEFAULT_SPACES_QUERY,
      sort: "price_asc",
    });

    // Same price for ids 10 and 11; higher id comes first by tie-break.
    expect(result.items.map((item) => item.id)).toEqual([11, 10, 12]);
  });

  test("clamps page to the last available page", () => {
    const result = querySpaces(spaces, {
      ...DEFAULT_SPACES_QUERY,
      page: 999,
      pageSize: 2,
    });

    expect(result.meta.totalPages).toBe(2);
    expect(result.meta.page).toBe(2);
    expect(result.items).toHaveLength(1);
  });
});
