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
