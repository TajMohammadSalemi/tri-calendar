export type Calendar = "gregorian" | "jalali" | "islamic";
export type Locale = "en" | "fa" | "prs" | "ps";
export type TimeStyle = "hour" | "hour-minute" | "hour-minute-second";
export type HourCycle = "h23" | "h12";
/** Unicode/CLDR numbering-system identifiers. */
export type NumberingSystem = "latn" | "arab" | "arabext";
/** @deprecated Use NumberingSystem with the `numberingSystem` option. */
export type DigitStyle = "latin" | "dari";

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

export interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

export interface DateTimeParts extends DateParts, TimeParts {
  /** Fractional-second digits from an ISO-like input. */
  fractionalSecond?: string;
}

/** A JavaScript Date, date-parts object, complete/partial date string, or numeric year. */
export type DateInput = string | number | Date | DateParts | DateTimeParts;
export type TimeInput = string | TimeParts | Date | null | undefined;

export interface FormatTimeOptions {
  format?: string;
  numberingSystem?: NumberingSystem;
  timeStyle?: TimeStyle;
  hourCycle?: HourCycle;
}

export interface FormatCalendarDateOptions extends FormatTimeOptions {
  locale?: Locale;
  /** Replaces the localized month names for the calendar being formatted. */
  monthNames?: readonly string[];
  /** @deprecated Use `numberingSystem`: latin maps to latn and dari maps to arabext. */
  digits?: DigitStyle;
  /** @deprecated Prefer the explicit `numberingSystem` option. */
  localizedDigits?: boolean;
}

export interface ConvertOptions {
  from: Calendar;
  to: Calendar;
  format?: string;
  locale?: Locale;
  /** Replaces the localized month names for the target calendar. */
  monthNames?: readonly string[];
  /** Unicode numbering system: latn (0-9), arab (٠-٩), or arabext (۰-۹). */
  numberingSystem?: NumberingSystem;
  /** Controls the generated time portion when `format` is omitted. */
  timeStyle?: TimeStyle;
  /** h23 uses 00-23; h12 uses 01-12 with AM/PM. */
  hourCycle?: HourCycle;
  /** @deprecated Use `numberingSystem`: latin maps to latn and dari maps to arabext. */
  digits?: DigitStyle;
  /** Use Persian digits when locale is fa. Defaults to true. */
  /** @deprecated Prefer the explicit `digits` option. */
  localizedDigits?: boolean;
}

const PERSIAN_EPOCH = 1948321;
const ISLAMIC_EPOCH = 1948440;

const monthNames: Record<Calendar, Record<Locale, readonly string[]>> = {
  gregorian: {
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    fa: [
      "ژانویه",
      "فوریه",
      "مارس",
      "آوریل",
      "مه",
      "ژوئن",
      "ژوئیه",
      "اوت",
      "سپتامبر",
      "اکتبر",
      "نوامبر",
      "دسامبر",
    ],
    prs: [
      "جنوری",
      "فبروری",
      "مارچ",
      "اپریل",
      "می",
      "جون",
      "جولای",
      "اگست",
      "سپتمبر",
      "اکتوبر",
      "نومبر",
      "دسمبر",
    ],
    ps: [
      "جنوري",
      "فبروري",
      "مارچ",
      "اپرېل",
      "مې",
      "جون",
      "جولای",
      "اګست",
      "سپټمبر",
      "اکتوبر",
      "نومبر",
      "ډسمبر",
    ],
  },
  jalali: {
    en: [
      "Farvardin",
      "Ordibehesht",
      "Khordad",
      "Tir",
      "Mordad",
      "Shahrivar",
      "Mehr",
      "Aban",
      "Azar",
      "Dey",
      "Bahman",
      "Esfand",
    ],
    fa: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
    prs: [
      "حمل",
      "ثور",
      "جوزا",
      "سرطان",
      "اسد",
      "سنبله",
      "میزان",
      "عقرب",
      "قوس",
      "جدی",
      "دلو",
      "حوت",
    ],
    ps: [
      "وری",
      "غویی",
      "غبرګولی",
      "چنګاښ",
      "زمری",
      "وږی",
      "تله",
      "لړم",
      "لیندۍ",
      "مرغومی",
      "سلواغه",
      "کب",
    ],
  },
  islamic: {
    en: [
      "Muharram",
      "Safar",
      "Rabi al-Awwal",
      "Rabi al-Thani",
      "Jumada al-Awwal",
      "Jumada al-Thani",
      "Rajab",
      "Shaban",
      "Ramadan",
      "Shawwal",
      "Dhu al-Qadah",
      "Dhu al-Hijjah",
    ],
    fa: [
      "محرم",
      "صفر",
      "ربیع‌الاول",
      "ربیع‌الثانی",
      "جمادی‌الاول",
      "جمادی‌الثانی",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذیقعده",
      "ذیحجه",
    ],
    prs: [
      "محرم",
      "صفر",
      "ربیع‌الاول",
      "ربیع‌الثانی",
      "جمادی‌الاول",
      "جمادی‌الثانی",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذوالقعده",
      "ذوالحجه",
    ],
    ps: [
      "محرم",
      "صفر",
      "ربيع الاول",
      "ربيع الثاني",
      "جمادي الاول",
      "جمادي الثاني",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذوالقعده",
      "ذوالحجه",
    ],
  },
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
  return (
    day +
    div(153 * m + 2, 5) +
    365 * y +
    div(y, 4) -
    div(y, 100) +
    div(y, 400) -
    32045
  );
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
    year: 100 * b + d - 4800 + div(m, 10),
  };
}

function jalaliToJdn({ year, month, day }: DateParts): number {
  const epBase = year - (year >= 0 ? 474 : 473);
  const epYear = 474 + mod(epBase, 2820);
  return (
    day +
    (month <= 7 ? (month - 1) * 31 : (month - 1) * 30 + 6) +
    div(epYear * 682 - 110, 2816) +
    (epYear - 1) * 365 +
    div(epBase, 2820) * 1029983 +
    (PERSIAN_EPOCH - 1)
  );
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
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    div(3 + 11 * year, 30) +
    ISLAMIC_EPOCH -
    1
  );
}

function jdnToIslamic(jdn: number): DateParts {
  const year = div(30 * (jdn - ISLAMIC_EPOCH) + 10646, 10631);
  const month = Math.min(
    12,
    Math.ceil((jdn - 29 - islamicToJdn({ year, month: 1, day: 1 })) / 29.5) + 1,
  );
  const day = jdn - islamicToJdn({ year, month, day: 1 }) + 1;
  return { year, month, day };
}

const toJdn: Record<Calendar, (date: DateParts) => number> = {
  gregorian: gregorianToJdn,
  jalali: jalaliToJdn,
  islamic: islamicToJdn,
};

const fromJdn: Record<Calendar, (jdn: number) => DateParts> = {
  gregorian: jdnToGregorian,
  jalali: jdnToJalali,
  islamic: jdnToIslamic,
};

function normalizeInputDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function hasTime(value: DateParts | DateTimeParts): value is DateTimeParts {
  return "hour" in value && "minute" in value && "second" in value;
}

function parseInput(
  input: DateInput | null | undefined,
): DateParts | DateTimeParts {
  if (input === null || input === undefined || input === "")
    throw new RangeError("Date is required");
  if (typeof input === "number") return { year: input, month: 1, day: 1 };
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) throw new RangeError("Invalid Date");
    return {
      year: input.getFullYear(),
      month: input.getMonth() + 1,
      day: input.getDate(),
      hour: input.getHours(),
      minute: input.getMinutes(),
      second: input.getSeconds(),
    };
  }
  if (typeof input !== "string") return { ...input };
  const normalized = normalizeInputDigits(input);
  const match = normalized
    .trim()
    .match(
      /^(-?\d{1,6})(?:[-/.](\d{1,2})(?:[-/.](\d{1,2}))?)?(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d{1,9}))?)?)?$/,
    );
  if (!match)
    throw new RangeError(
      "Date must use YYYY, YYYY-MM or YYYY-MM-DD, optionally followed by HH:mm:ss",
    );
  const date: DateParts = {
    year: Number(match[1]),
    month: match[2] === undefined ? 1 : Number(match[2]),
    day: match[3] === undefined ? 1 : Number(match[3]),
  };
  return match[4] === undefined
    ? date
    : {
        ...date,
        hour: Number(match[4]),
        minute: Number(match[5]),
        second: match[6] === undefined ? 0 : Number(match[6]),
        ...(match[7] === undefined ? {} : { fractionalSecond: match[7] }),
      };
}

function validate(date: DateParts, calendar: Calendar): void {
  if (
    !Number.isInteger(date.year) ||
    !Number.isInteger(date.month) ||
    !Number.isInteger(date.day)
  )
    throw new RangeError("Year, month and day must be integers");
  if (date.month < 1 || date.month > 12 || date.day < 1)
    throw new RangeError("Date is outside the valid range");
  const jdn = toJdn[calendar](date);
  const roundTrip = fromJdn[calendar](jdn);
  if (
    roundTrip.year !== date.year ||
    roundTrip.month !== date.month ||
    roundTrip.day !== date.day
  )
    throw new RangeError(`Invalid ${calendar} date`);
}

function validateTime(time: TimeParts): void {
  if (
    !Number.isInteger(time.hour) ||
    !Number.isInteger(time.minute) ||
    !Number.isInteger(time.second)
  )
    throw new RangeError("Hour, minute and second must be integers");
  if (
    time.hour < 0 ||
    time.hour > 23 ||
    time.minute < 0 ||
    time.minute > 59 ||
    time.second < 0 ||
    time.second > 59
  )
    throw new RangeError("Time is outside the valid 24-hour range");
}

const numeralSets: Record<NumberingSystem, string> = {
  latn: "0123456789",
  arab: "٠١٢٣٤٥٦٧٨٩",
  arabext: "۰۱۲۳۴۵۶۷۸۹",
};

function localize(value: string, numberingSystem: NumberingSystem): string {
  const numerals = numeralSets[numberingSystem];
  return value.replace(/\d/g, (digit) => numerals[Number(digit)] ?? digit);
}

function timeFormat(timeStyle: TimeStyle, hourCycle: HourCycle): string {
  const hour = hourCycle === "h12" ? "hh" : "HH";
  const suffix = hourCycle === "h12" ? " A" : "";
  if (timeStyle === "hour") return `${hour}${suffix}`;
  if (timeStyle === "hour-minute") return `${hour}:mm${suffix}`;
  return `${hour}:mm:ss${suffix}`;
}

function timeValues(time: TimeParts): Record<string, string> {
  const hour12 = time.hour % 12 || 12;
  return {
    HH: String(time.hour).padStart(2, "0"),
    H: String(time.hour),
    hh: String(hour12).padStart(2, "0"),
    h: String(hour12),
    mm: String(time.minute).padStart(2, "0"),
    m: String(time.minute),
    ss: String(time.second).padStart(2, "0"),
    s: String(time.second),
    A: time.hour < 12 ? "AM" : "PM",
    a: time.hour < 12 ? "am" : "pm",
  };
}

function resolveNumberingSystem(
  locale: Locale,
  numberingSystem?: NumberingSystem,
  digits?: DigitStyle,
  localizedDigits?: boolean,
): NumberingSystem {
  const legacyDigits =
    digits === "dari" ? "arabext" : digits === "latin" ? "latn" : undefined;
  return (
    numberingSystem ??
    legacyDigits ??
    (localizedDigits === undefined
      ? locale === "en"
        ? "latn"
        : "arabext"
      : localizedDigits
        ? "arabext"
        : "latn")
  );
}

/**
 * Validates and formats date parts without changing their calendar.
 *
 * @example
 * formatDate({ year: 1403, month: 1, day: 1 }, "jalali", "D MMMM YYYY", "prs");
 * // "۱ حمل ۱۴۰۳"
 */
export function formatDate(
  date: DateParts | DateTimeParts,
  calendar: Calendar,
  format = "YYYY/MM/DD",
  locale: Locale = "en",
  numberingSystem: NumberingSystem = locale === "en" ? "latn" : "arabext",
  customMonthNames?: readonly string[],
): string {
  validate(date, calendar);
  if (hasTime(date)) validateTime(date);
  const names = customMonthNames ?? monthNames[calendar][locale];
  if (customMonthNames !== undefined && customMonthNames.length !== 12)
    throw new RangeError("Month names must contain exactly 12 entries");
  const month = names[date.month - 1] ?? "";
  const values: Record<string, string> = {
    YYYY: String(date.year).padStart(4, "0"),
    MMMM: month,
    MMM: month.slice(0, 3),
    MM: String(date.month).padStart(2, "0"),
    DD: String(date.day).padStart(2, "0"),
    M: String(date.month),
    D: String(date.day),
    ...timeValues(hasTime(date) ? date : { hour: 0, minute: 0, second: 0 }),
  };
  const result = format.replace(
    /YYYY|MMMM|MMM|MM|DD|HH|hh|mm|ss|M|D|H|h|m|s|A|a/g,
    (token) => values[token] ?? token,
  );
  return localize(result, numberingSystem);
}

/**
 * Formats a supplied time, or the current local time when called without input.
 *
 * @example
 * formatTime({ hour: 14, minute: 5, second: 9 }); // "14:05:09"
 * formatTime(); // current local time
 */
export function formatTime(
  input: TimeInput = new Date(),
  options: FormatTimeOptions = {},
): string {
  try {
    if (input === null || input === "") return "";
    let time: TimeParts;
    if (input === undefined) input = new Date();
    if (input instanceof Date) {
      if (Number.isNaN(input.getTime())) return "";
      time = {
        hour: input.getHours(),
        minute: input.getMinutes(),
        second: input.getSeconds(),
      };
    } else if (typeof input === "string") {
      const normalized = normalizeInputDigits(input).trim();
      const match = normalized.match(
        /(?:^|[T\s])(\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.\d{1,9})?)?$/,
      );
      if (!match) return "";
      time = {
        hour: Number(match[1]),
        minute: Number(match[2]),
        second: match[3] === undefined ? 0 : Number(match[3]),
      };
    } else {
      time = { ...input };
    }
    validateTime(time);
    const pattern =
      options.format ??
      timeFormat(
        options.timeStyle ?? "hour-minute-second",
        options.hourCycle ?? "h23",
      );
    const result = pattern.replace(
      /HH|hh|mm|ss|H|h|m|s|A|a/g,
      (token) => timeValues(time)[token] ?? token,
    );
    return localize(result, options.numberingSystem ?? "latn");
  } catch {
    return "";
  }
}

function formatCalendarInput(
  input: DateInput | null | undefined,
  calendar: Calendar,
  options: FormatCalendarDateOptions = {},
): string {
  try {
    const date = parseInput(input);
    validate(date, calendar);
    if (hasTime(date)) validateTime(date);
    const locale = options.locale ?? "en";
    const numberingSystem = resolveNumberingSystem(
      locale,
      options.numberingSystem,
      options.digits,
      options.localizedDigits,
    );
    const generatedTime = timeFormat(
      options.timeStyle ?? "hour-minute-second",
      options.hourCycle ?? "h23",
    );
    const format =
      options.format ??
      (hasTime(date) ? `YYYY/MM/DD ${generatedTime}` : "YYYY/MM/DD");
    return formatDate(
      date,
      calendar,
      format,
      locale,
      numberingSystem,
      options.monthNames,
    );
  } catch {
    return "";
  }
}

/** Formats a Gregorian date or date-time without calendar conversion. */
export function formatGregorianDate(
  input: DateInput | null | undefined,
  options: FormatCalendarDateOptions = {},
): string {
  return formatCalendarInput(input, "gregorian", options);
}

/** Formats a Jalali/Solar Hijri date or date-time without calendar conversion. */
export function formatJalaliDate(
  input: DateInput | null | undefined,
  options: FormatCalendarDateOptions = {},
): string {
  return formatCalendarInput(input, "jalali", options);
}

/** Formats an Islamic Civil date or date-time without calendar conversion. */
export function formatIslamicDate(
  input: DateInput | null | undefined,
  options: FormatCalendarDateOptions = {},
): string {
  return formatCalendarInput(input, "islamic", options);
}

/**
 * Converts a Gregorian, Jalali, or Islamic Civil date and returns a formatted string.
 *
 * @example
 * convertDate("2024-03-20", {
 *   from: "gregorian",
 *   to: "jalali",
 *   format: "D MMMM YYYY",
 *   locale: "prs"
 * });
 * // "۱ حمل ۱۴۰۳"
 */
export function convertDate(
  input: DateInput | null | undefined,
  options: ConvertOptions,
): string {
  try {
    const source = parseInput(input);
    validate(source, options.from);
    if (hasTime(source)) validateTime(source);
    const convertedDate = fromJdn[options.to](toJdn[options.from](source));
    const converted: DateParts | DateTimeParts = hasTime(source)
      ? {
          ...convertedDate,
          hour: source.hour,
          minute: source.minute,
          second: source.second,
          ...(source.fractionalSecond === undefined
            ? {}
            : { fractionalSecond: source.fractionalSecond }),
        }
      : convertedDate;
    const locale = options.locale ?? "en";
    const numberingSystem = resolveNumberingSystem(
      locale,
      options.numberingSystem,
      options.digits,
      options.localizedDigits,
    );
    const generatedTime = timeFormat(
      options.timeStyle ?? "hour-minute-second",
      options.hourCycle ?? "h23",
    );
    const format =
      options.format ??
      (hasTime(converted) ? `YYYY/MM/DD ${generatedTime}` : "YYYY/MM/DD");
    return formatDate(
      converted,
      options.to,
      format,
      locale,
      numberingSystem,
      options.monthNames,
    );
  } catch {
    return "";
  }
}

/**
 * Converts a date and returns numeric `{ year, month, day }` parts.
 *
 * @example
 * convertDateParts("1403/01/01", "jalali", "gregorian");
 * // { year: 2024, month: 3, day: 20 }
 */
export function convertDateParts(
  input: DateInput,
  from: Calendar,
  to: Calendar,
): DateParts {
  const source = parseInput(input);
  validate(source, from);
  return fromJdn[to](toJdn[from](source));
}
