"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const SAVED_SPACES_STORAGE_KEY = "th:saved:spaces:v1";

interface SavedSpacesState {
  savedSpaceIds: number[];
  toggleSavedSpace: (spaceId: number) => void;
  removeSavedSpace: (spaceId: number) => void;
}

export const useSavedSpacesStore = create<SavedSpacesState>()(
  persist(
    (set) => ({
      savedSpaceIds: [],
      toggleSavedSpace: (spaceId) => {
        set((current) => {
          if (current.savedSpaceIds.includes(spaceId)) {
            return {
              savedSpaceIds: current.savedSpaceIds.filter((id) => id !== spaceId),
            };
          }

          return {
            savedSpaceIds: [...current.savedSpaceIds, spaceId].toSorted((a, b) => a - b),
          };
        });
      },
      removeSavedSpace: (spaceId) => {
        set((current) => ({
          savedSpaceIds: current.savedSpaceIds.filter((id) => id !== spaceId),
        }));
      },
    }),
    {
      name: SAVED_SPACES_STORAGE_KEY,
      storage: createJSONStorage(() => window.localStorage),
    }
  )
);
