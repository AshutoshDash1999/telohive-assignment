import { BookingsTableClient } from "./_components/BookingsTableClient";

export default function BookingsPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-zinc-900">Bookings</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Search, filter, sort, and manage your booking history.
      </p>
      <BookingsTableClient />
    </section>
  );
}
