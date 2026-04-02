const USD_CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatUsdCurrency(value: number): string {
  return USD_CURRENCY_FORMATTER.format(value);
}
