"use client";

import { SequentialReveal } from "@/components/animation/SequentialReveal";
import { SpaceCard } from "@/components/spaces/SpaceCard";
import type { Space } from "@/types/entities";

interface SpacesGridProps {
  spaces: Space[];
  savedIds: Set<number>;
  onToggleSave: (spaceId: number) => void;
}

export function SpacesGrid({ spaces, savedIds, onToggleSave }: SpacesGridProps) {
  return (
    <SequentialReveal
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {spaces.map((space) => {
        const isSaved = savedIds.has(space.id);
        return (
          <div key={space.id}>
            <SpaceCard
              space={space}
              actionLabel={isSaved ? "♥ Saved" : "♡ Save"}
              actionAriaLabel={isSaved ? "Unsave space" : "Save space"}
              actionClassName={`rounded px-2 py-1 text-sm transition ${
                isSaved ? "bg-rose-100 text-rose-700" : "bg-zinc-100 text-zinc-700"
              }`}
              onAction={onToggleSave}
              secondaryAction={{
                label: "View details",
                onClick: () => undefined,
                className:
                  "rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800",
              }}
            />
          </div>
        );
      })}
    </SequentialReveal>
  );
}
