import { apiError, apiSuccess } from "@/lib/api/response";
import { readDb } from "@/lib/server/mock-db";

export async function GET(request: Request) {
  try {
    const db = await readDb();
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q")?.toLowerCase().trim();
    const city = searchParams.get("city")?.toLowerCase();
    const category = searchParams.get("category")?.toLowerCase();
    const minPrice = Number(searchParams.get("minPrice") ?? "0");
    const maxPrice = Number(searchParams.get("maxPrice") ?? "999999");
    const minCapacity = Number(searchParams.get("minCapacity") ?? "0");
    const minRating = Number(searchParams.get("minRating") ?? "0");
    const amenities = (searchParams.get("amenities") ?? "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    const filtered = db.spaces.filter((space) => {
      const matchesQuery =
        !q ||
        space.name.toLowerCase().includes(q) ||
        space.city.toLowerCase().includes(q) ||
        space.description.toLowerCase().includes(q);

      const matchesCity = !city || space.city.toLowerCase() === city;
      const matchesCategory =
        !category || space.category.toLowerCase() === category;
      const matchesPrice =
        space.pricePerDay >= minPrice && space.pricePerDay <= maxPrice;
      const matchesCapacity = space.capacity >= minCapacity;
      const matchesRating = space.rating >= minRating;
      const matchesAmenities =
        amenities.length === 0 ||
        amenities.every((amenity) =>
          space.amenities.some((spaceAmenity) =>
            spaceAmenity.toLowerCase().includes(amenity)
          )
        );

      return (
        matchesQuery &&
        matchesCity &&
        matchesCategory &&
        matchesPrice &&
        matchesCapacity &&
        matchesRating &&
        matchesAmenities
      );
    });

    return apiSuccess(filtered, 200, { total: filtered.length });
  } catch (error) {
    return apiError("SPACES_FETCH_FAILED", "Failed to fetch spaces", 500, error);
  }
}
