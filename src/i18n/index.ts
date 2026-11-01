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

/**
 * Menu prices are Argentine pesos without cents. Formatting them through
 * Intl keeps the thousands separator correct per locale ("$ 3.300" / "$3,300").
 */
export function formatPrice(price: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "es" ? "es-AR" : "en-US", {
    style: "currency",
    currency: "ARS",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(price);
}
