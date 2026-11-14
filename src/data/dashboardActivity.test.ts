import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { AVAILABLE_BALANCE, LATEST_REFERRALS, TOTAL_REWARDS, inPeriod } from "./dashboardActivity";

describe("homepage sample data", () => {
  test("total rewards are 8290 with no fractional amount", () => {
    assert.equal(TOTAL_REWARDS, 8290);
    assert.equal(Number.isInteger(TOTAL_REWARDS), true);
  });
  test("available balance remains 2500", () => {
    assert.equal(AVAILABLE_BALANCE, 2500);
  });
  test("latest referrals retain the requested order and details", () => {
    assert.deepEqual(LATEST_REFERRALS.map(({ name, program, city, date }) => [name, program, city, date.slice(0, 10)]), [
      ["تركي الشمري", "دبلوم إدارة الأعمال", "جدة", "2026-10-14"],
      ["سارة الشهري", "دبلوم الموارد البشرية", "الرياض", "2026-10-13"],
      ["عبد الله المالكي", "دبلوم الأمن السيبراني", "جدة", "2026-10-10"],
    ]);
  });
  test("sample rows still respect the selected period", () => {
    const now = new Date("2026-11-14T11:50:00Z");
    assert.equal(LATEST_REFERRALS.filter((row) => inPeriod(row.date, "all", now)).length, 3);
    assert.equal(LATEST_REFERRALS.filter((row) => inPeriod(row.date, "month", now)).length, 0);
  });
});