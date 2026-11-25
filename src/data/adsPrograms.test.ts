import assert from "node:assert/strict";
import { test } from "node:test";
import { adsPrograms } from "./adsPrograms";

test("حذف دورة استخدام الحاسب في الأعمال المكتبية", () => {
  assert.equal(adsPrograms.some((p) => p.programName === "دورة استخدام الحاسب في الأعمال المكتبية"), false);
});

test("استبدال الإدارة المكتبية بالتصوير الفوتوغرافي", () => {
  assert.equal(adsPrograms.some((p) => p.programName === "دورة الإدارة المكتبية"), false);
  assert.equal(adsPrograms.find((p) => p.id === 9)?.programName, "دورة التصوير الفوتوغرافي");
});

test("استبدال المحاسبة بالتأمين للرجال والنساء", () => {
  assert.equal(adsPrograms.some((p) => p.programName === "دبلوم المحاسبة"), false);
  const insurance = adsPrograms.find((p) => p.id === 11);
  assert.equal(insurance?.programName, "دبلوم التأمين");
  assert.equal(insurance?.targetAudience, "الرجال والنساء");
});

test("إضافة التجارة الإلكترونية للرجال والنساء مع معرف مستقل", () => {
  assert.equal(adsPrograms.find((p) => p.id === 13)?.programName, "دبلوم التجارة الإلكترونية");
  assert.equal(adsPrograms.find((p) => p.id === 13)?.targetAudience, "الرجال والنساء");
  assert.equal(adsPrograms.length, 11);
  assert.equal(new Set(adsPrograms.map((p) => p.id)).size, 11);
});

test("البرامج الجديدة لا ترث رسوم ومدن البرامج المستبدلة", () => {
  for (const id of [9, 11, 13]) {
    const program = adsPrograms.find((p) => p.id === id);
    assert.ok(program);
    assert.equal(program.city, null);
    assert.equal(program.mode, null);
    assert.equal(program.cashFee, null);
    assert.equal(program.installmentFee, null);
    assert.equal(program.cashCommission, null);
    assert.equal(program.installmentCommission, null);
  }
});

test("الرسوم والمكافآت الحالية تبقى دون تغيير", () => {
  assert.equal(adsPrograms.find((p) => p.id === 1)?.cashFee, 10755);
  assert.equal(adsPrograms.find((p) => p.id === 1)?.cashCommission, 538);
  assert.equal(adsPrograms.find((p) => p.id === 2)?.cashFee, 1550);
});