/**
 * @description Format a number with comma separators (e.g., 1,000,000)
 * @param value
 * @returns {string}
 */
export const formatNumber = (value: number | string): string => {
  if (value === undefined || value === null || value === "") return "0";

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return value.toString();

  return num.toLocaleString("en-US");
};

/**
 * @description Format a currency value with comma separators (e.g., 1,000,000 EGP)
 * @param value
 * @param currency
 * @returns {string}
 */
export const formatCurrency = (
  value: number | string,
  currency: string = "EGP",
): string => {
  return `${formatNumber(value)} ${currency}`;
};
