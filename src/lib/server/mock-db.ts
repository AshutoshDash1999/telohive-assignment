import { promises as fs } from "node:fs";
import path from "node:path";

import type { Booking, BookingStatus, MockDb, SavedItem, Space, SpaceCategory } from "@/types/entities";

const DB_PATH = path.join(process.cwd(), "db.json");

const CITIES = [
  "New York",
  "San Francisco",
  "Austin",
  "Seattle",
  "Boston",
  "Chicago",
  "Denver",
  "Los Angeles",
  "Miami",
  "Portland",
] as const;

const CATEGORIES: SpaceCategory[] = [
  "Coworking",
  "Meeting Room",
  "Private Office",
  "Event Space",
  "Studio",
];

const AMENITIES = [
  "WiFi",
  "Parking",
  "Coffee",
  "Projector",
  "Whiteboard",
  "Pet Friendly",
  "24/7 Access",
  "Phone Booth",
  "Kitchen",
  "Air Conditioning",
];

const PREFIXES = [
  "Nimbus",
  "Atlas",
  "Vertex",
  "Pulse",
  "Lumen",
  "Orbit",
  "Harbor",
  "Summit",
  "Nova",
  "Cedar",
];

const SUFFIXES = [
  "Hub",
  "Loft",
  "Suite",
  "Collective",
  "Works",
  "Commons",
  "Studio",
  "Point",
  "Space",
  "Center",
];

const BOOKING_STATUSES: BookingStatus[] = ["confirmed", "pending", "cancelled"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function sampleItems<T>(items: readonly T[], count: number): T[] {
  const copy = [...items];
  const out: T[] = [];

  while (out.length < count && copy.length > 0) {
    out.push(copy.splice(randomInt(0, copy.length - 1), 1)[0]);
  }

  return out;
}

function addDays(isoDate: string, days: number) {
  const date = new Date(isoDate);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

function generateSpaces(total = 520): Space[] {
  const spaces: Space[] = [];

  for (let i = 1; i <= total; i += 1) {
    const city = randomItem(CITIES);
    const category = randomItem(CATEGORIES);
    const capacity = randomInt(2, 120);

    spaces.push({
      id: i,
      name: `${randomItem(PREFIXES)} ${randomItem(SUFFIXES)} ${i}`,
      city,
      category,
      pricePerDay: randomInt(35, 420),
      capacity,
      rating: Number((3.2 + Math.random() * 1.8).toFixed(1)),
      amenities: sampleItems(AMENITIES, randomInt(3, 6)),
      imageUrl: `https://picsum.photos/seed/space-${i}/800/500`,
      description: `${category} in ${city} with capacity for ${capacity} people.`,
    });
  }

  return spaces;
}

function generateBookings(spaces: Space[], total = 25): Booking[] {
  const bookings: Booking[] = [];
  const baseDate = "2026-01-01";

  for (let i = 1; i <= total; i += 1) {
    const space = randomItem(spaces);
    const startOffset = randomInt(0, 180);
    const durationDays = randomInt(1, 5);
    const startDate = addDays(baseDate, startOffset);
    const endDate = addDays(startDate, durationDays);

    bookings.push({
      id: i,
      spaceId: space.id,
      userId: `user-${randomInt(1, 8)}`,
      startDate,
      endDate,
      totalPrice: space.pricePerDay * durationDays,
      status: randomItem(BOOKING_STATUSES),
      createdAt: addDays(startDate, -randomInt(1, 14)),
    });
  }

  return bookings;
}

function generateSaved(spaces: Space[], total = 40): SavedItem[] {
  const saved: SavedItem[] = [];
  const baseDate = "2026-01-01";

  for (let i = 1; i <= total; i += 1) {
    saved.push({
      id: i,
      userId: `user-${randomInt(1, 8)}`,
      spaceId: randomItem(spaces).id,
      savedAt: addDays(baseDate, randomInt(0, 180)),
    });
  }

  return saved;
}

export function createSeedData(): MockDb {
  const spaces = generateSpaces(520);
  const bookings = generateBookings(spaces, 25);
  const saved = generateSaved(spaces, 40);

  return { spaces, bookings, saved };
}

async function writeDb(data: MockDb) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function readDb(): Promise<MockDb> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<MockDb>;

    const spaces = Array.isArray(parsed.spaces) ? parsed.spaces : [];
    const bookings = Array.isArray(parsed.bookings) ? parsed.bookings : [];
    const saved = Array.isArray(parsed.saved) ? parsed.saved : [];

    // Auto-heal an empty dataset so APIs are usable immediately.
    if (spaces.length < 500) {
      const seeded = createSeedData();
      await writeDb(seeded);
      return seeded;
    }

    return { spaces, bookings, saved } as MockDb;
  } catch {
    const seeded = createSeedData();
    await writeDb(seeded);
    return seeded;
  }
}

export async function updateDb(
  updater: (current: MockDb) => MockDb
): Promise<MockDb> {
  const current = await readDb();
  const next = updater(current);
  await writeDb(next);
  return next;
}
