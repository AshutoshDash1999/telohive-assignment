export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: unknown;
}

export interface ApiFailure {
  success: false;
  error: ApiErrorPayload;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type SpaceSortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "capacity_desc";

export interface SpacesQueryParams {
  q: string;
  categories: string[];
  cities: string[];
  amenities: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minCapacity: number | null;
  maxCapacity: number | null;
  minRating: number | null;
  availabilityDate: string;
  sort: SpaceSortOption;
  page: number;
  pageSize: number;
}

export interface SpacesMeta {
  totalAll: number;
  filteredTotal: number;
  page: number;
  pageSize: number;
  totalPages: number;
  available: {
    categories: string[];
    cities: string[];
    amenities: string[];
    minPrice: number;
    maxPrice: number;
    minCapacity: number;
    maxCapacity: number;
  };
}
