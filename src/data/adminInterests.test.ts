import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { buildInterestRecords, filterByRange, interestStats, periodRange } from "./adminInterests";

const now = new Date(2026, 10, 18, 14, 30);
const records = buildInterestRecords(now);
const stats = (p: Parameters<typeof periodRange>[0], f?: string, t?: string) =>
  interestStats(filterByRange(records, periodRange(p, now, f, t)), now);

describe("admin interest registrations", () => {
  test("all time has 530 records: 320 processing, 210 registered", () => {
    assert.deepEqual(stats("all"), { ...stats("all"), total: 530, processing: 320, registered: 210 });
  });
  test("processing + registered equals total for every period", () => {
    for (const p of ["all", "year", "6m", "3m", "month", "7d", "today"] as const) {
      const s = stats(p);
      assert.equal(s.processing + s.registered, s.total);
    }
  });
  test("shorter periods never exceed longer ones and each has records", () => {
    const order = (["all", "6m", "3m", "7d", "today"] as const).map((p) => stats(p).total);
    for (let i = 1; i < order.length; i++) assert.ok(order[i]! <= order[i - 1]! && order[i]! > 0);
  });
  test("no records are dated in the future", () => {
    assert.ok(records.every((r) => r.date <= now));
  });
  test("custom range includes both end days", () => {
    const d = records[100]!.date;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    assert.ok(stats("custom", key, key).total >= 1);
  });
  test("today's card is zero when today is outside the chosen range", () => {
    assert.equal(stats("custom", "2025-01-01", "2025-01-31").today, 0);
  });
  test("data is identical across rebuilds", () => {
    assert.deepEqual(buildInterestRecords(now), records);
  });
});
