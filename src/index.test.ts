import test from "node:test";
import assert from "node:assert/strict";
import { convertDate, convertDateParts, formatTime } from "./index.js";

test("converts Gregorian to Jalali", () => {
  assert.equal(convertDate("2026-08-02", { from: "gregorian", to: "jalali" }), "1405/05/11");
});

test("round-trips every calendar", () => {
  const original = { year: 2024, month: 3, day: 20 };
  for (const calendar of ["jalali", "islamic"] as const) {
    const converted = convertDateParts(original, "gregorian", calendar);
    assert.deepEqual(convertDateParts(converted, calendar, "gregorian"), original);
  }
});

test("supports Persian input, names and digits", () => {
  assert.equal(convertDate("۱۴۰۳/۰۱/۰۱", {
    from: "jalali", to: "gregorian", format: "D MMMM YYYY", locale: "fa"
  }), "۲۰ مارس ۲۰۲۴");
});

test("supports Dari month names and explicit Dari digits", () => {
  assert.equal(convertDate("2024-03-20", {
    from: "gregorian", to: "jalali", format: "D MMMM YYYY", locale: "prs", numberingSystem: "arabext"
  }), "۱ حمل ۱۴۰۳");
});

test("can show Dari language with Latin digits", () => {
  assert.equal(convertDate("2024-08-22", {
    from: "gregorian", to: "jalali", format: "D MMMM YYYY", locale: "prs", numberingSystem: "latn"
  }), "1 سنبله 1403");
});

test("supports Arabic-Indic numerals", () => {
  assert.equal(convertDate("2024-03-20", {
    from: "gregorian", to: "islamic", numberingSystem: "arab"
  }), "١٤٤٥/٠٩/١٠");
});

test("keeps legacy digit names backward compatible", () => {
  assert.equal(convertDate("2024-03-20", {
    from: "gregorian", to: "jalali", digits: "dari"
  }), "۱۴۰۳/۰۱/۰۱");
});

test("rejects invalid dates", () => {
  assert.equal(convertDate("2025-02-29", { from: "gregorian", to: "jalali" }), "");
});

test("accepts a year and defaults to the first day of the year", () => {
  assert.deepEqual(convertDateParts("2025", "gregorian", "gregorian"), {
    year: 2025, month: 1, day: 1
  });
});

test("accepts a numeric year", () => {
  assert.deepEqual(convertDateParts(2025, "gregorian", "gregorian"), {
    year: 2025, month: 1, day: 1
  });
});

test("accepts a year and month and defaults to the first day", () => {
  assert.deepEqual(convertDateParts("2025-4", "gregorian", "gregorian"), {
    year: 2025, month: 4, day: 1
  });
});

test("accepts partial dates with Extended Arabic-Indic digits", () => {
  assert.deepEqual(convertDateParts("۱۴۰۳/۲", "jalali", "jalali"), {
    year: 1403, month: 2, day: 1
  });
});

test("preserves and displays time while converting a date", () => {
  assert.equal(convertDate("2024-03-20 14:05:09", {
    from: "gregorian", to: "jalali"
  }), "1403/01/01 14:05:09");
});

test("accepts ISO-style date-time input and custom time tokens", () => {
  assert.equal(convertDate("2024-03-20T04:05", {
    from: "gregorian", to: "jalali", format: "D/M/YYYY H:mm"
  }), "1/1/1403 4:05");
});

test("formats time separately", () => {
  assert.equal(formatTime({ hour: 14, minute: 5, second: 9 }), "14:05:09");
  assert.equal(formatTime("۱۴:۰۵", { numberingSystem: "arabext" }), "۱۴:۰۵:۰۰");
});

test("rejects invalid times", () => {
  assert.equal(formatTime("24:00"), "");
  assert.equal(convertDate("2024-03-20 12:60", {
    from: "gregorian", to: "jalali"
  }), "");
});

test("accepts ISO date-time input with microseconds", () => {
  assert.equal(formatTime("2026-08-02T22:02:52.544031"), "22:02:52");
  assert.equal(convertDate("2026-08-02T22:02:52.544031", {
    from: "gregorian", to: "jalali"
  }), "1405/05/11 22:02:52");
});

test("supports time display precision options", () => {
  const time = { hour: 22, minute: 2, second: 52 };
  assert.equal(formatTime(time, { timeStyle: "hour" }), "22");
  assert.equal(formatTime(time, { timeStyle: "hour-minute" }), "22:02");
  assert.equal(formatTime(time, { timeStyle: "hour-minute-second" }), "22:02:52");
});

test("supports 12-hour time with AM and PM", () => {
  assert.equal(formatTime("00:05", { timeStyle: "hour-minute", hourCycle: "h12" }), "12:05 AM");
  assert.equal(formatTime("2026-08-02T22:02:52.544031", { hourCycle: "h12" }), "10:02:52 PM");
  assert.equal(formatTime("13:05", { format: "h:mm a" }), "1:05 pm");
});

test("convertDate supports generated 12-hour time formats", () => {
  assert.equal(convertDate("2026-08-02T22:02:52.544031", {
    from: "gregorian", to: "jalali", timeStyle: "hour-minute", hourCycle: "h12"
  }), "1405/05/11 10:02 PM");
});

test("safely handles empty, null, undefined and invalid values", () => {
  const options = { from: "gregorian", to: "jalali" } as const;
  assert.equal(convertDate("", options), "");
  assert.equal(convertDate(null, options), "");
  assert.equal(convertDate(undefined, options), "");
  assert.equal(convertDate("not-a-date", options), "");
  assert.equal(formatTime(""), "");
  assert.equal(formatTime(null), "");
  assert.equal(formatTime("not-a-time"), "");
  assert.match(formatTime(undefined), /^\d{2}:\d{2}:\d{2}$/);
});
