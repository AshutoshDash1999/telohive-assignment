"use client";

interface ActiveChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFilterChipsProps {
  searchQuery: string;
  chips: ActiveChip[];
  onRemoveSearch: () => void;
}

export function ActiveFilterChips({
  searchQuery,
  chips,
  onRemoveSearch,
}: ActiveFilterChipsProps) {
  if (!searchQuery && chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {searchQuery ? (
        <button
          type="button"
          className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-700"
          onClick={onRemoveSearch}
        >
          Search: {searchQuery} ✕
        </button>
      ) : null}

      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-700"
          onClick={chip.onRemove}
        >
          {chip.label} ✕
        </button>
      ))}
    </div>
  );
}
