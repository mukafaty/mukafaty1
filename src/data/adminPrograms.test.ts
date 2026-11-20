import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { buildProgramRecords, programStats, filterPrograms, toggleProgram, paginatePrograms, EMPTY_PROGRAM_FILTERS } from "./adminPrograms";

const records = buildProgramRecords();
describe("admin programs mock rules", () => {
  test("has 24 programs", () => assert.equal(records.length, 24));
  test("has 20 active programs", () => assert.equal(programStats(records).active, 20));
  test("has 4 paused programs", () => assert.equal(programStats(records).paused, 4));
  test("only active and paused statuses exist", () => {
    assert.deepEqual([...new Set(records.map((p) => p.status))].sort(), ["active", "paused"]);
  });
  test("one record per program regardless of cities", () => {
    assert.equal(new Set(records.map((p) => p.id)).size, 24);
    assert.equal(new Set(records.map((p) => p.name)).size, 24);
    const matches = filterPrograms(records, { ...EMPTY_PROGRAM_FILTERS, query: "دبلوم إدارة الموارد البشرية" });
    assert.equal(matches.length, 1);
    assert.deepEqual(matches[0]?.cities, ["الرياض", "جدة"]);
  });
  test("only diploma, course, and English program types", () => {
    assert.deepEqual([...new Set(records.map((p) => p.type))].sort(), ["دبلوم", "دورة", "لغة إنجليزية"].sort());
  });
  test("only in-person, remote, and blended modes", () => {
    assert.deepEqual([...new Set(records.map((p) => p.mode))].sort(), ["حضوري", "عن بُعد", "مدمج"].sort());
  });
  test("search matches program name", () => {
    assert.deepEqual(filterPrograms(records, { ...EMPTY_PROGRAM_FILTERS, query: "  التسويق الرقمي  " }).map((p) => p.id), ["PR-003"]);
  });
  test("type filter selects English programs", () => {
    assert.equal(filterPrograms(records, { ...EMPTY_PROGRAM_FILTERS, type: "لغة إنجليزية" }).length, 6);
  });
  test("city filter includes multi-city programs exactly once", () => {
    assert.deepEqual(filterPrograms(records, { ...EMPTY_PROGRAM_FILTERS, city: "ينبع" }).map((p) => p.id), ["PR-002", "PR-003", "PR-005", "PR-006", "PR-009", "PR-012", "PR-015", "PR-021", "PR-024"]);
  });
  test("training mode filter", () => {
    assert.equal(filterPrograms(records, { ...EMPTY_PROGRAM_FILTERS, mode: "مدمج" }).length, 6);
  });
  test("status filter selects 4 paused programs", () => {
    assert.equal(filterPrograms(records, { ...EMPTY_PROGRAM_FILTERS, status: "paused" }).length, 4);
  });
  test("filters combine together", () => {
    assert.deepEqual(filterPrograms(records, { query: "الموارد", type: "دبلوم", city: "جدة", mode: "حضوري", status: "active" }).map((p) => p.id), ["PR-001"]);
  });
  test("clearing filters restores all 24 programs", () => {
    assert.equal(filterPrograms(records, EMPTY_PROGRAM_FILTERS).length, 24);
  });
  test("pause updates statistics without mutating the original", () => {
    const next = toggleProgram(records, "PR-001");
    assert.equal(next.find((p) => p.id === "PR-001")?.status, "paused");
    assert.deepEqual(programStats(next), { total: 24, active: 19, paused: 5 });
    assert.equal(records.find((p) => p.id === "PR-001")?.status, "active");
  });
  test("activate updates statistics", () => {
    const next = toggleProgram(records, "PR-008");
    assert.equal(next.find((p) => p.id === "PR-008")?.status, "active");
    assert.deepEqual(programStats(next), { total: 24, active: 21, paused: 3 });
  });
  test("pagination defaults to 10 programs and 3 pages", () => {
    assert.equal(paginatePrograms(records, 1).visible.length, 10);
    assert.equal(paginatePrograms(records, 1).pages, 3);
    assert.equal(paginatePrograms(records, 2).visible[0]?.id, "PR-011");
    assert.equal(paginatePrograms(records, 3).visible.length, 4);
  });
  test("pagination clamps after filtering and handles no matches", () => {
    const paused = filterPrograms(records, { ...EMPTY_PROGRAM_FILTERS, status: "paused" });
    assert.equal(paginatePrograms(paused, 3).current, 1);
    assert.deepEqual(paginatePrograms([], 1).visible, []);
  });
});