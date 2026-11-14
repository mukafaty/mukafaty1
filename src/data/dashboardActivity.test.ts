import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { AVAILABLE_BALANCE, CLICK_RECORDS, LATEST_REFERRALS, PERIOD_OPTIONS, getDashboardStats, inPeriod, periodStart } from "./dashboardActivity";

const activityNow = new Date(Math.max(...CLICK_RECORDS.map((record) => +new Date(record.date))) + 1);

describe("homepage sample data", () => {
  test("total rewards are 8290 with no fractional amount", () => {
    assert.equal(getDashboardStats("all", activityNow).rewards, 8290);
    assert.equal(Number.isInteger(getDashboardStats("all", activityNow).rewards), true);
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

describe("period-based dashboard cards", () => {
  test("all-time clicks are 2084", () => {
    assert.equal(getDashboardStats("all", activityNow).clicks, 2084);
  });
  test("all-time interest registrations are 100", () => {
    assert.equal(getDashboardStats("all", activityNow).interested, 100);
  });
  test("all-time trainees are 30", () => {
    assert.equal(getDashboardStats("all", activityNow).trainees, 30);
  });
  test("balance stays 2500 for every period", () => {
    for (const { id } of PERIOD_OPTIONS) assert.equal(getDashboardStats(id, activityNow).balance, 2500);
  });
  test("trainees never exceed registrations", () => {
    for (const { id } of PERIOD_OPTIONS) {
      const stats = getDashboardStats(id, activityNow);
      assert.ok(stats.trainees <= stats.interested);
    }
  });
  test("conversion stays within 20–30 percent allowing half a trainee for rounding", () => {
    for (const { id } of PERIOD_OPTIONS) {
      const stats = getDashboardStats(id, activityNow);
      assert.ok(stats.trainees >= stats.interested * 0.2 - 0.5);
      assert.ok(stats.trainees <= stats.interested * 0.3 + 0.5);
    }
  });
  test("contained periods cannot exceed their enclosing periods", () => {
    for (const shorter of PERIOD_OPTIONS) for (const longer of PERIOD_OPTIONS) {
      if ((periodStart(shorter.id, activityNow) ?? -Infinity) < (periodStart(longer.id, activityNow) ?? -Infinity)) continue;
      const shortStats = getDashboardStats(shorter.id, activityNow);
      const longStats = getDashboardStats(longer.id, activityNow);
      for (const key of ["clicks", "interested", "trainees", "rewards"] as const) assert.ok(shortStats[key] <= longStats[key]);
    }
  });
  test("each selectable period changes all four activity totals", () => {
    for (const key of ["clicks", "interested", "trainees", "rewards"] as const) {
      assert.equal(new Set(PERIOD_OPTIONS.map(({ id }) => getDashboardStats(id, activityNow)[key])).size, PERIOD_OPTIONS.length);
    }
  });
  test("rewards are nonnegative whole riyals in every period", () => {
    for (const { id } of PERIOD_OPTIONS) {
      const { rewards } = getDashboardStats(id, activityNow);
      assert.ok(Number.isInteger(rewards) && rewards >= 0);
    }
  });
  test("repeated calculations use the same dated activity, without new randomness", () => {
    for (const { id } of PERIOD_OPTIONS) assert.deepEqual(getDashboardStats(id, activityNow), getDashboardStats(id, activityNow));
  });
});