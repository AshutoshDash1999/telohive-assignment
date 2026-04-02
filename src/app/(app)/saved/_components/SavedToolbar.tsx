"use client";

interface SavedToolbarProps {
  searchValue: string;
  selectedCategory: string;
  selectedCity: string;
  categories: string[];
  cities: string[];
  resultsCount: number;
  totalSavedCount: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onClearFilters: () => void;
}

export function SavedToolbar({
  searchValue,
  selectedCategory,
  selectedCity,
  categories,
  cities,
  resultsCount,
  totalSavedCount,
  onSearchChange,
  onCategoryChange,
  onCityChange,
  onClearFilters,
}: SavedToolbarProps) {
  const hasFilters = searchValue.length > 0 || selectedCategory.length > 0 || selectedCity.length > 0;

  return (
    <div
      className="rounded-xl border border-zinc-200 bg-white p-4"
      data-testid="saved-toolbar"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label htmlFor="saved-search" className="mb-1 block text-xs font-semibold uppercase text-zinc-500">
            Search saved
          </label>
          <input
            id="saved-search"
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, city, or description"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
            data-testid="saved-search-input"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-104">
          <div>
            <label
              htmlFor="saved-category"
              className="mb-1 block text-xs font-semibold uppercase text-zinc-500"
            >
              Category
            </label>
            <select
              id="saved-category"
              value={selectedCategory}
              onChange={(event) => onCategoryChange(event.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              data-testid="saved-category-select"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="saved-city" className="mb-1 block text-xs font-semibold uppercase text-zinc-500">
              City
            </label>
            <select
              id="saved-city"
              value={selectedCity}
              onChange={(event) => onCityChange(event.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              data-testid="saved-city-select"
            >
              <option value="">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-zinc-600">
        <p>
          Showing {resultsCount} of {totalSavedCount} saved spaces
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded px-2 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
            data-testid="saved-clear-filters-button"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
