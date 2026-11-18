import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { adStats, adsInPeriod, buildAdRecords, duplicateAd, moveAd, toggleAd } from "./adminAds";

const now = new Date(2026, 10, 18, 21, 0);
const ads = buildAdRecords(now);

describe("admin ads mock", () => {
  test("has 24 ads: 18 active, 4 paused, 2 scheduled", () => {
    assert.deepEqual(adStats(ads), { total: 24, active: 18, paused: 4, scheduled: 2 });
  });
  test("today period only counts ads created today", () => {
    assert.equal(adsInPeriod(ads, "today", now).length, 2);
  });
  test("duplicate creates a draft with a new id, original untouched", () => {
    const next = duplicateAd(ads, "AD-001", now);
    assert.equal(next.length, 25);
    assert.equal(next[24]!.id, "AD-025");
    assert.equal(next[24]!.status, "draft");
    assert.equal(next[0]!.status, "active");
  });
  test("toggle pauses an active ad and updates stats", () => {
    const s = adStats(toggleAd(ads, "AD-001"));
    assert.equal(s.active, 17); assert.equal(s.paused, 5);
  });
  test("move keeps display orders unique", () => {
    const next = moveAd(ads, "AD-002", -1);
    assert.equal(next.find((a) => a.id === "AD-002")!.order, 1);
    assert.equal(new Set(next.map((a) => a.order)).size, 24);
  });
});
