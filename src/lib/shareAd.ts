import type { AdData, SharePlatform } from "@/data/quickShareAd";

/** ينشئ رابط إحالة خاص بالمنصة: ...?platform=whatsapp */
export function buildPlatformReferralLink(
  baseReferralLink: string,
  platform: SharePlatform,
): string {
  const url = new URL(baseReferralLink);
  url.searchParams.set("platform", platform);
  return url.toString();
}

/** اختيار الصورة الأنسب لكل منصة — مركزي وقابل للتعديل */
export function pickImageUrl(ad: AdData, platform: SharePlatform): string {
  const squarePlatforms: SharePlatform[] = ["instagram", "facebook", "x", "email"];
  return squarePlatforms.includes(platform) ? ad.imageSquareUrl : ad.imagePortraitUrl;
}

/** نص المشاركة = النص التسويقي + رابط الإحالة الخاص بالمنصة */
export function buildShareText(ad: AdData, platform: SharePlatform): string {
  const link = buildPlatformReferralLink(ad.baseReferralLink, platform);
  return `${ad.marketingText}\n\n${link}`;
}

export type ShareOutcome =
  | { kind: "native" } // تمت المشاركة عبر نافذة مشاركة الجهاز
  | { kind: "opened" } // تم فتح المنصة لإكمال النشر
  | { kind: "manual"; detail?: string } // تم تجهيز الصورة والنص لينشرها المستخدم بنفسه
  | { kind: "cancelled" }
  | { kind: "error"; message: string };

/** يكشف ما إذا كان المستخدم على جهاز جوال/لوحي أم كمبيوتر */
export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua)) return true;
  // أجهزة لوحية تعمل باللمس بنظام iPadOS تظهر كـ Mac
  return navigator.maxTouchPoints > 1 && /Mac/i.test(ua);
}


async function fetchImageFile(url: string, name: string): Promise<File | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new File([blob], name, { type: blob.type || "image/jpeg" });
  } catch {
    return null;
  }
}

async function tryNativeShare(
  ad: AdData,
  platform: SharePlatform,
  withImage: boolean,
): Promise<ShareOutcome | null> {
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  if (!nav?.share) return null;

  const text = buildShareText(ad, platform);
  const imageUrl = pickImageUrl(ad, platform);

  if (withImage) {
    const file = await fetchImageFile(imageUrl, `${ad.programId}.jpg`);
    if (file && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ text, files: [file] });
        return { kind: "native" };
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return { kind: "cancelled" };
      }
    }
  }

  try {
    await nav.share({ title: ad.title, text });
    return { kind: "native" };
  } catch (e) {
    if ((e as Error)?.name === "AbortError") return { kind: "cancelled" };
    return null;
  }
}

function openWindow(url: string) {
  if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** ينسخ الصورة إلى حافظة النظام (PNG فقط) — مدعوم في Chrome/Edge */
async function copyImageToClipboard(url: string): Promise<boolean> {
  try {
    if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
    const res = await fetch(url);
    if (!res.ok) return false;
    let blob = await res.blob();
    if (blob.type !== "image/png") {
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
      const png = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
      if (!png) return false;
      blob = png;
    }
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch {
    return false;
  }
}

function downloadImage(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * منطق المشاركة المركزي.
 * يختار أفضل آلية رسمية متاحة لكل منصة، والمستخدم هو من يكمل النشر.
 */
export async function shareAd(
  platform: SharePlatform,
  ad: AdData,
): Promise<ShareOutcome> {
  const link = buildPlatformReferralLink(ad.baseReferralLink, platform);
  const text = buildShareText(ad, platform);
  const imageUrl = pickImageUrl(ad, platform);

  try {
    switch (platform) {
      case "whatsapp": {
        // الجوال: الطريقة الحالية الناجحة (مشاركة الجهاز مع الصورة ثم wa.me)
        if (isMobileDevice()) {
          const native = await tryNativeShare(ad, platform, true);
          if (native && native.kind !== "error") return native;
        }
        // الكمبيوتر: فتح WhatsApp Web مباشرة (وليس wa.me) —
        // wa.me قد يحوّل إلى تطبيق سطح المكتب عبر whatsapp://
        // وهو ما يكسر ترميز UTF-8 للإيموجي والنص العربي على ويندوز
        openWindow(`https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`);
        return { kind: "opened" };
      }

      case "telegram": {
        // الجوال: الطريقة الحالية الناجحة (مشاركة الجهاز مع الصورة ثم t.me)
        if (isMobileDevice()) {
          const native = await tryNativeShare(ad, platform, true);
          if (native && native.kind !== "error") return native;
        }
        // الكمبيوتر: فتح Telegram Web عبر رابط المشاركة مع النص + رابط الإعلان
        openWindow(
          `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(ad.marketingText)}`,
        );
        return { kind: "opened" };
      }

      case "x": {
        // نص قصير مخصص لمنصة X — لا نستخدم النص التسويقي الطويل
        const baseText = `دبلوم إدارة الموارد البشرية - عن بُعد 🎓
طوّر مهاراتك الإدارية واستعد لسوق العمل.
سجّل الآن واستفد من الفرص المتاحة.`;
        // X تحتسب أي رابط بـ 23 حرفًا بغض النظر عن طوله الفعلي
        const X_LIMIT = 280;
        const urlWeightedLength = 23;
        const allowedTextLength = X_LIMIT - urlWeightedLength;
        const xText =
          baseText.length > allowedTextLength
            ? `${baseText.slice(0, allowedTextLength - 1).trimEnd()}…`
            : baseText;
        openWindow(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}&url=${encodeURIComponent(link)}`,
        );
        return { kind: "opened" };
      }

      case "facebook": {
        openWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(ad.marketingText)}`,
        );
        return { kind: "opened" };
      }

      case "email": {
        const body = `${ad.marketingText}\n\n${link}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(ad.title)}&body=${encodeURIComponent(body)}`;
        return { kind: "opened" };
      }

      // منصات لا تسمح بالنشر المباشر من متصفح الويب:
      // الجوال: نستخدم مشاركة الجهاز الأصلية إن توفرت.
      // الكمبيوتر: لا نستخدم مشاركة النظام (مثل Windows Share) —
      // نجهّز الصورة والنص وننقل المستخدم للمنصة ليكمل النشر بنفسه.
      case "instagram": {
        if (isMobileDevice()) {
          const native = await tryNativeShare(ad, platform, true);
          if (native && native.kind !== "error") return native;
        }

        // الكمبيوتر: إنستغرام ويب لا تدعم تمرير النص أو الصورة عبر رابط.
        // نجهّز الصورة المربعة (حافظة النظام إن أمكن، وإلا ملف جاهز للرفع)
        // ونضع النص + الرابط في الحافظة، ثم نفتح شاشة إنشاء منشور مباشرة.
        const imageOnClipboard = await copyImageToClipboard(imageUrl);
        downloadImage(imageUrl, `${ad.programId}-instagram.png`);
        const textCopied = await copyText(text);
        openWindow("https://www.instagram.com/create/select/");
        return {
          kind: "manual",
          detail: textCopied
            ? `تم فتح شاشة إنشاء منشور في إنستغرام، والصورة المربعة${imageOnClipboard ? " متاحة للصق أيضًا" : " جاهزة للرفع"}، والنص مع الرابط منسوخ للصق في الوصف`
            : "تم فتح شاشة إنشاء منشور في إنستغرام والصورة جاهزة للرفع",
        };
      }

      case "tiktok":
      case "snapchat": {
        if (isMobileDevice()) {
          const native = await tryNativeShare(ad, platform, true);
          if (native && native.kind !== "error") return native;
        }

        await copyText(text);
        downloadImage(imageUrl, `${ad.programId}-${platform}.jpg`);
        const targets: Record<string, string> = {
          instagram: "https://www.instagram.com/",
          tiktok: "https://www.tiktok.com/upload",
          snapchat: "https://www.snapchat.com/",
        };
        openWindow(targets[platform]!);
        return { kind: "manual" };
      }

      default:
        return { kind: "error", message: "منصة غير مدعومة" };
    }
  } catch (e) {
    return { kind: "error", message: (e as Error)?.message ?? "تعذر تجهيز المشاركة" };
  }
}
