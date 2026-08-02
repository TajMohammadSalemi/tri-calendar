export type Calendar = "gregorian" | "jalali" | "islamic";
export type Locale = "en" | "fa" | "prs";
/** Unicode/CLDR numbering-system identifiers. */
export type NumberingSystem = "latn" | "arab" | "arabext";
/** @deprecated Use NumberingSystem with the `numberingSystem` option. */
export type DigitStyle = "latin" | "dari";

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

export interface ConvertOptions {
  from: Calendar;
  to: Calendar;
  format?: string;
  locale?: Locale;
  /** Unicode numbering system: latn (0-9), arab (٠-٩), or arabext (۰-۹). */
  numberingSystem?: NumberingSystem;
  /** @deprecated Use `numberingSystem`: latin maps to latn and dari maps to arabext. */
  digits?: DigitStyle;
  /** Use Persian digits when locale is fa. Defaults to true. */
  /** @deprecated Prefer the explicit `digits` option. */
  localizedDigits?: boolean;
}

const PERSIAN_EPOCH = 1948321;
const ISLAMIC_EPOCH = 1948440;

const monthNames: Record<Calendar, Record<Locale, string[]>> = {
  gregorian: {
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    fa: ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"],
    prs: ["جنوری", "فبروری", "مارچ", "اپریل", "می", "جون", "جولای", "اگست", "سپتمبر", "اکتوبر", "نومبر", "دسمبر"]
  },
  jalali: {
    en: ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"],
    fa: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
    prs: ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"]
  },
  islamic: {
    en: ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Shaban", "Ramadan", "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah"],
    fa: ["محرم", "صفر", "ربیع‌الاول", "ربیع‌الثانی", "جمادی‌الاول", "جمادی‌الثانی", "رجب", "شعبان", "رمضان", "شوال", "ذیقعده", "ذیحجه"],
    prs: ["محرم", "صفر", "ربیع‌الاول", "ربیع‌الثانی", "جمادی‌الاول", "جمادی‌الثانی", "رجب", "شعبان", "رمضان", "شوال", "ذوالقعده", "ذوالحجه"]
  }
};

function div(a: number, b: number): number {
  return Math.floor(a / b);
}

function mod(a: number, b: number): number {
  return a - Math.floor(a / b) * b;
}

function gregorianToJdn({ year, month, day }: DateParts): number {
  const a = div(14 - month, 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + div(153 * m + 2, 5) + 365 * y + div(y, 4) - div(y, 100) + div(y, 400) - 32045;
}

function jdnToGregorian(jdn: number): DateParts {
  const a = jdn + 32044;
  const b = div(4 * a + 3, 146097);
  const c = a - div(146097 * b, 4);
  const d = div(4 * c + 3, 1461);
  const e = c - div(1461 * d, 4);
  const m = div(5 * e + 2, 153);
  return {
    day: e - div(153 * m + 2, 5) + 1,
    month: m + 3 - 12 * div(m, 10),
    year: 100 * b + d - 4800 + div(m, 10)
  };
}

function jalaliToJdn({ year, month, day }: DateParts): number {
  const epBase = year - (year >= 0 ? 474 : 473);
  const epYear = 474 + mod(epBase, 2820);
  return day + (month <= 7 ? (month - 1) * 31 : (month - 1) * 30 + 6)
    + div(epYear * 682 - 110, 2816) + (epYear - 1) * 365
    + div(epBase, 2820) * 1029983 + (PERSIAN_EPOCH - 1);
}

function jdnToJalali(jdn: number): DateParts {
  const depoch = jdn - jalaliToJdn({ year: 475, month: 1, day: 1 });
  const cycle = div(depoch, 1029983);
  const cyear = mod(depoch, 1029983);
  let ycycle: number;
  if (cyear === 1029982) ycycle = 2820;
  else {
    const aux1 = div(cyear, 366);
    const aux2 = mod(cyear, 366);
    ycycle = div(2134 * aux1 + 2816 * aux2 + 2815, 1028522) + aux1 + 1;
  }
  let year = ycycle + 2820 * cycle + 474;
  if (year <= 0) year -= 1;
  const yday = jdn - jalaliToJdn({ year, month: 1, day: 1 }) + 1;
  const month = yday <= 186 ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
  const day = jdn - jalaliToJdn({ year, month, day: 1 }) + 1;
  return { year, month, day };
}

function islamicToJdn({ year, month, day }: DateParts): number {
  return day + Math.ceil(29.5 * (month - 1)) + (year - 1) * 354
    + div(3 + 11 * year, 30) + ISLAMIC_EPOCH - 1;
}

function jdnToIslamic(jdn: number): DateParts {
  const year = div(30 * (jdn - ISLAMIC_EPOCH) + 10646, 10631);
  const month = Math.min(12, Math.ceil((jdn - 29 - islamicToJdn({ year, month: 1, day: 1 })) / 29.5) + 1);
  const day = jdn - islamicToJdn({ year, month, day: 1 }) + 1;
  return { year, month, day };
}

const toJdn: Record<Calendar, (date: DateParts) => number> = {
  gregorian: gregorianToJdn,
  jalali: jalaliToJdn,
  islamic: islamicToJdn
};

const fromJdn: Record<Calendar, (jdn: number) => DateParts> = {
  gregorian: jdnToGregorian,
  jalali: jdnToJalali,
  islamic: jdnToIslamic
};

function parseInput(input: string | DateParts): DateParts {
  if (typeof input !== "string") return { ...input };
  const normalized = input.replace(/[۰-۹]/g, c => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c)));
  const match = normalized.trim().match(/^(-?\d{1,6})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (!match) throw new RangeError("Date must use YYYY-MM-DD, YYYY/MM/DD or YYYY.MM.DD format");
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

function validate(date: DateParts, calendar: Calendar): void {
  if (!Number.isInteger(date.year) || !Number.isInteger(date.month) || !Number.isInteger(date.day))
    throw new RangeError("Year, month and day must be integers");
  if (date.month < 1 || date.month > 12 || date.day < 1)
    throw new RangeError("Date is outside the valid range");
  const jdn = toJdn[calendar](date);
  const roundTrip = fromJdn[calendar](jdn);
  if (roundTrip.year !== date.year || roundTrip.month !== date.month || roundTrip.day !== date.day)
    throw new RangeError(`Invalid ${calendar} date`);
}

const numeralSets: Record<NumberingSystem, string> = {
  latn: "0123456789",
  arab: "٠١٢٣٤٥٦٧٨٩",
  arabext: "۰۱۲۳۴۵۶۷۸۹"
};

function localize(value: string, numberingSystem: NumberingSystem): string {
  const numerals = numeralSets[numberingSystem];
  return value.replace(/\d/g, digit => numerals[Number(digit)] ?? digit);
}

export function formatDate(date: DateParts, calendar: Calendar, format = "YYYY/MM/DD", locale: Locale = "en", numberingSystem: NumberingSystem = locale === "en" ? "latn" : "arabext"): string {
  validate(date, calendar);
  const month = monthNames[calendar][locale][date.month - 1] ?? "";
  const values: Record<string, string> = {
    YYYY: String(date.year).padStart(4, "0"),
    MMMM: month,
    MMM: month.slice(0, 3),
    MM: String(date.month).padStart(2, "0"),
    DD: String(date.day).padStart(2, "0"),
    M: String(date.month),
    D: String(date.day)
  };
  const result = format.replace(/YYYY|MMMM|MMM|MM|DD|M|D/g, token => values[token] ?? token);
  return localize(result, numberingSystem);
}

export function convertDate(input: string | DateParts, options: ConvertOptions): string {
  const source = parseInput(input);
  validate(source, options.from);
  const converted = fromJdn[options.to](toJdn[options.from](source));
  const locale = options.locale ?? "en";
  const legacyDigits = options.digits === "dari" ? "arabext" : options.digits === "latin" ? "latn" : undefined;
  const numberingSystem = options.numberingSystem
    ?? legacyDigits
    ?? (options.localizedDigits === undefined
      ? (locale === "en" ? "latn" : "arabext")
      : (options.localizedDigits ? "arabext" : "latn"));
  return formatDate(converted, options.to, options.format, locale, numberingSystem);
}

export function convertDateParts(input: string | DateParts, from: Calendar, to: Calendar): DateParts {
  const source = parseInput(input);
  validate(source, from);
  return fromJdn[to](toJdn[from](source));
}
