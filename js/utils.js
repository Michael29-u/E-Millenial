const currencySymbol = "GH" + String.fromCharCode(0x20b5);

function formatCurrency(amount) {
  return amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPrice(amount) {
  return `${currencySymbol}${formatCurrency(amount)}`;
}
