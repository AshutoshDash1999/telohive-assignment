import { expect, test } from "@playwright/test";

import { GET } from "../../src/app/api/spaces/[id]/route";

test.describe("GET /api/spaces/:id route", () => {
  test("returns a space for a valid numeric id", async () => {
    const response = await GET(new Request("http://localhost:3000/api/spaces/1"), {
      params: Promise.resolve({ id: "1" }),
    });
    const body = (await response.json()) as {
      success: boolean;
      data?: { id: number };
    };

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data?.id).toBe(1);
  });

  test("returns INVALID_SPACE_ID for non-numeric ids", async () => {
    const response = await GET(new Request("http://localhost:3000/api/spaces/abc"), {
      params: Promise.resolve({ id: "abc" }),
    });
    const body = (await response.json()) as {
      success: boolean;
      error?: { code: string };
    };

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe("INVALID_SPACE_ID");
  });

  test("returns SPACE_NOT_FOUND for unknown numeric ids", async () => {
    const response = await GET(new Request("http://localhost:3000/api/spaces/999999"), {
      params: Promise.resolve({ id: "999999" }),
    });
    const body = (await response.json()) as {
      success: boolean;
      error?: { code: string };
    };

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe("SPACE_NOT_FOUND");
  });
});
