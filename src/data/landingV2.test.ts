import assert from "node:assert/strict";
import { test } from "node:test";
import { hrDiplomaLanding, normalizeLandingV2Phone, validateLandingV2Form } from "./landingV2";

const validValues = {
  fullName: "مستخدم تجريبي",
  city: "الرياض",
  phone: "0500000000",
  email: "",
};

test("الاسم والمدينة والجوال حقول إجبارية", () => {
  const errors = validateLandingV2Form({ fullName: "", city: "", phone: "", email: "" });
  assert.equal(errors.fullName, "الرجاء تعبئة هذا الحقل.");
  assert.equal(errors.city, "الرجاء تعبئة هذا الحقل.");
  assert.equal(errors.phone, "الرجاء تعبئة هذا الحقل.");
});

test("الجوال والبريد المدخلان يجب أن يكونا صحيحين", () => {
  const errors = validateLandingV2Form({ ...validValues, phone: "123", email: "invalid" });
  assert.equal(errors.phone, "يرجى إدخال رقم جوال صحيح.");
  assert.equal(errors.email, "يرجى إدخال بريد إلكتروني صحيح.");
});

test("البريد اختياري وتقبل البيانات المكتملة دون أخطاء", () => {
  assert.deepEqual(validateLandingV2Form(validValues), {});
  assert.deepEqual(validateLandingV2Form({ ...validValues, email: "test@example.com" }), {});
});

test("حقل الجوال يحوّل الأرقام العربية والفارسية إلى أرقام إنجليزية", () => {
  assert.equal(normalizeLandingV2Phone("٠٥١٢٣٤٥٦٧٨"), "0512345678");
  assert.equal(normalizeLandingV2Phone("۰۵۱۲۳۴۵۶۷۸"), "0512345678");
});

test("حقل الجوال يستبعد الحروف والرموز ويُبقي الأرقام الإنجليزية فقط", () => {
  assert.equal(normalizeLandingV2Phone("05a12-34 ٥"), "0512345");
});

test("قيمة عدد الوحدات بلا كلمة تدريبية وفي سطر واحد", () => {
  assert.equal(hrDiplomaLanding.details.units, "79 وحدة معتمدة");
  assert.equal(hrDiplomaLanding.details.units.includes("\n"), false);
});
