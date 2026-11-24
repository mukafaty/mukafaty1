import { describe, expect, it } from "vitest";
import { searchCities, SAUDI_CITIES } from "./saudiCities";

describe("saudi cities", () => {
  it("includes cities beyond branch cities", () => {
    expect(SAUDI_CITIES).toContain("تبوك");
    expect(SAUDI_CITIES).toContain("أبها");
  });
  it("searches ignoring hamza", () => {
    expect(searchCities("ابها")).toContain("أبها");
  });
  it("has no duplicates", () => {
    expect(new Set(SAUDI_CITIES).size).toBe(SAUDI_CITIES.length);
  });
});
