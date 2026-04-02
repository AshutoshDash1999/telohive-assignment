import type { SpacesQueryParams } from "@/types/api";

export const DEFAULT_SPACES_QUERY: SpacesQueryParams = {
  q: "",
  categories: [],
  cities: [],
  amenities: [],
  minPrice: null,
  maxPrice: null,
  minCapacity: null,
  maxCapacity: null,
  minRating: null,
  availabilityDate: "",
  sort: "newest",
  page: 1,
  pageSize: 12,
};

function parseNumberOrNull(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseListFromSearchParams(searchParams: URLSearchParams, key: string) {
  return searchParams
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseListFromRecord(
  value: string | string[] | undefined,
  fallback: string[]
) {
  if (!value) {
    return fallback;
  }

  const list = Array.isArray(value) ? value : [value];
  return list
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function setListParam(params: URLSearchParams, key: string, values: string[]) {
  if (values.length === 0) {
    return;
  }

  params.set(key, values.join(","));
}

function parsePage(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parsePageSize(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 100 ? parsed : fallback;
}

export function parseSpacesQueryFromSearchParams(
  searchParams: URLSearchParams
): SpacesQueryParams {
  const q = searchParams.get("q")?.trim() ?? DEFAULT_SPACES_QUERY.q;
  const categories = parseListFromSearchParams(searchParams, "category");
  const cities = parseListFromSearchParams(searchParams, "city");
  const amenities = parseListFromSearchParams(searchParams, "amenity");
  const minPrice = parseNumberOrNull(searchParams.get("minPrice"));
  const maxPrice = parseNumberOrNull(searchParams.get("maxPrice"));
  const minCapacity = parseNumberOrNull(searchParams.get("minCapacity"));
  const maxCapacity = parseNumberOrNull(searchParams.get("maxCapacity"));
  const minRating = parseNumberOrNull(searchParams.get("minRating"));
  const availabilityDate =
    searchParams.get("availabilityDate")?.trim() ?? DEFAULT_SPACES_QUERY.availabilityDate;
  const sortCandidate = searchParams.get("sort");
  const sort =
    sortCandidate === "price_asc" ||
    sortCandidate === "price_desc" ||
    sortCandidate === "rating_desc" ||
    sortCandidate === "capacity_desc" ||
    sortCandidate === "newest"
      ? sortCandidate
      : DEFAULT_SPACES_QUERY.sort;

  const page = parsePage(searchParams.get("page"), DEFAULT_SPACES_QUERY.page);
  const pageSize = parsePageSize(
    searchParams.get("pageSize"),
    DEFAULT_SPACES_QUERY.pageSize
  );

  return {
    q,
    categories,
    cities,
    amenities,
    minPrice,
    maxPrice,
    minCapacity,
    maxCapacity,
    minRating,
    availabilityDate,
    sort,
    page,
    pageSize,
  };
}

export function parseSpacesQueryFromRecord(
  searchParams: Record<string, string | string[] | undefined>
): SpacesQueryParams {
  const q = searchParams.q?.toString().trim() ?? DEFAULT_SPACES_QUERY.q;
  const categories = parseListFromRecord(
    searchParams.category,
    DEFAULT_SPACES_QUERY.categories
  );
  const cities = parseListFromRecord(searchParams.city, DEFAULT_SPACES_QUERY.cities);
  const amenities = parseListFromRecord(
    searchParams.amenity,
    DEFAULT_SPACES_QUERY.amenities
  );
  const minPrice = parseNumberOrNull(searchParams.minPrice?.toString() ?? null);
  const maxPrice = parseNumberOrNull(searchParams.maxPrice?.toString() ?? null);
  const minCapacity = parseNumberOrNull(
    searchParams.minCapacity?.toString() ?? null
  );
  const maxCapacity = parseNumberOrNull(
    searchParams.maxCapacity?.toString() ?? null
  );
  const minRating = parseNumberOrNull(searchParams.minRating?.toString() ?? null);
  const availabilityDate =
    searchParams.availabilityDate?.toString().trim() ??
    DEFAULT_SPACES_QUERY.availabilityDate;
  const sortCandidate = searchParams.sort?.toString();
  const sort =
    sortCandidate === "price_asc" ||
    sortCandidate === "price_desc" ||
    sortCandidate === "rating_desc" ||
    sortCandidate === "capacity_desc" ||
    sortCandidate === "newest"
      ? sortCandidate
      : DEFAULT_SPACES_QUERY.sort;
  const page = parsePage(searchParams.page?.toString() ?? null, DEFAULT_SPACES_QUERY.page);
  const pageSize = parsePageSize(
    searchParams.pageSize?.toString() ?? null,
    DEFAULT_SPACES_QUERY.pageSize
  );

  return {
    q,
    categories,
    cities,
    amenities,
    minPrice,
    maxPrice,
    minCapacity,
    maxCapacity,
    minRating,
    availabilityDate,
    sort,
    page,
    pageSize,
  };
}

export function toSpacesSearchParams(query: SpacesQueryParams): URLSearchParams {
  const params = new URLSearchParams();

  if (query.q) {
    params.set("q", query.q);
  }

  setListParam(params, "category", query.categories);
  setListParam(params, "city", query.cities);
  setListParam(params, "amenity", query.amenities);

  if (query.minPrice !== null) {
    params.set("minPrice", String(query.minPrice));
  }

  if (query.maxPrice !== null) {
    params.set("maxPrice", String(query.maxPrice));
  }

  if (query.minCapacity !== null) {
    params.set("minCapacity", String(query.minCapacity));
  }

  if (query.maxCapacity !== null) {
    params.set("maxCapacity", String(query.maxCapacity));
  }

  if (query.minRating !== null) {
    params.set("minRating", String(query.minRating));
  }

  if (query.availabilityDate) {
    params.set("availabilityDate", query.availabilityDate);
  }

  if (query.sort !== DEFAULT_SPACES_QUERY.sort) {
    params.set("sort", query.sort);
  }

  if (query.page !== DEFAULT_SPACES_QUERY.page) {
    params.set("page", String(query.page));
  }

  if (query.pageSize !== DEFAULT_SPACES_QUERY.pageSize) {
    params.set("pageSize", String(query.pageSize));
  }

  return params;
}
