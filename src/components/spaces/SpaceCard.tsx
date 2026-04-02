"use client";

import Image from "next/image";

import { formatUsdCurrency } from "@/lib/format/currency";
import type { Space } from "@/types/entities";

interface SpaceCardProps {
  space: Space;
  actionLabel: string;
  actionAriaLabel: string;
  actionClassName: string;
  onAction: (spaceId: number) => void;
  secondaryAction?: {
    label: string;
    onClick?: (spaceId: number) => void;
    className: string;
  };
}

export function SpaceCard({
  space,
  actionLabel,
  actionAriaLabel,
  actionClassName,
  onAction,
  secondaryAction,
}: SpaceCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
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
            onClick={() => onAction(space.id)}
            aria-label={actionAriaLabel}
            className={actionClassName}
          >
            {actionLabel}
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
            {formatUsdCurrency(space.pricePerDay)} / day
          </p>
          {secondaryAction ? (
            <button
              type="button"
              onClick={
                secondaryAction.onClick
                  ? () => secondaryAction.onClick?.(space.id)
                  : undefined
              }
              className={secondaryAction.className}
            >
              {secondaryAction.label}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
