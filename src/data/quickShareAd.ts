import portraitAsset from "@/assets/ad-portrait.jpg.asset.json";
import squareAsset from "@/assets/ad-square.png.asset.json";

/** المنصات المدعومة — قيم ثابتة موحدة */
export const SHARE_PLATFORMS = [
  "whatsapp",
  "telegram",
  "x",
  "instagram",
  "facebook",
  "tiktok",
  "snapchat",
  "email",
] as const;

export type SharePlatform = (typeof SHARE_PLATFORMS)[number];

export interface AdData {
  programId: string;
  title: string;
  status: "available" | "paused";
  trainingMode: string;
  location: string;
  targetAudience: string;
  ageRange: string;
  referralCode: string;
  discountCode: string;
  baseReferralLink: string;
  cashFee: number;
  rewardPerRegistration: number;
  marketingText: string;
  imagePortraitUrl: string;
  imageSquareUrl: string;
  /** جاهز للاستخدام مستقبلًا */
  imageLandscapeUrl?: string;
}

/** بيانات تجريبية (Mock) — قابلة للاستبدال لاحقًا ببيانات من قاعدة البيانات */
export const quickShareAd: AdData = {
  programId: "HR-DIPLOMA",
  title: "دبلوم إدارة الموارد البشرية عن بُعد",
  status: "available",
  trainingMode: "عن بُعد",
  location: "جميع مدن المملكة",
  targetAudience: "رجال",
  ageRange: "18 إلى 40 عام",
  referralCode: "ahmed2487",
  discountCode: "AHMED15",
  baseReferralLink: "https://mukafaty.com/ref/ahmed2487",
  cashFee: 9500,
  rewardPerRegistration: 475,
  marketingText: `ارتقِ بمهاراتك الإدارية وكن جاهزًا لسوق العمل 💼

سجّل في دبلوم إدارة الموارد البشرية بنمط التدريب الإلكتروني المدمج 🎓

شهادة جامعية متوسطة معتمدة📚
79 وحدة — عامين ونصف
📍 حضوري وعن بُعد
✅ معتمد في القطاعات الحكومية والعسكرية
📈 إمكانية التجسير للبكالوريوس
💳 أقساط شهرية ميسرة تبدأ من 500 ريال
🏦 خطط سداد ميسرة عبر بنك التنمية الاجتماعية`,
  imagePortraitUrl: portraitAsset.url,
  imageSquareUrl: squareAsset.url,
};
