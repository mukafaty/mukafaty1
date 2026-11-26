import assert from "node:assert/strict";
import { test } from "node:test";
import { adsPrograms, commissionOf, displayedCommission, matchesCity } from "./adsPrograms";

const byName = (n: string) => adsPrograms.find((p) => p.programName === n);

test("عمولة 5% من الرسوم بعد الخصم بدقة منزلتين داخليًا", () => {
  assert.equal(commissionOf(8055), 402.75);
  assert.equal(commissionOf(10755), 537.75);
  assert.equal(commissionOf(6750), 337.5);
  assert.equal(commissionOf(2450), 122.5);
  assert.equal(commissionOf(3000), 150);
  assert.equal(commissionOf(390), 19.5);
});

test("العمولة المعروضة عدد صحيح دون تغيير الحساب الداخلي", () => {
  assert.equal(displayedCommission(537.75), 538);
  assert.equal(displayedCommission(402.75), 403);
  assert.equal(byName("دبلوم الأمن السيبراني")?.cashCommission, 537.75);
  assert.equal(displayedCommission(byName("دبلوم الأمن السيبراني")!.cashCommission!), 538);
});

test("بطاقة دبلوم الأمن السيبراني بالبيانات المعتمدة", () => {
  const cyber = byName("دبلوم الأمن السيبراني");
  assert.equal(cyber?.programType, "دبلوم");
  assert.equal(cyber?.city, "جدة");
  assert.equal(cyber?.targetAudience, "الرجال والنساء");
  assert.equal(cyber?.originalFee, 11950);
  assert.equal(cyber?.cashFee, 10755);
  assert.equal(cyber?.discount, 10);
  assert.equal(cyber?.marketingText, "أقساط شهرية ميسرة تبدأ من 500 ريال فقط");
  assert.match(cyber?.image ?? "", /ads-cyber\.webp$/);
  assert.equal(adsPrograms.length, 12);
});

test("شارة جديد لإدارة الأعمال فقط ولا تجتمع مع شارة الخصم", () => {
  assert.deepEqual(adsPrograms.filter((p) => p.isNew).map((p) => p.programName), ["دبلوم إدارة الأعمال"]);
  assert.equal(byName("دبلوم إدارة الأعمال")?.discount, undefined);
  assert.equal(byName("دبلوم إدارة الأعمال")?.cashFee, 8055);
  assert.equal(byName("دبلوم إدارة الأعمال")?.originalFee, 8950);
  assert.equal(adsPrograms.every((p) => !(p.isNew && p.discount)), true);
});

test("بيانات البطاقات المحددة", () => {
  assert.equal(byName("دبلوم إدارة الموارد البشرية عن بُعد")?.city, "جميع المدن");
  assert.equal(byName("دبلوم البرمجيات")?.isNew, false);
  assert.equal(byName("دبلوم السلامة والصحة المهنية")?.discount, 10);
  assert.equal(byName("دبلوم إدارة الخدمات اللوجستية")?.city, "جدة");
  assert.equal(byName("دبلوم التجارة الإلكترونية عن بُعد")?.cashCommission, 337.5);
  assert.equal(byName("دبلوم التأمين عن بُعد")?.marketingText, "أقساط شهرية ميسرة تبدأ من 375 ريال فقط");
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
