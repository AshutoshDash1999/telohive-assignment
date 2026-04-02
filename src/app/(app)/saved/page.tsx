import { SavedCollectionClient } from "./_components/SavedCollectionClient";

export default function SavedPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-zinc-900">Saved</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Search, filter, and manage your saved spaces.
      </p>
      <SavedCollectionClient />
    </section>
  );
}
