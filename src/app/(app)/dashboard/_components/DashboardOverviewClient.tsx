"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useSavedSpacesStore } from "@/store/saved-spaces-store";
import { DashboardStatGrid } from "./DashboardStatGrid";

type BookingStatus = "Confirmed" | "Pending" | "Unread";

interface ActivityPoint {
  month: string;
  bookings: number;
}

interface GeoTagPoint {
  month: string;
  downtown: number;
  waterfront: number;
  midtown: number;
}

interface DemographicPoint {
  segment: string;
  value: number;
}

interface UpcomingBooking {
  id: string;
  spaceName: string;
  date: string;
  status: BookingStatus;
}

const MONTHLY_ACTIVITY: ActivityPoint[] = [
  { month: "Jan", bookings: 2 },
  { month: "Feb", bookings: 3 },
  { month: "Mar", bookings: 4 },
  { month: "Apr", bookings: 5 },
  { month: "May", bookings: 3 },
  { month: "Jun", bookings: 6 },
];

const GEOTAG_ACTIVITY: GeoTagPoint[] = [
  { month: "Jan", downtown: 18, waterfront: 11, midtown: 14 },
  { month: "Feb", downtown: 22, waterfront: 13, midtown: 16 },
  { month: "Mar", downtown: 26, waterfront: 17, midtown: 19 },
  { month: "Apr", downtown: 24, waterfront: 18, midtown: 21 },
  { month: "May", downtown: 29, waterfront: 21, midtown: 24 },
  { month: "Jun", downtown: 33, waterfront: 23, midtown: 26 },
];

const DEMOGRAPHIC_DATA: DemographicPoint[] = [
  { segment: "Founders", value: 74 },
  { segment: "Freelancers", value: 68 },
  { segment: "Remote Teams", value: 81 },
  { segment: "Agencies", value: 57 },
  { segment: "Students", value: 44 },
  { segment: "Enterprise", value: 62 },
];

const UPCOMING_BOOKINGS: UpcomingBooking[] = [
  {
    id: "bk-1001",
    spaceName: "Skyline Co-working Hub",
    date: "Apr 06, 2026",
    status: "Confirmed",
  },
  {
    id: "bk-1002",
    spaceName: "Bayside Creative Loft",
    date: "Apr 11, 2026",
    status: "Pending",
  },
  {
    id: "bk-1003",
    spaceName: "North Point Meeting Room",
    date: "Apr 19, 2026",
    status: "Unread",
  },
];

function getStatusClassName(status: BookingStatus) {
  switch (status) {
    case "Confirmed":
      return "bg-emerald-100 text-emerald-700";
    case "Pending":
      return "bg-amber-100 text-amber-700";
    case "Unread":
      return "bg-blue-100 text-blue-700";
    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

export function DashboardOverviewClient() {
  const savedSpacesCount = useSavedSpacesStore((state) => state.savedSpaceIds.length);

  return (
    <div className="mt-6 space-y-6">
      <DashboardStatGrid savedSpacesCount={savedSpacesCount} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm xl:col-span-2">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-zinc-900">Monthly Booking Activity</h2>
            <p className="mt-1 text-sm text-zinc-600">Bookings trend over the last 6 months.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={MONTHLY_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="month" stroke="#71717a" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} stroke="#71717a" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #e4e4e7",
                    backgroundColor: "#ffffff",
                    color: "#18181b",
                  }}
                />
                <Bar dataKey="bookings" fill="#18181b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-zinc-900">Upcoming Bookings</h2>
          <p className="mt-1 text-sm text-zinc-600">Next 3 planned items and their status.</p>

          <ul className="mt-4 space-y-3">
            {UPCOMING_BOOKINGS.map((booking) => (
              <li
                key={booking.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"
              >
                <p className="text-sm font-medium text-zinc-900">{booking.spaceName}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-zinc-600">{booking.date}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClassName(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm xl:col-span-2">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-zinc-900">GeoTag Engagement Area</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Engagement split by location geotags across recent months.
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <AreaChart data={GEOTAG_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="month" stroke="#71717a" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} stroke="#71717a" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #e4e4e7",
                    backgroundColor: "#ffffff",
                    color: "#18181b",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="downtown"
                  stackId="1"
                  stroke="#18181b"
                  fill="#18181b"
                  fillOpacity={0.6}
                  name="Downtown"
                />
                <Area
                  type="monotone"
                  dataKey="waterfront"
                  stackId="1"
                  stroke="#3f3f46"
                  fill="#3f3f46"
                  fillOpacity={0.45}
                  name="Waterfront"
                />
                <Area
                  type="monotone"
                  dataKey="midtown"
                  stackId="1"
                  stroke="#71717a"
                  fill="#71717a"
                  fillOpacity={0.35}
                  name="Midtown"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-zinc-900">Demographic Radar</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Audience segment concentration from profile and booking behavior.
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <RadarChart data={DEMOGRAPHIC_DATA}>
                <PolarGrid />
                <PolarAngleAxis dataKey="segment" tick={{ fontSize: 12, fill: "#52525b" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #e4e4e7",
                    backgroundColor: "#ffffff",
                    color: "#18181b",
                  }}
                />
                <Radar
                  dataKey="value"
                  stroke="#18181b"
                  fill="#18181b"
                  fillOpacity={0.3}
                  name="Segment Score"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
