import assert from "node:assert/strict";
import { test } from "node:test";
import { adsPrograms, commissionOf, matchesCity } from "./adsPrograms";

const byName = (n: string) => adsPrograms.find((p) => p.programName === n);

test("عمولة 5% من الرسوم بعد الخصم بدقة منزلتين", () => {
  assert.equal(commissionOf(8055), 402.75);
  assert.equal(commissionOf(10755), 537.75);
  assert.equal(commissionOf(6750), 337.5);
  assert.equal(commissionOf(2450), 122.5);
  assert.equal(commissionOf(3000), 150);
  assert.equal(commissionOf(390), 19.5);
});

test("حذف دورة إدخال البيانات وإضافة الذكاء الاصطناعي", () => {
  assert.equal(byName("دورة إدخال البيانات ومعالجة النصوص"), undefined);
  const ai = byName("دبلوم الذكاء الاصطناعي");
  assert.equal(ai?.city, "جدة");
  assert.equal(ai?.originalFee, 11950);
  assert.equal(ai?.cashCommission, 537.75);
  assert.equal(adsPrograms.length, 11);
});

test("بيانات البطاقات المحددة", () => {
  assert.equal(byName("دبلوم إدارة الموارد البشرية عن بُعد")?.city, "جميع المدن");
  assert.equal(byName("دبلوم البرمجيات")?.isNew, false);
  assert.equal(byName("دبلوم السلامة والصحة المهنية")?.discount, 10);
  assert.equal(byName("دبلوم إدارة الخدمات اللوجستية")?.city, "جدة");
  assert.equal(byName("دبلوم التجارة الإلكترونية عن بُعد")?.cashCommission, 337.5);
  const photo = byName("دورة التصوير الفوتوغرافي");
  assert.equal(photo?.targetAudience, "رجال");
  assert.equal(photo?.installmentCommission, 150);
  const en = byName("دورة اللغة الإنجليزية عن بُعد");
  assert.equal(en?.cashFee, 390);
  assert.equal(en?.marketingText, undefined);
});

test("برامج جميع المدن تظهر عند اختيار أي مدينة", () => {
  assert.equal(matchesCity("جميع المدن", "الرياض"), true);
  assert.equal(matchesCity("جدة", "الرياض"), false);
  assert.equal(matchesCity("جدة", ""), true);
});
