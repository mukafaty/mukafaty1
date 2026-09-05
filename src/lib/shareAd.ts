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
  | { kind: "manual" } // تم تجهيز الصورة والنص لينشرها المستخدم بنفسه
  | { kind: "cancelled" }
  | { kind: "error"; message: string };

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
        const native = await tryNativeShare(ad, platform, true);
        if (native && native.kind !== "error") return native;
        openWindow(`https://wa.me/?text=${encodeURIComponent(text)}`);
        return { kind: "opened" };
      }

      case "telegram": {
        const native = await tryNativeShare(ad, platform, true);
        if (native && native.kind !== "error") return native;
        openWindow(
          `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(ad.marketingText)}`,
        );
        return { kind: "opened" };
      }

      case "x": {
        openWindow(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(ad.marketingText)}&url=${encodeURIComponent(link)}`,
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
      // نستخدم مشاركة الجهاز إن توفرت، وإلا نجهّز الصورة والنص وننقل المستخدم للمنصة
      case "instagram":
      case "tiktok":
      case "snapchat": {
        const native = await tryNativeShare(ad, platform, true);
        if (native && native.kind !== "error") return native;

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
