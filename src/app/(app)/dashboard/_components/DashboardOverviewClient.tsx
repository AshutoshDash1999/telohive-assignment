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

type BookingStatus = "Confirmed" | "Pending" | "Unread";

interface StatCard {
  key: string;
  label: string;
  value: string;
  trend: number;
}

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

const CARD_ICON_CLASS_NAME = "h-5 w-5 text-zinc-700";

function SpacesBrowsedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={CARD_ICON_CLASS_NAME} aria-hidden>
      <path d="M3 7h18" />
      <path d="M7 3v4" />
      <path d="M17 3v4" />
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

function SavedSpacesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={CARD_ICON_CLASS_NAME} aria-hidden>
      <path d="M7 3h10a2 2 0 0 1 2 2v16l-7-4-7 4V5a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function ActiveBookingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={CARD_ICON_CLASS_NAME} aria-hidden>
      <path d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" />
      <path d="M8 8V6a4 4 0 1 1 8 0v2" />
      <path d="M12 12v4" />
    </svg>
  );
}

function TotalSpentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={CARD_ICON_CLASS_NAME} aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <circle cx="16" cy="14" r="1.5" />
    </svg>
  );
}

function SessionDurationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={CARD_ICON_CLASS_NAME} aria-hidden>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2" />
      <path d="M9 3h6" />
    </svg>
  );
}

function ReturningVisitorsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={CARD_ICON_CLASS_NAME} aria-hidden>
      <path d="M20 6v5h-5" />
      <path d="M4 18v-5h5" />
      <path d="M6.5 10a6 6 0 0 1 10-2.5L20 11" />
      <path d="M17.5 14a6 6 0 0 1-10 2.5L4 13" />
    </svg>
  );
}

function GeoTagsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={CARD_ICON_CLASS_NAME} aria-hidden>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ConversionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={CARD_ICON_CLASS_NAME} aria-hidden>
      <path d="M4 20V10" />
      <path d="M10 20V6" />
      <path d="M16 20v-4" />
      <path d="M3 3l7 5 5-3 6 4" />
    </svg>
  );
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getTrendLabel(trend: number) {
  const sign = trend > 0 ? "+" : "";
  return `${sign}${trend}% from last month`;
}

function getTrendClassName(trend: number) {
  if (trend > 0) {
    return "text-emerald-700";
  }

  if (trend < 0) {
    return "text-rose-700";
  }

  return "text-zinc-600";
}

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

function getStatIcon(key: string) {
  switch (key) {
    case "total-spaces-browsed":
      return <SpacesBrowsedIcon />;
    case "saved-spaces":
      return <SavedSpacesIcon />;
    case "active-bookings":
      return <ActiveBookingsIcon />;
    case "total-spent":
      return <TotalSpentIcon />;
    case "avg-session-duration":
      return <SessionDurationIcon />;
    case "returning-visitor-rate":
      return <ReturningVisitorsIcon />;
    case "geotags-tracked":
      return <GeoTagsIcon />;
    case "conversion-to-booking":
      return <ConversionIcon />;
    default:
      return null;
  }
}

function buildStats(savedSpacesCount: number): StatCard[] {
  return [
    {
      key: "total-spaces-browsed",
      label: "Total Spaces Browsed",
      value: "148",
      trend: 12,
    },
    {
      key: "saved-spaces",
      label: "Saved Spaces",
      value: String(savedSpacesCount),
      trend: 9,
    },
    {
      key: "active-bookings",
      label: "Active Bookings",
      value: "7",
      trend: 16,
    },
    {
      key: "total-spent",
      label: "Total Spent",
      value: formatCurrency(18400),
      trend: -4,
    },
    {
      key: "avg-session-duration",
      label: "Avg Session Duration",
      value: "18m 42s",
      trend: 7,
    },
    {
      key: "returning-visitor-rate",
      label: "Returning Visitor Rate",
      value: "63%",
      trend: 5,
    },
    {
      key: "geotags-tracked",
      label: "GeoTags Tracked",
      value: "29",
      trend: 11,
    },
    {
      key: "conversion-to-booking",
      label: "Conversion to Booking",
      value: "21.4%",
      trend: 3,
    },
  ];
}

export function DashboardOverviewClient() {
  const savedSpacesCount = useSavedSpacesStore((state) => state.savedSpaceIds.length);
  const stats = buildStats(savedSpacesCount);

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <article
            key={card.label}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {card.label}
              </p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100">
                {getStatIcon(card.key)}
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-zinc-900">{card.value}</p>
            <p className={`mt-2 text-sm ${getTrendClassName(card.trend)}`}>
              {getTrendLabel(card.trend)}
            </p>
          </article>
        ))}
      </div>

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
