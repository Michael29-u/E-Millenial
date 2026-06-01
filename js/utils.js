export const currencySymbol = "GH₵";

export function formatCurrency(amount) {
  return amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPrice(amount) {
  return `${currencySymbol}${formatCurrency(amount)}`;
}
