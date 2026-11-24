import assert from "node:assert/strict";
import { test } from "node:test";
import { searchCities, SAUDI_CITIES } from "./saudiCities";

test("includes cities beyond branch cities", () => {
  assert.ok(SAUDI_CITIES.includes("تبوك"));
  assert.ok(SAUDI_CITIES.includes("أبها"));
});
test("searches ignoring hamza", () => {
  assert.ok(searchCities("ابها").includes("أبها"));
});
test("has no duplicates", () => {
  assert.equal(new Set(SAUDI_CITIES).size, SAUDI_CITIES.length);
});
