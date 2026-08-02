import test from "node:test";
import assert from "node:assert/strict";
import { convertDate, convertDateParts } from "./index.js";

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
  assert.throws(() => convertDate("2025-02-29", { from: "gregorian", to: "jalali" }), RangeError);
});
