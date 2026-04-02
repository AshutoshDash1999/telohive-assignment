"use client";

import { SequentialReveal } from "@/components/animation/SequentialReveal";
import { formatUsdCurrency } from "@/lib/format/currency";

interface StatCard {
  key: string;
  label: string;
  value: string;
  trend: number;
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
      value: formatUsdCurrency(18400),
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

interface DashboardStatGridProps {
  savedSpacesCount: number;
}

export function DashboardStatGrid({ savedSpacesCount }: DashboardStatGridProps) {
  const stats = buildStats(savedSpacesCount);

  return (
    <SequentialReveal
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((card) => (
        <article
          key={card.key}
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
    </SequentialReveal>
  );
}
