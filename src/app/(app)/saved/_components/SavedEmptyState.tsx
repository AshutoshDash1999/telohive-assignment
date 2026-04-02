"use client";

import { Link } from "next-view-transitions";

interface SavedEmptyStateProps {
  hasSavedSpaces: boolean;
}

export function SavedEmptyState({ hasSavedSpaces }: SavedEmptyStateProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-zinc-900">
        {hasSavedSpaces ? "No saved spaces match this filter" : "No saved spaces yet"}
      </h2>
      <p className="mt-2 text-sm text-zinc-600">
        {hasSavedSpaces
          ? "Try adjusting your search or filters to find your saved spaces."
          : "Save spaces from Discovery to quickly access them here."}
      </p>
      <Link
        href="/discovery"
        className="mt-4 inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        Go to Discovery
      </Link>
    </div>
  );
}
