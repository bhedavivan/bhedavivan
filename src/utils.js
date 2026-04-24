export const fmt = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const normalizeCustomer = (c) => ({
  ...c,
  propertyType: c.propertyType || c.property_type || 'residential',
  squareFootage: c.squareFootage ?? c.sqft ?? null,
});
