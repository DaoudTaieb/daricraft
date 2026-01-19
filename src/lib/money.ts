export function formatTND(amount: number): string {
  // Tunisia: Dinar (TND). Use fr-TN for familiar formatting.
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}

