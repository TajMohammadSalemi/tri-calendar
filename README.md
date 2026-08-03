# tri-calendar

[![CI](https://github.com/TajMohammadSalemi/tri-calendar/actions/workflows/ci.yml/badge.svg)](https://github.com/TajMohammadSalemi/tri-calendar/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/tri-calendar.svg)](https://www.npmjs.com/package/tri-calendar)
[![license](https://img.shields.io/npm/l/tri-calendar.svg)](./LICENSE)

A small, dependency-free TypeScript library for converting and formatting dates and local clock times across three calendar systems:

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

JavaScript `Date` values are also accepted as Gregorian input. Their local date
and clock fields are used, so the value is not shifted to UTC:

```ts
const result = convertDate(new Date(), {
  from: "gregorian",
  to: "jalali",
  format: "YYYY/MM/DD"
});
```

## VS Code IntelliSense and auto import

The package ships its TypeScript declarations and supports VS Code auto import. After installation, type an exported function name and press `Ctrl + Space` (Windows/Linux) or `Control + Space` (macOS):

```ts
convertDate
```

Choose **Add import from "tri-calendar"** and VS Code will add:

```ts
import { convertDate } from "tri-calendar";
```

Auto import is available for `convertDate`, `convertDateParts`, `formatDate`, `formatTime`, `formatGregorianDate`, `formatJalaliDate`, and `formatIslamicDate`. IntelliSense also displays option values such as calendar names, locales, and numbering systems.

If suggestions do not appear, confirm that `tri-calendar` is installed in the current project, save the file as `.ts` or `.tsx`, and run **TypeScript: Restart TS Server** from the VS Code Command Palette.

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

## Input formats and partial dates

Pass a complete date string using `-`, `/`, or `.` as the separator:

```ts
convertDate("2024-03-20", options);
convertDate("2024/03/20", options);
convertDate("2024.03.20", options);
```

Partial dates are also accepted. Missing values default to the first valid value:

```ts
convertDate("2025", options);   // treated as 2025-01-01
convertDate("2025-4", options); // treated as 2025-04-01
convertDate("2025/4", options); // treated as 2025-04-01
```

A year may also be passed as a number:

```ts
convertDate(2025, options); // treated as 2025-01-01
```

This rule applies to every supported source calendar. A year-only input defaults to month `1`, day `1`; a year-and-month input defaults to day `1`.

## Date and time

Append a 24-hour time to a complete or partial date using a space or `T`. Seconds are optional and default to zero:

```ts
convertDate("2024-03-20 14:05:09", {
  from: "gregorian",
  to: "jalali"
}); // "1403/01/01 14:05:09"

convertDate("2024-03-20T04:05", {
  from: "gregorian",
  to: "jalali",
  format: "D/M/YYYY H:mm"
}); // "1/1/1403 4:05"

convertDate("2026-08-02T22:02:52.544031", {
  from: "gregorian",
  to: "jalali",
  timeStyle: "hour-minute",
  hourCycle: "h12"
}); // "1405/05/11 10:02 PM"
```

Calendar conversion preserves the supplied clock time. It does not apply a time-zone conversion. When date-time input is supplied without an explicit format, the default output is `YYYY/MM/DD HH:mm:ss`.

Time format tokens:

| Token | Meaning | Example |
| --- | --- | --- |
| `HH` | Two-digit hour, 24-hour clock | `04` |
| `H` | Hour without leading zero | `4` |
| `hh` | Two-digit hour, 12-hour clock | `04` |
| `h` | 12-hour value without leading zero | `4` |
| `mm` | Two-digit minute | `05` |
| `m` | Minute without leading zero | `5` |
| `ss` | Two-digit second | `09` |
| `s` | Second without leading zero | `9` |
| `A` | Uppercase meridiem | `AM` / `PM` |
| `a` | Lowercase meridiem | `am` / `pm` |

## Standalone time formatting

Use `formatTime` for a supplied time or the current local time:

```ts
import { formatTime } from "tri-calendar";

formatTime({ hour: 14, minute: 5, second: 9 });
// "14:05:09"

formatTime("۱۴:۰۵", { numberingSystem: "arabext" });
// "۱۴:۰۵:۰۰"

formatTime("2026-08-02T22:02:52.544031", {
  timeStyle: "hour-minute-second",
  hourCycle: "h12"
}); // "10:02:52 PM"

formatTime(undefined, {
  format: "H:mm",
  numberingSystem: "latn"
}); // current local time, for example "9:30"
```

`formatTime()` reads the system's current local time when called. It returns a string and does not create a running clock or timer.

Available `timeStyle` values are `hour`, `hour-minute`, and `hour-minute-second`. The `hourCycle` may be `h23` (the default 24-hour clock) or `h12` (12-hour clock with AM/PM). An explicit `format` takes priority over these generated display options.

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

## Formatting without calendar conversion

Use a calendar-specific formatter when the input is already in the correct calendar. These methods validate and format the value but never convert it:

```ts
import {
  formatGregorianDate,
  formatJalaliDate,
  formatIslamicDate
} from "tri-calendar";

formatGregorianDate("2026-08-02T22:02:52.544031", {
  format: "D MMMM YYYY, hh:mm A"
}); // "2 August 2026, 10:02 PM"

formatJalaliDate("1405/05/11 22:02", {
  format: "D MMMM YYYY HH:mm",
  locale: "prs",
  numberingSystem: "arabext"
}); // "۱۱ اسد ۱۴۰۵ ۲۲:۰۲"

formatIslamicDate("1448/02/18 22:02:52", {
  timeStyle: "hour-minute",
  hourCycle: "h12"
}); // "1448/02/18 10:02 PM"
```

All three methods accept complete dates, partial dates, numeric years, date-time strings, and structured date parts. Invalid, empty, `null`, or `undefined` input returns an empty string.

## API reference

### `convertDate(input, options)`

Converts and formats a date or date-time. It returns a string.

The `input` type is `string | number | DateParts | DateTimeParts`. A numeric input represents a year and defaults to month `1`, day `1`.

```ts
interface ConvertOptions {
  from: "gregorian" | "jalali" | "islamic";
  to: "gregorian" | "jalali" | "islamic";
  format?: string;
  locale?: "en" | "fa" | "prs";
  numberingSystem?: "latn" | "arab" | "arabext";
  timeStyle?: "hour" | "hour-minute" | "hour-minute-second";
  hourCycle?: "h23" | "h12";
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

interface DateTimeParts extends DateParts {
  hour: number;
  minute: number;
  second: number;
}
```

### `formatDate(date, calendar, format?, locale?, numberingSystem?)`

Validates and formats date or date-time parts without converting the calendar.

### `formatTime(input?, options?)`

Formats `TimeParts`, an `HH:mm[:ss]` string, or a JavaScript `Date`. With no input it formats the current local time.

```ts
interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

interface FormatTimeOptions {
  format?: string;
  numberingSystem?: "latn" | "arab" | "arabext";
  timeStyle?: "hour" | "hour-minute" | "hour-minute-second";
  hourCycle?: "h23" | "h12";
}
```

### `formatGregorianDate(input, options?)`

Validates and formats Gregorian input without changing its calendar.

### `formatJalaliDate(input, options?)`

Validates and formats Jalali/Solar Hijri input without changing its calendar.

### `formatIslamicDate(input, options?)`

Validates and formats Islamic Civil input without changing its calendar.

The three methods share these options:

```ts
interface FormatCalendarDateOptions extends FormatTimeOptions {
  locale?: "en" | "fa" | "prs";
}
```

## Invalid and empty values

`convertDate` and `formatTime` return an empty string for invalid, empty, or `null` input so display code can remain safe:

```ts
convertDate("2025-02-29", {
  from: "gregorian",
  to: "jalali"
}); // ""

formatTime("24:70"); // ""
formatTime(null); // ""
```

For backward compatibility, calling `formatTime()` or `formatTime(undefined)` still returns the current local time. Accepted date patterns are `YYYY`, `YYYY-MM`, and `YYYY-MM-DD`, using `-`, `/`, or `.` as the separator. A date may optionally be followed by ` HH:mm[:ss]` or `THH:mm[:ss]`, with optional fractional seconds such as `.544031`.

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
