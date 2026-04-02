import { expect, test } from "@playwright/test";

import { GET } from "../../src/app/api/spaces/route";

test.describe("GET /api/spaces route", () => {
  test("returns success payload with filtered results and meta", async () => {
    const request = new Request(
      "http://localhost:3000/api/spaces?q=studio&sort=price_asc&page=1&pageSize=5"
    );

    const response = await GET(request);
    const body = (await response.json()) as {
      success: boolean;
      data: Array<{ id: number; name: string; pricePerDay: number }>;
      meta?: {
        filteredTotal: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
    };

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.meta).toBeTruthy();
    expect(body.meta?.page).toBe(1);
    expect(body.meta?.pageSize).toBe(5);
  });

  test("clamps oversized page to last page", async () => {
    const request = new Request(
      "http://localhost:3000/api/spaces?q=studio&page=9999&pageSize=7"
    );

    const response = await GET(request);
    const body = (await response.json()) as {
      success: boolean;
      data: Array<{ id: number }>;
      meta?: { page: number; pageSize: number; totalPages: number; filteredTotal: number };
    };

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.meta?.pageSize).toBe(7);
    expect(body.meta?.totalPages).toBeTruthy();
    expect(body.meta?.page).toBe(body.meta?.totalPages);
  });

  test("supports multi-filter query combinations", async () => {
    const request = new Request(
      "http://localhost:3000/api/spaces?category=Studio&city=New%20York&amenity=WiFi&minRating=3"
    );

    const response = await GET(request);
    const body = (await response.json()) as {
      success: boolean;
      data: Array<{ category: string; city: string; amenities: string[]; rating: number }>;
      meta?: { filteredTotal: number };
    };

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.meta?.filteredTotal).toBe(body.data.length);

    for (const item of body.data) {
      expect(item.category).toBe("Studio");
      expect(item.city).toBe("New York");
      expect(item.amenities).toContain("WiFi");
      expect(item.rating).toBeGreaterThanOrEqual(3);
    }
  });

  test("returns empty results with valid meta when no spaces match", async () => {
    const request = new Request("http://localhost:3000/api/spaces?q=___no_match___");

    const response = await GET(request);
    const body = (await response.json()) as {
      success: boolean;
      data: unknown[];
      meta?: { filteredTotal: number; totalPages: number; page: number };
    };

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
    expect(body.meta?.filteredTotal).toBe(0);
    expect(body.meta?.totalPages).toBe(1);
    expect(body.meta?.page).toBe(1);
  });
});
