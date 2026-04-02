"use client";

export type FilterSectionKey =
  | "category"
  | "city"
  | "amenities"
  | "price"
  | "capacity"
  | "rating"
  | "availability";

export const FILTER_SECTIONS: Array<{ key: FilterSectionKey; label: string }> = [
  { key: "category", label: "Category" },
  { key: "city", label: "City" },
  { key: "amenities", label: "Amenities" },
  { key: "price", label: "Price Range" },
  { key: "capacity", label: "Capacity" },
  { key: "rating", label: "Minimum Rating" },
  { key: "availability", label: "Availability Date" },
];
