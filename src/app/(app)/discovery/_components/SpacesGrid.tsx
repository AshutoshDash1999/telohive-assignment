"use client";

import Image from "next/image";

import type { Space } from "@/types/entities";

interface SpacesGridProps {
  spaces: Space[];
  savedIds: Set<number>;
  onToggleSave: (spaceId: number) => void;
}

function toCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function SpacesGrid({ spaces, savedIds, onToggleSave }: SpacesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {spaces.map((space) => {
        const isSaved = savedIds.has(space.id);

        return (
          <article
            key={space.id}
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
          >
            <Image
              src={space.imageUrl}
              alt={space.name}
              width={800}
              height={500}
              className="h-40 w-full object-cover"
              unoptimized
            />

            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900">{space.name}</h3>
                  <p className="text-sm text-zinc-600">{space.city}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleSave(space.id)}
                  aria-label={isSaved ? "Unsave space" : "Save space"}
                  className={`rounded px-2 py-1 text-sm transition ${
                    isSaved ? "bg-rose-100 text-rose-700" : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {isSaved ? "♥ Saved" : "♡ Save"}
                </button>
              </div>

              <p className="line-clamp-2 text-sm text-zinc-600">{space.description}</p>

              <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
                <span className="rounded bg-zinc-100 px-2 py-1">{space.category}</span>
                <span className="rounded bg-zinc-100 px-2 py-1">★ {space.rating.toFixed(1)}</span>
                <span className="rounded bg-zinc-100 px-2 py-1">Capacity {space.capacity}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {space.amenities.slice(0, 3).map((amenity) => (
                  <span
                    key={`${space.id}-${amenity}`}
                    className="rounded border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-900">
                  {toCurrency(space.pricePerDay)} / day
                </p>
                <button
                  type="button"
                  className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800"
                >
                  View details
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
