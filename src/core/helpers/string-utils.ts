/**
 * @description Format a name by replacing underscores with spaces
 * @param name
 * @returns {string}
 */
export const formatName = (name: string | number): string => {
  if (!name) return "";
  return name.toString().replace(/_/g, " ");
};
