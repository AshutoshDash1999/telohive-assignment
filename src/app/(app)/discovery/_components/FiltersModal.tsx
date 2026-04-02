"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import { FILTER_SECTIONS, type FilterSectionKey } from "./filterSections";

interface FiltersModalProps {
  isOpen: boolean;
  activeFilterSection: FilterSectionKey;
  onSelectSection: (section: FilterSectionKey) => void;
  onClose: () => void;
  onClearAll: () => void;
  onApply: () => void;
  renderSectionContent: (section: FilterSectionKey) => ReactNode;
}

export function FiltersModal({
  isOpen,
  activeFilterSection,
  onSelectSection,
  onClose,
  onClearAll,
  onApply,
  renderSectionContent,
}: FiltersModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4"
      data-testid="discovery-filters-modal"
    >
      <div className="flex h-[80vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <h2 className="text-base font-semibold text-zinc-900">Filters (AND logic)</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100"
            data-testid="discovery-filters-close-button"
          >
            Close
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="w-52 border-r border-zinc-200 bg-zinc-50 p-2">
            <nav className="space-y-1">
              {FILTER_SECTIONS.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => onSelectSection(section.key)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                    activeFilterSection === section.key
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                  data-testid={`discovery-filter-section-${section.key}`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {renderSectionContent(activeFilterSection)}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100"
            data-testid="discovery-clear-filters-button"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onApply}
            className="rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            data-testid="discovery-apply-filters-button"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}
