import { expect, test } from "@playwright/test";

import { GET } from "../../src/app/api/bookings/route";

test.describe("GET /api/bookings route", () => {
  test("returns mapped booking rows sorted by id descending", async () => {
    const response = await GET();
    const body = (await response.json()) as {
      success: boolean;
      data: Array<{
        id: number;
        spaceName: string;
        date: string;
        status: string;
        amount: number;
      }>;
    };

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    const first = body.data[0];
    expect(first?.spaceName).toBeTruthy();
    expect(first?.date).toContain(" - ");
    expect(first?.status).toBeTruthy();
    expect(typeof first?.amount).toBe("number");

    for (let i = 1; i < body.data.length; i += 1) {
      expect(body.data[i - 1]?.id).toBeGreaterThan(body.data[i]?.id ?? Number.MAX_SAFE_INTEGER);
    }
  });
});
