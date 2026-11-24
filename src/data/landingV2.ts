import hrAdAsset from "@/assets/landing/hr-ad.jpg.asset.json";
import mharatLogoAsset from "@/assets/landing/mharat-logo.jpg.asset.json";
import topLogosAsset from "@/assets/landing/top-logos.png.asset.json";
import footerLogosAsset from "@/assets/landing/footer-logos.png.asset.json";

export interface LandingV2FormValues {
  fullName: string;
  city: string;
  phone: string;
  email: string;
}

export interface LandingV2FormErrors {
  fullName?: string;
  city?: string;
  phone?: string;
  email?: string;
}

const PHONE_REGEX = /^(\+?\d[\d\s-]{7,14})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** نفس قواعد التحقق المستخدمة في صفحة الهبوط الحالية. */
export function validateLandingV2Form(values: LandingV2FormValues): LandingV2FormErrors {
  const errors: LandingV2FormErrors = {};
  if (!values.fullName.trim()) errors.fullName = "الرجاء تعبئة هذا الحقل.";
  if (!values.city.trim()) errors.city = "الرجاء تعبئة هذا الحقل.";
  if (!values.phone.trim()) errors.phone = "الرجاء تعبئة هذا الحقل.";
  else if (!PHONE_REGEX.test(values.phone.trim())) errors.phone = "يرجى إدخال رقم جوال صحيح.";
  if (values.email.trim() && !EMAIL_REGEX.test(values.email.trim()))
    errors.email = "يرجى إدخال بريد إلكتروني صحيح.";
  return errors;
}

export interface LandingProgramConfig {
  slug: string;
  title: string;
  subtitle: string;
  details: {
    mode: string;
    units: string;
    audience: string;
    duration: string;
  };
  providerLogo: string;
  providerLogoAlt: string;
  adImage: string;
  adImageAlt: string;
  accreditationLogos: string;
  accreditationLogosAlt: string;
  partnerLogos: string;
  partnerLogosAlt: string;
}

/** قالب العرض مستقل عن بيانات البرنامج لإعادة استخدامه مع برامج أخرى لاحقًا. */
export const hrDiplomaLanding: LandingProgramConfig = {
  slug: "hr-diploma",
  title: "دبلوم إدارة الموارد البشرية - عن بُعد",
  subtitle: "انتقل بمستواك المهني إلى مستويات جديدة من الإدارة والتميز",
  details: {
    mode: "عن بُعد",
    units: "79 وحدة تدريبية معتمدة",
    audience: "للرجال والنساء",
    duration: "عامان ونصف",
  },
  providerLogo: mharatLogoAsset.url,
  providerLogoAlt: "مهارات للتقنية وتنمية الموارد البشرية",
  adImage: hrAdAsset.url,
  adImageAlt: "إعلان دبلوم إدارة الموارد البشرية بنمط التدريب الإلكتروني عن بُعد",
  accreditationLogos: topLogosAsset.url,
  accreditationLogosAlt: "شعارات الاعتمادات: المؤسسة العامة للتدريب التقني والمهني، المركز الوطني للتعليم الإلكتروني، منار، والإطار الوطني للمؤهلات",
  partnerLogos: footerLogosAsset.url,
  partnerLogosAlt: "شعارات الجهات المشاركة: معهد جدة الدولي العالي للتدريب، جدارات، بنك التنمية الاجتماعية، والمعهد السعودي العالي للتدريب",
};
