import { expect, test } from "@playwright/test";

import { GET as getBookings } from "../../src/app/api/bookings/route";
import { PATCH } from "../../src/app/api/bookings/[id]/route";

type BookingStatus = "pending" | "confirmed" | "cancelled";

function nextStatus(current: BookingStatus): BookingStatus {
  if (current === "pending") {
    return "confirmed";
  }

  if (current === "confirmed") {
    return "cancelled";
  }

  return "pending";
}

test.describe("PATCH /api/bookings/:id route", () => {
  test("returns INVALID_BOOKING_ID for non-numeric ids", async () => {
    const response = await PATCH(
      new Request("http://localhost:3000/api/bookings/abc", {
        method: "PATCH",
        body: JSON.stringify({ status: "pending" }),
      }),
      { params: Promise.resolve({ id: "abc" }) }
    );
    const body = (await response.json()) as {
      success: boolean;
      error?: { code: string };
    };

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe("INVALID_BOOKING_ID");
  });

  test("returns INVALID_STATUS when status is missing", async () => {
    const response = await PATCH(
      new Request("http://localhost:3000/api/bookings/1", {
        method: "PATCH",
        body: JSON.stringify({}),
      }),
      { params: Promise.resolve({ id: "1" }) }
    );
    const body = (await response.json()) as {
      success: boolean;
      error?: { code: string };
    };

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe("INVALID_STATUS");
  });

  test("returns INVALID_STATUS when status is invalid", async () => {
    const response = await PATCH(
      new Request("http://localhost:3000/api/bookings/1", {
        method: "PATCH",
        body: JSON.stringify({ status: "invalid" }),
      }),
      { params: Promise.resolve({ id: "1" }) }
    );
    const body = (await response.json()) as {
      success: boolean;
      error?: { code: string };
    };

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe("INVALID_STATUS");
  });

  test("returns BOOKING_NOT_FOUND for unknown numeric ids", async () => {
    const response = await PATCH(
      new Request("http://localhost:3000/api/bookings/999999", {
        method: "PATCH",
        body: JSON.stringify({ status: "pending" }),
      }),
      { params: Promise.resolve({ id: "999999" }) }
    );
    const body = (await response.json()) as {
      success: boolean;
      error?: { code: string };
    };

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe("BOOKING_NOT_FOUND");
  });

  test("updates booking status and restores original value", async () => {
    const listResponse = await getBookings();
    const listBody = (await listResponse.json()) as {
      success: boolean;
      data: Array<{ id: number; status: BookingStatus }>;
    };

    expect(listResponse.status).toBe(200);
    expect(listBody.success).toBe(true);
    expect(listBody.data.length).toBeGreaterThan(0);

    const target = listBody.data[0];
    if (!target) {
      throw new Error("Expected at least one booking for PATCH test");
    }

    const bookingId = String(target.id);
    const originalStatus = target.status;
    const updatedStatus = nextStatus(originalStatus);

    try {
      const patchResponse = await PATCH(
        new Request(`http://localhost:3000/api/bookings/${bookingId}`, {
          method: "PATCH",
          body: JSON.stringify({ status: updatedStatus }),
        }),
        { params: Promise.resolve({ id: bookingId }) }
      );
      const patchBody = (await patchResponse.json()) as {
        success: boolean;
        data?: { id: number; status: BookingStatus };
      };

      expect(patchResponse.status).toBe(200);
      expect(patchBody.success).toBe(true);
      expect(patchBody.data?.id).toBe(target.id);
      expect(patchBody.data?.status).toBe(updatedStatus);
    } finally {
      await PATCH(
        new Request(`http://localhost:3000/api/bookings/${bookingId}`, {
          method: "PATCH",
          body: JSON.stringify({ status: originalStatus }),
        }),
        { params: Promise.resolve({ id: bookingId }) }
      );
    }
  });
});
