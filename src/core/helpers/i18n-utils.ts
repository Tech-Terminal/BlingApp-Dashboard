import i18n from "@/core/plugins/i18n";

/**
 * @description Translate text
 * @param text
 * @returns {string}
 */
export const translate = (text: string): string => {
  if (i18n.global.t(text)) {
    return i18n.global.t(text);
  }
  return text;
};
