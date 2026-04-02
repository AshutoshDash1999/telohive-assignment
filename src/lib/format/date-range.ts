const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDisplayDateRange(startDate: string, endDate: string): string {
  const start = SHORT_DATE_FORMATTER.format(new Date(startDate));
  const end = SHORT_DATE_FORMATTER.format(new Date(endDate));
  return `${start} - ${end}`;
}
