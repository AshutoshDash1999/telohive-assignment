export function parseNumericRouteParam(value: string): number | null {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}
