/** بيانات تجريبية (Mock) لمنطق الإحالة وأكواد الخصم — بدون قاعدة بيانات */
import diplomaAdAsset from "@/assets/landing/HR-diploma-ad.jpg.asset.json";

export interface Marketer {
  id: string;
  name: string;
  referralCode: string;
}

export interface DiscountCode {
  id: string;
  marketerId: string;
  code: string;
  discountPercentage: number;
  campaignName: string;
  /** null = صالح لجميع البرامج */
  programId: string | null;
  startDate: string | null;
  endDate: string | null;
  status: "active" | "inactive";
}

export interface AdProgram {
  slug: string;
  title: string;
  cashFee: number;
  /** بيانات Open Graph الخاصة بكل إعلان */
  ogTitle: string;
  ogDescription: string;
  /** مسار الصورة (نسبي) — يتحول إلى رابط مطلق عند البناء */
  ogImage: string;
}

/** النطاق العام المستخدم لبناء الروابط المطلقة في Open Graph */
export const SITE_ORIGIN = "https://www.mukafaty.com";

export const toAbsoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_ORIGIN}${path}`;

export const marketers: Marketer[] = [
  { id: "demo-ahmed", name: "أحمد", referralCode: "AHMED2487" },
];

export const discountCodes: DiscountCode[] = [
  {
    id: "discount-national",
    marketerId: "demo-ahmed",
    code: "AHMED-NAT-15",
    discountPercentage: 15,
    campaignName: "اليوم الوطني",
    programId: null,
    startDate: null,
    endDate: null,
    status: "active",
  },
  {
    id: "discount-ramadan",
    marketerId: "demo-ahmed",
    code: "AHMED-RAM-10",
    discountPercentage: 10,
    campaignName: "رمضان",
    programId: null,
    startDate: null,
    endDate: null,
    status: "active",
  },
  {
    id: "discount-summer",
    marketerId: "demo-ahmed",
    code: "AHMED-SUMMER-20",
    discountPercentage: 20,
    campaignName: "الصيف",
    programId: null,
    startDate: null,
    endDate: null,
    status: "inactive",
  },
];

export const adPrograms: AdProgram[] = [
  {
    slug: "hr-diploma",
    title: "دبلوم إدارة الموارد البشرية - عن بُعد",
    cashFee: 9500,
    ogTitle: "دبلوم إدارة الموارد البشرية - عن بُعد",
    ogDescription: "انتقل بمستواك المهني إلى مستويات جديدة من الإدارة والتميز",
    ogImage: diplomaAdAsset.url,
  },
];

const normalize = (value: string) => value.trim().toUpperCase();

export function getAdProgram(slug: string): AdProgram {
  const found = adPrograms.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  return found ?? adPrograms[0]!;
}

export function findMarketerByReferralCode(code: string | undefined | null): Marketer | null {
  if (!code) return null;
  const value = normalize(code);
  return marketers.find((m) => normalize(m.referralCode) === value) ?? null;
}

export function findDiscountCode(code: string | undefined | null): DiscountCode | null {
  if (!code) return null;
  const value = normalize(code);
  return discountCodes.find((d) => normalize(d.code) === value) ?? null;
}

function isUsable(discount: DiscountCode, programId: string): boolean {
  if (discount.status !== "active") return false;
  if (discount.programId && discount.programId.toLowerCase() !== programId.toLowerCase()) return false;
  return true;
}

export function isDiscountValid(discount: DiscountCode, programId: string): boolean {
  return isUsable(discount, programId);
}

/** أول كود خصم فعّال مرتبط بالمسوق وبالبرنامج الحالي */
export function findActiveDiscountForMarketer(
  marketerId: string,
  programId: string,
): DiscountCode | null {
  return (
    discountCodes.find((d) => d.marketerId === marketerId && isUsable(d, programId)) ?? null
  );
}

export function calculateFinalPrice(basePrice: number, discountPercentage: number): number {
  return Math.round(basePrice - (basePrice * discountPercentage) / 100);
}

/** حالة الإسناد الداخلية — لا تُعرض للعميل */
export interface AttributionState {
  marketerId: string | null;
  referralCode: string | null;
  discountCode: string | null;
  discountPercentage: number | null;
  campaignName: string | null;
  platform: string | null;
}
