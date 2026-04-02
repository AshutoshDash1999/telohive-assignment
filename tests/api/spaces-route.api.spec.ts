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
});
