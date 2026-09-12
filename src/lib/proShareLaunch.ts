import type { ProShareContent, ProSharePlatformId } from "@/data/proShareAd";
import { isMobileDevice } from "@/lib/shareAd";

export type LaunchOutcome =
  | { kind: "shared" }
  | { kind: "opened" }
  | { kind: "cancelled" };

/** رابط الإحالة مع تحديد المنصة — لتتبع مصدر التسجيل */
export function platformLink(content: ProShareContent, platform: ProSharePlatformId): string {
  try {
    const url = new URL(content.referralUrl);
    url.searchParams.set("platform", platform);
    return url.toString();
  } catch {
    return content.referralUrl;
  }
}

/** نص المشاركة الكامل: نص الإعلان + كود الخصم + رابط الإحالة */
export function platformText(content: ProShareContent, platform: ProSharePlatformId): string {
  const base = platform === "x" ? content.xShareText : content.shareText;
  const link = platformLink(content, platform);
  const withCode = base.includes(content.discountCode)
    ? base
    : `${base}\n\nكود الخصم: ${content.discountCode}`;
  return withCode.includes(link) ? withCode : `${withCode}\n\n${link}`;
}

function imageFor(content: ProShareContent, platform: ProSharePlatformId): string {
  const squarePlatforms: ProSharePlatformId[] = ["facebook", "x", "linkedin", "email", "instagram"];
  return squarePlatforms.includes(platform) ? content.imageSquareUrl : content.imageUrl;
}

function openWindow(url: string) {
  if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
}

async function fileFor(url: string, name: string): Promise<File | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new File([blob], name, { type: blob.type || "image/jpeg" });
  } catch {
    return null;
  }
}

/** مشاركة أصلية عبر Web Share API — ترجع null إذا لم تكن مدعومة */
async function tryNativeShare(
  content: ProShareContent,
  platform: ProSharePlatformId,
): Promise<LaunchOutcome | null> {
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  if (!nav?.share) return null;

  const text = platformText(content, platform);
  const file = await fileFor(imageFor(content, platform), `${platform}-ad.jpg`);

  if (file && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ text, files: [file] });
      return { kind: "shared" };
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return { kind: "cancelled" };
    }
  }

  try {
    await nav.share({ title: content.title, text });
    return { kind: "shared" };
  } catch (e) {
    if ((e as Error)?.name === "AbortError") return { kind: "cancelled" };
    return null;
  }
}

/** روابط فتح المنصات على الجوال والكمبيوتر */
const openOnly: Record<string, { mobile: string; desktop: string }> = {
  snapchat: { mobile: "snapchat://", desktop: "https://www.snapchat.com/" },
  tiktok: { mobile: "https://www.tiktok.com/", desktop: "https://www.tiktok.com/upload" },
  instagram: { mobile: "instagram://app", desktop: "https://www.instagram.com/" },
};

/**
 * فتح المنصة المناسبة للإعلان الحالي.
 * الجوال: مشاركة أصلية عند دعمها. الكمبيوتر: رابط المشاركة الرسمي للمنصة.
 * المنصات التي لا تدعم النشر من الويب: تُفتح فقط.
 */
export async function launchPlatform(
  platform: ProSharePlatformId,
  content: ProShareContent,
): Promise<LaunchOutcome> {
  const mobile = isMobileDevice();
  const link = platformLink(content, platform);
  const text = platformText(content, platform);

  // منصات لا تدعم النشر المباشر — نفتحها فقط
  const target = openOnly[platform];
  if (target) {
    openWindow(mobile ? target.mobile : target.desktop);
    return { kind: "opened" };
  }

  if (mobile) {
    const native = await tryNativeShare(content, platform);
    if (native) return native;
  }

  switch (platform) {
    case "whatsapp":
      openWindow(`https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`);
      return { kind: "opened" };
    case "telegram":
      openWindow(
        `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(content.shareText)}`,
      );
      return { kind: "opened" };
    case "facebook":
      openWindow(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(content.shareText)}`,
      );
      return { kind: "opened" };
    case "x":
      openWindow(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.xShareText)}&url=${encodeURIComponent(link)}`,
      );
      return { kind: "opened" };
    case "linkedin":
      openWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`);
      return { kind: "opened" };
    case "email": {
      const body = `${content.shareText}\n\nكود الخصم: ${content.discountCode}\n\n${link}`;
      if (typeof window !== "undefined") {
        window.location.href = `mailto:?subject=${encodeURIComponent(content.title)}&body=${encodeURIComponent(body)}`;
      }
      return { kind: "opened" };
    }
    default:
      return { kind: "opened" };
  }
}
