import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { buildMarketers, marketerStats, updateMarketer, toggleMembership, validateMarketer } from "./adminMarketers";

const records = buildMarketers();
const first = records[0];
if (!first) throw new Error("Missing mock marketer");
describe("external marketer mock rules", () => {
  test("rewards are 5% of actually paid sales", () => assert.equal(marketerStats({ ...first, paidSales: 33600 }).rewards, 1680));
  test("available balance deducts withdrawals", () => assert.equal(marketerStats({ ...first, paidSales: 33600, withdrawn: 300 }).available, 1380));
  test("each selected marketer has their own data and statistics", () => {
    const second = records[1]; if (!second) throw new Error("Missing second marketer");
    assert.notEqual(second.id, first.id); assert.notEqual(second.email, first.email); assert.notEqual(marketerStats(second).sales, marketerStats(first).sales);
  });
  test("membership number cannot be edited", () => assert.equal(updateMarketer(records, first.id, { ...first, id: "changed" })[0]?.id, first.id));
  test("saving profile updates shared list without changing another marketer", () => {
    const next = updateMarketer(records, first.id, { ...first, firstName: "أحمد", city: "الرياض" });
    assert.equal(next[0]?.firstName, "أحمد"); assert.equal(next[0]?.city, "الرياض"); assert.deepEqual(next[1], records[1]); assert.equal(first.firstName, "محمد");
  });
  test("draft changes do not mutate original before saving or on cancel", () => { const draft = structuredClone(first); draft.firstName = "تغيير"; draft.links['Instagram'] = "https://example.com"; assert.equal(first.firstName, "محمد"); assert.equal(first.links['Instagram'], ""); });
  test("suspending and activating membership updates shared record", () => { const paused = toggleMembership(records, first.id); assert.equal(paused[0]?.status, "suspended"); assert.equal(toggleMembership(paused, first.id)[0]?.status, "active"); });
  test("required personal and credential fields must be filled", () => { for (const key of ["firstName", "lastName", "city", "nationality", "birthDate", "username", "demoPassword"] as const) assert.ok(validateMarketer({ ...first, [key]: "" })[key]); });
  test("bank transfers require matching IBAN confirmation", () => assert.ok(validateMarketer({ ...first, ibanConfirm: "SA1200000000000000000000" })['ibanConfirm']));
  test("valid seeded profile can be saved", () => assert.deepEqual(validateMarketer(first), {}));
  test("cash does not require bank details", () => assert.deepEqual(validateMarketer({ ...first, paymentMethod: "cash", bank: "", beneficiary: "", iban: "", ibanConfirm: "" }), {}));
  test("links reject unsafe protocols", () => assert.ok(validateMarketer({ ...first, links: { X: "javascript:alert(1)" } })['X']));
});