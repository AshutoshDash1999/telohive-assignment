"use client";

import type { SpacesMeta, SpacesQueryParams } from "@/types/api";
import type { FilterSectionKey } from "./filterSections";

interface FiltersSectionContentProps {
  section: FilterSectionKey;
  activeFilterValues: SpacesQueryParams;
  availableCategories: string[];
  availableCities: string[];
  availableAmenities: string[];
  availableMeta: SpacesMeta["available"] | undefined;
  onToggleMultiSelect: (
    key: "categories" | "cities" | "amenities",
    value: string
  ) => void;
  onSetDraftMinPrice: (value: string) => void;
  onSetDraftMaxPrice: (value: string) => void;
  onSetDraftMinCapacity: (value: string) => void;
  onSetDraftMaxCapacity: (value: string) => void;
  onSetDraftMinRating: (value: string) => void;
  onSetDraftAvailabilityDate: (value: string) => void;
}

export function FiltersSectionContent({
  section,
  activeFilterValues,
  availableCategories,
  availableCities,
  availableAmenities,
  availableMeta,
  onToggleMultiSelect,
  onSetDraftMinPrice,
  onSetDraftMaxPrice,
  onSetDraftMinCapacity,
  onSetDraftMaxCapacity,
  onSetDraftMinRating,
  onSetDraftAvailabilityDate,
}: FiltersSectionContentProps) {
  switch (section) {
    case "category":
      return (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-zinc-500">Category</p>
          {availableCategories.map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={activeFilterValues.categories.includes(category)}
                onChange={() => onToggleMultiSelect("categories", category)}
              />
              {category}
            </label>
          ))}
        </div>
      );
    case "city":
      return (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-zinc-500">City</p>
          {availableCities.map((city) => (
            <label key={city} className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={activeFilterValues.cities.includes(city)}
                onChange={() => onToggleMultiSelect("cities", city)}
              />
              {city}
            </label>
          ))}
        </div>
      );
    case "amenities":
      return (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-zinc-500">Amenities</p>
          <div className="grid grid-cols-1 gap-1">
            {availableAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={activeFilterValues.amenities.includes(amenity)}
                  onChange={() => onToggleMultiSelect("amenities", amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>
      );
    case "price":
      return (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-zinc-500">Price Range</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="number"
              inputMode="numeric"
              value={activeFilterValues.minPrice ?? ""}
              min={availableMeta?.minPrice ?? 0}
              max={availableMeta?.maxPrice ?? 10000}
              placeholder={`Min (${availableMeta?.minPrice ?? 0})`}
              onChange={(event) => onSetDraftMinPrice(event.target.value)}
              className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
            />
            <input
              type="number"
              inputMode="numeric"
              value={activeFilterValues.maxPrice ?? ""}
              min={availableMeta?.minPrice ?? 0}
              max={availableMeta?.maxPrice ?? 10000}
              placeholder={`Max (${availableMeta?.maxPrice ?? 0})`}
              onChange={(event) => onSetDraftMaxPrice(event.target.value)}
              className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
            />
          </div>
        </div>
      );
    case "capacity":
      return (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-zinc-500">Capacity</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="number"
              inputMode="numeric"
              value={activeFilterValues.minCapacity ?? ""}
              min={availableMeta?.minCapacity ?? 0}
              max={availableMeta?.maxCapacity ?? 500}
              placeholder="Min"
              onChange={(event) => onSetDraftMinCapacity(event.target.value)}
              className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
            />
            <input
              type="number"
              inputMode="numeric"
              value={activeFilterValues.maxCapacity ?? ""}
              min={availableMeta?.minCapacity ?? 0}
              max={availableMeta?.maxCapacity ?? 500}
              placeholder="Max"
              onChange={(event) => onSetDraftMaxCapacity(event.target.value)}
              className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
            />
          </div>
        </div>
      );
    case "rating":
      return (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-zinc-500">Minimum Rating</p>
          <select
            value={activeFilterValues.minRating ?? ""}
            onChange={(event) => onSetDraftMinRating(event.target.value)}
            className="w-full max-w-xs rounded border border-zinc-300 px-2 py-1 text-sm"
          >
            <option value="">Any rating</option>
            <option value="1">1+ stars</option>
            <option value="2">2+ stars</option>
            <option value="3">3+ stars</option>
            <option value="4">4+ stars</option>
            <option value="4.5">4.5+ stars</option>
          </select>
        </div>
      );
    case "availability":
      return (
        <div className="space-y-2">
          <label
            htmlFor="availabilityDate"
            className="text-xs font-semibold uppercase text-zinc-500"
          >
            Availability Date (optional)
          </label>
          <input
            id="availabilityDate"
            type="date"
            value={activeFilterValues.availabilityDate}
            onChange={(event) => onSetDraftAvailabilityDate(event.target.value)}
            className="w-full max-w-xs rounded border border-zinc-300 px-2 py-1 text-sm"
          />
          <p className="text-xs text-zinc-500">
            Date is URL-synced and UI-ready, but not applied in mock API filtering yet.
          </p>
        </div>
      );
    default: {
      const exhaustiveCheck: never = section;
      return exhaustiveCheck;
    }
  }
}
