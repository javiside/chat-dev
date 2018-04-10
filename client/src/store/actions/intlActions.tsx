export const LOCALE_SELECTED = 'LOCALE_SELECTED';
export type LOCALE_SELECTED = typeof LOCALE_SELECTED;

export const selectedLocale = (locale: string) => {
  return {
    type: LOCALE_SELECTED,
    locale: locale
  };
};