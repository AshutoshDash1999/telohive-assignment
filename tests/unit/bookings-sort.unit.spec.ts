import { expect, test } from "@playwright/test";

import { applySort } from "../../src/app/(app)/bookings/_components/bookings-table-utils";
import type { BookingListItem } from "../../src/lib/api/bookings";

const rows: BookingListItem[] = [
  {
    id: 101,
    spaceId: 1,
    spaceName: "Zen Room",
    date: "2026-01-10",
    startDate: "2026-01-10",
    endDate: "2026-01-10",
    type: "Meeting Room",
    status: "confirmed",
    amount: 300,
  },
  {
    id: 102,
    spaceId: 2,
    spaceName: "Alpha Hall",
    date: "2026-01-09",
    startDate: "2026-01-09",
    endDate: "2026-01-09",
    type: "Event Space",
    status: "pending",
    amount: 300,
  },
  {
    id: 103,
    spaceId: 3,
    spaceName: "Beta Studio",
    date: "2026-01-11",
    startDate: "2026-01-11",
    endDate: "2026-01-11",
    type: "Studio",
    status: "cancelled",
    amount: 150,
  },
];

test.describe("applySort", () => {
  test("sorts ascending by space name", () => {
    const sorted = applySort(rows, "spaceName", "asc");
    expect(sorted.map((row) => row.spaceName)).toEqual([
      "Alpha Hall",
      "Beta Studio",
      "Zen Room",
    ]);
  });

  test("sorts descending by amount with deterministic id tie-break", () => {
    const sorted = applySort(rows, "amount", "desc");
    expect(sorted.map((row) => row.id)).toEqual([101, 102, 103]);
  });

  test("sorts descending by startDate", () => {
    const sorted = applySort(rows, "startDate", "desc");
    expect(sorted.map((row) => row.startDate)).toEqual([
      "2026-01-11",
      "2026-01-10",
      "2026-01-09",
    ]);
  });
});
