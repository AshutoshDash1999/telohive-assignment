"use client";

import { SpaceCard } from "@/components/spaces/SpaceCard";
import type { Space } from "@/types/entities";

interface SavedSpacesGridProps {
  spaces: Space[];
  onRemove: (spaceId: number) => void;
}

export function SavedSpacesGrid({ spaces, onRemove }: SavedSpacesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {spaces.map((space) => (
        <SpaceCard
          key={space.id}
          space={space}
          actionLabel="Remove"
          actionAriaLabel="Remove from saved"
          actionClassName="rounded bg-rose-100 px-2 py-1 text-sm text-rose-700 transition hover:bg-rose-200"
          onAction={onRemove}
        />
      ))}
    </div>
  );
}
