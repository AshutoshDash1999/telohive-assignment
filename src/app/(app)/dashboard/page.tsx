import { DashboardOverviewClient } from "./_components/DashboardOverviewClient";

export default function DashboardPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Activity summary, booking trends, and upcoming items.
      </p>
      <DashboardOverviewClient />
    </section>
  );
}
