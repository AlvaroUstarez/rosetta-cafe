import es from "./es.json";
import en from "./en.json";

export type Locale = "es" | "en";

export type I18nRecord = { es: string; en: string };

const translations: Record<Locale, Record<string, string>> = { es, en };

export function t(key: string, locale: Locale): string {
  return translations[locale]?.[key] ?? key;
}

export function tRecord(
  value: string | I18nRecord,
  locale: Locale,
): string {
  if (typeof value === "string") return value;
  return value[locale];
}
