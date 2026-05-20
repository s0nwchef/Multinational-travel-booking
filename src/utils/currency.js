export const formatUsd = (amount, fallback = 'Contact us') => {
  const value = Number(amount);

  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

export default formatUsd;
