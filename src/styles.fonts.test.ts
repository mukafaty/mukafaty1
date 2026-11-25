import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

type Pointer = { url: string };

const faces = [
  {
    file: "GE_SS_Two_Light",
    weight: "300",
    pointer: new URL("./assets/fonts/GE_SS_Two_Light.otf.asset.json", import.meta.url),
  },
  {
    file: "GE_SS_Two_Medium",
    weight: "500",
    pointer: new URL("./assets/fonts/GE_SS_Two_Medium.otf.asset.json", import.meta.url),
  },
  {
    file: "GE_SS_Two_Bold",
    weight: "700",
    pointer: new URL("./assets/fonts/GE_SS_Two_Bold.otf.asset.json", import.meta.url),
  },
];

test("خط GE SS Two يحمّل ملفات الخط الفعلية من مخزن الأصول", () => {
  for (const face of faces) {
    const pointer = JSON.parse(readFileSync(face.pointer, "utf8")) as Pointer;
    assert.ok(pointer.url.startsWith("/__l5e/assets-v1/"), `${face.file}: رابط غير صالح`);
    assert.ok(
      css.includes(`url("${pointer.url}")`),
      `${face.file}: ملف الخط غير مذكور في @font-face`,
    );
  }
});

test("كل وزن من أوزان GE SS Two معرّف بوزنه الصحيح", () => {
  for (const face of faces) {
    const pointer = JSON.parse(readFileSync(face.pointer, "utf8")) as Pointer;
    const block = css.match(/@font-face\s*\{[^}]*\}/g)?.find((b) => b.includes(pointer.url));
    assert.ok(block, `${face.file}: لا يوجد @font-face للخط`);
    assert.match(block as string, new RegExp(`font-family:\\s*"GE SS Two"`));
    assert.match(block as string, new RegExp(`font-weight:\\s*${face.weight}`));
  }
});

test("صفحة الهبوط تستخدم GE SS Two بوزن متوسط بلا خطوط عريضة", () => {
  const utility = css.match(/@utility landing-v2-font\s*\{[\s\S]*?\n\}/)?.[0];
  assert.ok(utility, "لا يوجد تعريف landing-v2-font");
  assert.match(utility as string, /font-family:\s*"GE SS Two"/);
  assert.match(utility as string, /font-weight:\s*500/);
  assert.match(utility as string, /font-weight:\s*500\s*!important/);
});

test("عناوين مزايا الهبوط وحدها تستخدم وزن GE SS Two Light الفعلي", () => {
  const utility = css.match(/@utility landing-v2-light\s*\{[\s\S]*?\n\}/)?.[0];
  assert.ok(utility, "لا يوجد تعريف landing-v2-light");
  assert.match(utility as string, /font-weight:\s*300\s*!important/);
});

test("حقل رقم الجوال وسنة الفوتر يستخدمان Arial باتجاه LTR", () => {
  const field = css.match(/@utility landing-v2-arial-field\s*\{[\s\S]*?\n\}/)?.[0];
  assert.ok(field, "لا يوجد تعريف landing-v2-arial-field");
  assert.match(field as string, /font-family:\s*Arial/);
  assert.match(field as string, /direction:\s*ltr/);
  assert.match(field as string, /text-align:\s*left/);

  const year = css.match(/@utility landing-v2-year\s*\{[\s\S]*?\n\}/)?.[0];
  assert.ok(year, "لا يوجد تعريف landing-v2-year");
  assert.match(year as string, /font-family:\s*Arial/);
  assert.match(year as string, /direction:\s*ltr/);
  assert.match(year as string, /unicode-bidi:\s*isolate/);
});

test("صفحة الهبوط تربط حقل الجوال وسنة الفوتر بأدواتي Arial", () => {
  const page = readFileSync(
    new URL("./components/landing/ProgramLandingV2.tsx", import.meta.url),
    "utf8",
  );
  const phoneBlock = page.match(/id="landing-v2-phone"[\s\S]*?placeholder="05XXXXXXXX"/)?.[0];
  assert.ok(phoneBlock, "حقل رقم الجوال غير موجود");
  assert.match(phoneBlock as string, /landing-v2-arial-field/);
  assert.match(phoneBlock as string, /lang="en"/);
  assert.match(phoneBlock as string, /type="tel"/);
  assert.match(phoneBlock as string, /inputMode="numeric"/);
  assert.match(phoneBlock as string, /dir="ltr"/);

  const yearBlock = page.match(/<span[^>]*className="[^"]*landing-v2-year[^"]*"[^>]*>\s*2026/)?.[0];
  assert.ok(yearBlock, "سنة الفوتر ليست داخل span مستقل بأداة landing-v2-year");
  assert.match(yearBlock as string, /lang="en"/);
  assert.match(yearBlock as string, /dir="ltr"/);
});

test("أرقام الجوال العربية تتحول إلى أرقام إنجليزية", async () => {
  const { normalizeLandingV2Phone } = await import("./data/landingV2.ts");
  assert.equal(normalizeLandingV2Phone("٠٥٠١٢٣٤٥٦٧"), "0501234567");
  assert.equal(normalizeLandingV2Phone("۰۵۰۱۲۳۴۵۶۷"), "0501234567");
  assert.equal(normalizeLandingV2Phone("+٩٦٦ ٥٠ ١٢٣ ٤٥٦٧"), "966501234567");
});
