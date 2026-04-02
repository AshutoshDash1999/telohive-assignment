import fs from "node:fs/promises";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "db.json");

const cities = [
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
];

const categories = [
  "Coworking",
  "Meeting Room",
  "Private Office",
  "Event Space",
  "Studio",
];

const amenities = [
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

const prefixes = [
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

const suffixes = [
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

const bookingStatuses = ["confirmed", "pending", "cancelled"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(list) {
  return list[randomInt(0, list.length - 1)];
}

function sampleItems(list, count) {
  const copy = [...list];
  const result = [];

  while (result.length < count && copy.length > 0) {
    result.push(copy.splice(randomInt(0, copy.length - 1), 1)[0]);
  }

  return result;
}

function addDays(isoDate, days) {
  const date = new Date(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function generateSpaces(total = 520) {
  const result = [];

  for (let id = 1; id <= total; id += 1) {
    const city = randomItem(cities);
    const category = randomItem(categories);
    const capacity = randomInt(2, 120);

    result.push({
      id,
      name: `${randomItem(prefixes)} ${randomItem(suffixes)} ${id}`,
      city,
      category,
      pricePerDay: randomInt(35, 420),
      capacity,
      rating: Number((3.2 + Math.random() * 1.8).toFixed(1)),
      amenities: sampleItems(amenities, randomInt(3, 6)),
      imageUrl: `https://picsum.photos/seed/space-${id}/800/500`,
      description: `${category} in ${city} with capacity for ${capacity} people.`,
    });
  }

  return result;
}

function generateBookings(spaces, total = 25) {
  const result = [];
  const baseDate = "2026-01-01";

  for (let id = 1; id <= total; id += 1) {
    const space = randomItem(spaces);
    const startDate = addDays(baseDate, randomInt(0, 180));
    const durationDays = randomInt(1, 5);

    result.push({
      id,
      spaceId: space.id,
      userId: `user-${randomInt(1, 8)}`,
      startDate,
      endDate: addDays(startDate, durationDays),
      totalPrice: space.pricePerDay * durationDays,
      status: randomItem(bookingStatuses),
      createdAt: addDays(startDate, -randomInt(1, 14)),
    });
  }

  return result;
}

function generateSaved(spaces, total = 40) {
  const result = [];
  const baseDate = "2026-01-01";

  for (let id = 1; id <= total; id += 1) {
    result.push({
      id,
      userId: `user-${randomInt(1, 8)}`,
      spaceId: randomItem(spaces).id,
      savedAt: addDays(baseDate, randomInt(0, 180)),
    });
  }

  return result;
}

async function run() {
  const spaces = generateSpaces(520);
  const bookings = generateBookings(spaces, 25);
  const saved = generateSaved(spaces, 40);

  await fs.writeFile(
    DB_PATH,
    JSON.stringify({ spaces, bookings, saved }, null, 2),
    "utf-8"
  );

  console.log("Seeded db.json with 520 spaces, 25 bookings, and 40 saved items.");
}

run();
