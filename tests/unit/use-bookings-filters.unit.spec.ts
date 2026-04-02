import { expect, test } from "@playwright/test";

import { filterBookings } from "../../src/app/(app)/bookings/_components/useBookingsFilters";
import type { BookingListItem } from "../../src/lib/api/bookings";

const bookings: BookingListItem[] = [
  {
    id: 1,
    spaceId: 10,
    spaceName: "Alpha Studio",
    date: "2026-05-10",
    startDate: "2026-05-10",
    endDate: "2026-05-10",
    type: "Studio",
    status: "confirmed",
    amount: 200,
  },
  {
    id: 2,
    spaceId: 20,
    spaceName: "Beta Room",
    date: "2026-05-11",
    startDate: "2026-05-11",
    endDate: "2026-05-11",
    type: "Meeting Room",
    status: "pending",
    amount: 300,
  },
  {
    id: 3,
    spaceId: 30,
    spaceName: "Gamma Hall",
    date: "2026-05-12",
    startDate: "2026-05-12",
    endDate: "2026-05-12",
    type: "Event Space",
    status: "cancelled",
    amount: 400,
  },
];

test.describe("filterBookings (useBookingsFilters hook logic)", () => {
  test("filters by search text and status together", () => {
    const result = filterBookings({
      items: bookings,
      searchValue: "beta",
      selectedStatuses: ["pending"],
      startDate: "",
      endDate: "",
    });

    expect(result.map((item) => item.id)).toEqual([2]);
  });

  test("filters by start and end date range", () => {
    const result = filterBookings({
      items: bookings,
      searchValue: "",
      selectedStatuses: [],
      startDate: "2026-05-11",
      endDate: "2026-05-12",
    });

    expect(result.map((item) => item.id)).toEqual([2, 3]);
  });
});
