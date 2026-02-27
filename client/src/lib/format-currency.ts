export function formatCurrency(num: any) {
  return Intl.NumberFormat('fr-XO', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}
