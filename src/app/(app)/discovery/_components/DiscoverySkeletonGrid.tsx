"use client";

interface DiscoverySkeletonGridProps {
  count?: number;
}

export function DiscoverySkeletonGrid({ count = 6 }: DiscoverySkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <article
          key={`space-skeleton-${index}`}
          className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
        >
          <div className="h-40 w-full animate-pulse bg-zinc-100" />

          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-zinc-100" />
                <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
              </div>
              <div className="h-7 w-16 animate-pulse rounded bg-zinc-100" />
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-100" />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="h-5 w-20 animate-pulse rounded bg-zinc-100" />
              <div className="h-5 w-16 animate-pulse rounded bg-zinc-100" />
              <div className="h-5 w-24 animate-pulse rounded bg-zinc-100" />
            </div>

            <div className="flex flex-wrap gap-1">
              <div className="h-5 w-16 animate-pulse rounded bg-zinc-100" />
              <div className="h-5 w-20 animate-pulse rounded bg-zinc-100" />
              <div className="h-5 w-14 animate-pulse rounded bg-zinc-100" />
            </div>

            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
              <div className="h-7 w-20 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
