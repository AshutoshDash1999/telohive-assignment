import type { Space } from "@/types/entities";
import type { SpacesMeta, SpacesQueryParams } from "@/types/api";

interface SpacesQueryResult {
  items: Space[];
  meta: SpacesMeta;
}

function sortSpaces(items: Space[], sort: SpacesQueryParams["sort"]) {
  switch (sort) {
    case "price_asc":
      return items.toSorted((a, b) => a.pricePerDay - b.pricePerDay || b.id - a.id);
    case "price_desc":
      return items.toSorted((a, b) => b.pricePerDay - a.pricePerDay || b.id - a.id);
    case "rating_desc":
      return items.toSorted((a, b) => b.rating - a.rating || b.id - a.id);
    case "capacity_desc":
      return items.toSorted((a, b) => b.capacity - a.capacity || b.id - a.id);
    case "newest":
      return items.toSorted((a, b) => b.id - a.id);
    default: {
      const _never: never = sort;
      void _never;
      return items;
    }
  }
}

export function querySpaces(allSpaces: Space[], query: SpacesQueryParams): SpacesQueryResult {
  const lowerQ = query.q.toLowerCase();
  const categorySet = new Set(query.categories.map((item) => item.toLowerCase()));
  const citySet = new Set(query.cities.map((item) => item.toLowerCase()));
  const amenitySet = new Set(query.amenities.map((item) => item.toLowerCase()));

  const filtered = allSpaces.filter((space) => {
    const matchesQuery =
      lowerQ.length === 0 ||
      space.name.toLowerCase().includes(lowerQ) ||
      space.city.toLowerCase().includes(lowerQ) ||
      space.description.toLowerCase().includes(lowerQ);
    const matchesCategory =
      categorySet.size === 0 || categorySet.has(space.category.toLowerCase());
    const matchesCity = citySet.size === 0 || citySet.has(space.city.toLowerCase());
    const matchesAmenities =
      amenitySet.size === 0 ||
      [...amenitySet].every((amenity) =>
        space.amenities.some((spaceAmenity) => spaceAmenity.toLowerCase() === amenity)
      );
    const matchesMinPrice =
      query.minPrice === null || space.pricePerDay >= query.minPrice;
    const matchesMaxPrice =
      query.maxPrice === null || space.pricePerDay <= query.maxPrice;
    const matchesMinCapacity =
      query.minCapacity === null || space.capacity >= query.minCapacity;
    const matchesMaxCapacity =
      query.maxCapacity === null || space.capacity <= query.maxCapacity;
    const matchesMinRating = query.minRating === null || space.rating >= query.minRating;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesCity &&
      matchesAmenities &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesMinCapacity &&
      matchesMaxCapacity &&
      matchesMinRating
    );
  });

  const sorted = sortSpaces(filtered, query.sort);
  const filteredTotal = sorted.length;
  const totalPages = Math.max(1, Math.ceil(filteredTotal / query.pageSize));
  const page = Math.min(query.page, totalPages);
  const start = (page - 1) * query.pageSize;
  const end = start + query.pageSize;
  const items = sorted.slice(start, end);

  const prices = allSpaces.map((space) => space.pricePerDay);
  const capacities = allSpaces.map((space) => space.capacity);

  const meta: SpacesMeta = {
    totalAll: allSpaces.length,
    filteredTotal,
    page,
    pageSize: query.pageSize,
    totalPages,
    available: {
      categories: [...new Set(allSpaces.map((space) => space.category))].toSorted(),
      cities: [...new Set(allSpaces.map((space) => space.city))].toSorted(),
      amenities: [...new Set(allSpaces.flatMap((space) => space.amenities))].toSorted(),
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      minCapacity: capacities.length ? Math.min(...capacities) : 0,
      maxCapacity: capacities.length ? Math.max(...capacities) : 0,
    },
  };

  return { items, meta };
}
