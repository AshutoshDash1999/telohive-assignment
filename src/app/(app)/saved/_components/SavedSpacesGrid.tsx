"use client";

import Image from "next/image";

import type { Space } from "@/types/entities";

interface SavedSpacesGridProps {
  spaces: Space[];
  onRemove: (spaceId: number) => void;
}

function toCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function SavedSpacesGrid({ spaces, onRemove }: SavedSpacesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {spaces.map((space) => (
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
                onClick={() => onRemove(space.id)}
                aria-label="Remove from saved"
                className="rounded bg-rose-100 px-2 py-1 text-sm text-rose-700 transition hover:bg-rose-200"
              >
                Remove
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

            <p className="text-sm font-semibold text-zinc-900">{toCurrency(space.pricePerDay)} / day</p>
          </div>
        </article>
      ))}
    </div>
  );
}
