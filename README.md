# tri-calendar

[![CI](https://github.com/TajMohammadSalemi/tri-calendar/actions/workflows/ci.yml/badge.svg)](https://github.com/TajMohammadSalemi/tri-calendar/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/tri-calendar.svg)](https://www.npmjs.com/package/tri-calendar)
[![license](https://img.shields.io/npm/l/tri-calendar.svg)](./LICENSE)

A small, dependency-free TypeScript library for converting and formatting dates across three calendar systems:

- Gregorian
- Jalali (Solar Hijri / Persian)
- Islamic Civil (tabular Hijri)

It includes first-class Dari support, localized month names, multiple numeral systems, strict date validation, and full TypeScript types.

## Why tri-calendar?

Many date libraries focus on one calendar, couple language with numeral shape, or require plugins and runtime dependencies. `tri-calendar` provides a focused alternative:

- **Three calendars through one API** — convert between Gregorian, Jalali, and Islamic Civil dates in any direction.
- **Dari support for Afghanistan** — Jalali months use `Hamal`, `Sawr`, `Jawza`, `Saratan`, `Asad`, `Sonbola`, `Mizan`, `Aqrab`, `Qaws`, `Jadi`, `Dalwa`, and `Hut` in Dari script.
- **Language and numerals are independent** — for example, display a Dari month name with Latin, Arabic-Indic, or Extended Arabic-Indic digits.
- **No runtime dependencies** — the conversion algorithms are included in the package.
- **Deterministic conversion** — the same input always produces the same result, including Islamic Civil dates.
- **Strict validation** — impossible dates such as `2025-02-29` are rejected instead of silently corrected.
- **Typed and lightweight API** — written in strict TypeScript and ships with declaration files.
- **String and structured output** — return a formatted date or `{ year, month, day }` parts.

This library intentionally concentrates on calendar-date conversion and formatting. It is not a replacement for a full date-time library when you need time zones, durations, relative time, or locale-aware date arithmetic.

## Installation

```bash
npm install tri-calendar
```

## Quick start

```ts
import { convertDate } from "tri-calendar";

const result = convertDate("2026-08-02", {
  from: "gregorian",
  to: "jalali",
  format: "YYYY/MM/DD"
});

console.log(result); // 1405/05/11
```

## Converting between calendars

Every calendar can be converted to either of the other calendars.

```ts
import { convertDate } from "tri-calendar";

// Gregorian to Jalali
convertDate("2024-03-20", {
  from: "gregorian",
  to: "jalali"
}); // "1403/01/01"

// Jalali to Gregorian
convertDate("1403/01/01", {
  from: "jalali",
  to: "gregorian"
}); // "2024/03/20"

// Gregorian to Islamic Civil
convertDate("2024-03-20", {
  from: "gregorian",
  to: "islamic"
}); // "1445/09/10"

// Islamic Civil to Jalali
convertDate("1445/09/10", {
  from: "islamic",
  to: "jalali"
}); // "1403/01/01"
```

Supported calendar identifiers:

| Identifier | Calendar |
| --- | --- |
| `gregorian` | Gregorian calendar |
| `jalali` | Jalali / Solar Hijri calendar |
| `islamic` | Islamic Civil / tabular Hijri calendar |

## Input formats

Pass a date string using `-`, `/`, or `.` as the separator:

```ts
convertDate("2024-03-20", options);
convertDate("2024/03/20", options);
convertDate("2024.03.20", options);
```

Extended Arabic-Indic digits are accepted in input strings:

```ts
convertDate("۱۴۰۳/۰۱/۰۱", {
  from: "jalali",
  to: "gregorian"
}); // "2024/03/20"
```

You can also pass structured date parts:

```ts
convertDate(
  { year: 1403, month: 1, day: 1 },
  { from: "jalali", to: "gregorian" }
); // "2024/03/20"
```

## Formatting output

Use the `format` option to control the result:

```ts
convertDate("2024-03-20", {
  from: "gregorian",
  to: "jalali",
  format: "D MMMM YYYY",
  locale: "prs"
}); // "۱ حمل ۱۴۰۳"
```

Available format tokens:

| Token | Meaning | Example |
| --- | --- | --- |
| `YYYY` | Four-digit year | `1403` |
| `MMMM` | Full localized month name | `حمل` |
| `MMM` | First three characters of the localized month | `حمل` |
| `MM` | Two-digit month | `01` |
| `M` | Month without leading zero | `1` |
| `DD` | Two-digit day | `01` |
| `D` | Day without leading zero | `1` |

The default format is `YYYY/MM/DD`.

## Languages

Choose localized month names with `locale`:

| Locale | Language |
| --- | --- |
| `en` | English |
| `fa` | Iranian Persian |
| `prs` | Dari (Afghanistan) |

### Dari example

```ts
convertDate("2024-08-22", {
  from: "gregorian",
  to: "jalali",
  format: "D MMMM YYYY",
  locale: "prs"
}); // "۱ سنبله ۱۴۰۳"
```

The Dari Jalali month names are:

| Month | Dari |
| ---: | --- |
| 1 | حمل |
| 2 | ثور |
| 3 | جوزا |
| 4 | سرطان |
| 5 | اسد |
| 6 | سنبله |
| 7 | میزان |
| 8 | عقرب |
| 9 | قوس |
| 10 | جدی |
| 11 | دلو |
| 12 | حوت |

## Numeral systems

Language and numeral shape are configured separately. Use the standard Unicode/CLDR numbering-system identifiers:

| Value | Digits | Common usage |
| --- | --- | --- |
| `latn` | `0123456789` | Latin digits, used internationally |
| `arab` | `٠١٢٣٤٥٦٧٨٩` | Arabic-Indic digits |
| `arabext` | `۰۱۲۳۴۵۶۷۸۹` | Extended Arabic-Indic digits, used in Dari and Persian |

```ts
// Dari language with Latin digits
convertDate("2024-08-22", {
  from: "gregorian",
  to: "jalali",
  format: "D MMMM YYYY",
  locale: "prs",
  numberingSystem: "latn"
}); // "1 سنبله 1403"

// English language with Arabic-Indic digits
convertDate("2024-03-20", {
  from: "gregorian",
  to: "islamic",
  format: "D MMMM YYYY",
  locale: "en",
  numberingSystem: "arab"
}); // "١٠ Ramadan ١٤٤٥"
```

Defaults:

- `en` uses `latn`.
- `fa` and `prs` use `arabext`.

## Returning date parts

Use `convertDateParts` when you need numeric values instead of a formatted string:

```ts
import { convertDateParts } from "tri-calendar";

const date = convertDateParts(
  { year: 1403, month: 1, day: 1 },
  "jalali",
  "gregorian"
);

console.log(date);
// { year: 2024, month: 3, day: 20 }
```

## Formatting existing date parts

Use `formatDate` when the date is already in the required calendar:

```ts
import { formatDate } from "tri-calendar";

formatDate(
  { year: 1403, month: 1, day: 1 },
  "jalali",
  "D MMMM YYYY",
  "prs",
  "arabext"
); // "۱ حمل ۱۴۰۳"
```

## API reference

### `convertDate(input, options)`

Converts and formats a date. It returns a string.

```ts
interface ConvertOptions {
  from: "gregorian" | "jalali" | "islamic";
  to: "gregorian" | "jalali" | "islamic";
  format?: string;
  locale?: "en" | "fa" | "prs";
  numberingSystem?: "latn" | "arab" | "arabext";
}
```

### `convertDateParts(input, from, to)`

Converts a date and returns:

```ts
interface DateParts {
  year: number;
  month: number;
  day: number;
}
```

### `formatDate(date, calendar, format?, locale?, numberingSystem?)`

Validates and formats date parts without converting the calendar.

## Validation and errors

Invalid input throws a `RangeError`:

```ts
convertDate("2025-02-29", {
  from: "gregorian",
  to: "jalali"
}); // throws RangeError
```

Malformed strings also throw a `RangeError`. Accepted string patterns are `YYYY-MM-DD`, `YYYY/MM/DD`, and `YYYY.MM.DD`.

## Important note about Islamic dates

The `islamic` calendar uses the deterministic Islamic Civil (tabular) calculation. It does not attempt to predict or reproduce local moon sightings. An officially observed Hijri date may differ by one day depending on the country, religious authority, and visibility of the crescent moon.

Use this calendar for reproducible software calculations. If your application must follow an official local calendar, supply or integrate the dates published by the relevant authority.

## Backward compatibility

The old `digits` and `localizedDigits` options continue to work for compatibility, but they are deprecated. New code should use `numberingSystem`:

```ts
// Deprecated
{ digits: "dari" }

// Recommended
{ numberingSystem: "arabext" }
```

## Development

```bash
npm install
npm test
```

Build the package:

```bash
npm run build
```

Run type checking without emitting files:

```bash
npm run typecheck
```

## License

MIT
