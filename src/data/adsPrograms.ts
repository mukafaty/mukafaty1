import hrImg from "@/assets/program-hr.webp.asset.json";
import aiImg from "@/assets/program-ai.webp.asset.json";
import devImg from "@/assets/program-dev.webp.asset.json";
import financeImg from "@/assets/program-ins.webp.asset.json";
import businessImg from "@/assets/program-business.webp.asset.json";
import logisticsImg from "@/assets/program-logistics.webp.asset.json";
import officeDiplomaImg from "@/assets/program-office-diploma.webp.asset.json";
import officeCourseImg from "@/assets/program-photo.webp.asset.json";
import safetyImg from "@/assets/program-safety.webp.asset.json";
import englishRemoteImg from "@/assets/program-english-remote.webp.asset.json";
import cyberImg from "@/assets/ads-cyber.webp.asset.json";

export type ProgramType = "دبلوم" | "دورة";
export type TrainingMode = "عن بُعد" | "حضوري" | "مدمج";
export type Audience = "رجال" | "نساء" | "الرجال والنساء";
export type City = "جدة" | "الرياض" | "مكة المكرمة" | "ينبع" | "جميع المدن";

import ecommImg from "@/assets/program-ecomm.webp.asset.json";

export type Program = {
  id: number;
  programName: string;
  programType: ProgramType;
  city: City | null;
  targetAudience: Audience;
  mode: TrainingMode | null;
  image: string;
  cashFee: number | null;
  cashCommission: number | null;
  installmentFee: number | null;
  installmentCommission: number | null;
  discount?: number;
  /** الرسوم قبل الخصم */
  originalFee?: number;
  /** وحدة الرسوم مثل «للمستوى الواحد» */
  feeUnit?: string;
  isNew: boolean;
  marketingText?: string;
  promotionalText?: string;
  createdAt: string;
};

export const COMMISSION_RATE = 0.05;

/** عمولة 5% من الرسوم الفعلية بعد الخصم، بدقة منزلتين عشريتين دون تقريب لعدد صحيح. */
export const commissionOf = (fee: number) => Math.round(fee * COMMISSION_RATE * 100) / 100;

/** تقريب مخصص للعرض فقط؛ تبقى العمولة الداخلية محسوبة بدقة 5%. */
export const displayedCommission = (commission: number) => Math.round(commission);

export const CITIES: City[] = ["جدة", "مكة المكرمة", "الرياض", "ينبع"];
/** برنامج متاح لجميع المدن يظهر عند اختيار أي مدينة. */
export const matchesCity = (programCity: City | null, selected: string) =>
  !selected || selected === "جميع المدن" || programCity === selected || programCity === "جميع المدن";
export const ALL_CITIES = "جميع المدن";
export const CITY_OPTIONS: string[] = [...CITIES, ALL_CITIES];
export const KINDS: ProgramType[] = ["دبلوم", "دورة"];
export const MODES: TrainingMode[] = ["عن بُعد", "حضوري", "مدمج"];
export const AUDIENCES: Audience[] = ["رجال", "نساء", "الرجال والنساء"];
export const SORTS = ["جديد", "الأحدث", "الأعلى عمولة"] as const;
export type SortKey = (typeof SORTS)[number];

type RawProgram = Omit<Program, "cashCommission" | "installmentCommission">;

const raw: RawProgram[] = [
  {
    id: 8,
    programName: "دبلوم إدارة الموارد البشرية عن بُعد",
    image: hrImg.url,
    city: "جميع المدن",
    programType: "دبلوم",
    mode: "عن بُعد",
    targetAudience: "الرجال والنساء",
    cashFee: 8055,
    installmentFee: 8055,
    isNew: false,
    createdAt: "2026-07-15",
    originalFee: 8950,
    discount: 10,
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 1,
    programName: "دبلوم البرمجيات",
    image: devImg.url,
    city: "جدة",
    programType: "دبلوم",
    mode: "حضوري",
    targetAudience: "الرجال والنساء",
    cashFee: 10755,
    installmentFee: 10755,
    isNew: false,
    createdAt: "2026-08-20",
    originalFee: 11950,
    discount: 10,
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 6,
    programName: "دبلوم إدارة الأعمال",
    image: businessImg.url,
    city: "جدة",
    programType: "دبلوم",
    mode: "حضوري",
    targetAudience: "رجال",
    cashFee: 8055,
    installmentFee: 8055,
    isNew: true,
    createdAt: "2026-07-22",
    originalFee: 8950,
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 3,
    programName: "دبلوم السلامة والصحة المهنية",
    image: safetyImg.url,
    city: "جدة",
    programType: "دبلوم",
    mode: "مدمج",
    targetAudience: "رجال",
    cashFee: 10755,
    installmentFee: 10755,
    isNew: false,
    createdAt: "2026-08-14",
    originalFee: 11950,
    discount: 10,
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 4,
    programName: "دبلوم الإدارة المكتبية عن بُعد",
    image: officeDiplomaImg.url,
    city: "جدة",
    programType: "دبلوم",
    mode: "عن بُعد",
    targetAudience: "رجال",
    cashFee: 8055,
    installmentFee: 8055,
    isNew: false,
    createdAt: "2026-08-08",
    originalFee: 8950,
    discount: 10,
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 9,
    programName: "دورة التصوير الفوتوغرافي",
    image: officeCourseImg.url,
    city: "جدة",
    programType: "دورة",
    mode: null,
    targetAudience: "رجال",
    cashFee: 2450,
    installmentFee: 3000,
    isNew: false,
    createdAt: "2026-07-10",
  },
  {
    id: 10,
    programName: "دورة اللغة الإنجليزية عن بُعد",
    image: englishRemoteImg.url,
    city: "جميع المدن",
    programType: "دورة",
    mode: "عن بُعد",
    targetAudience: "الرجال والنساء",
    cashFee: 390,
    installmentFee: 390,
    isNew: false,
    createdAt: "2026-07-05",
    feeUnit: "للمستوى الواحد",
  },
  {
    id: 11,
    programName: "دبلوم التأمين عن بُعد",
    image: financeImg.url,
    city: "جميع المدن",
    programType: "دبلوم",
    mode: "عن بُعد",
    targetAudience: "الرجال والنساء",
    cashFee: 10755,
    installmentFee: 10755,
    isNew: false,
    createdAt: "2026-06-28",
    originalFee: 11950,
    discount: 10,
    marketingText: "أقساط شهرية ميسرة تبدأ من 375 ريال فقط",
  },
  {
    id: 13,
    programName: "دبلوم التجارة الإلكترونية عن بُعد",
    image: ecommImg.url,
    city: "جميع المدن",
    programType: "دبلوم",
    mode: "عن بُعد",
    targetAudience: "الرجال والنساء",
    cashFee: 6750,
    installmentFee: 6750,
    isNew: false,
    createdAt: "2026-11-25",
    originalFee: 7500,
    discount: 10,
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 12,
    programName: "دبلوم إدارة الخدمات اللوجستية",
    image: logisticsImg.url,
    city: "جدة",
    programType: "دبلوم",
    mode: "حضوري",
    targetAudience: "الرجال والنساء",
    cashFee: 10755,
    installmentFee: 10755,
    isNew: false,
    createdAt: "2026-06-20",
    originalFee: 11950,
    discount: 10,
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 14,
    programName: "دبلوم الذكاء الاصطناعي",
    image: aiImg.url,
    city: "جدة",
    programType: "دبلوم",
    mode: null,
    targetAudience: "الرجال والنساء",
    cashFee: 10755,
    installmentFee: 10755,
    isNew: false,
    createdAt: "2026-11-26",
    originalFee: 11950,
    discount: 10,
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 15,
    programName: "دبلوم الأمن السيبراني",
    image: cyberImg.url,
    city: "جدة",
    programType: "دبلوم",
    mode: null,
    targetAudience: "الرجال والنساء",
    cashFee: 10755,
    installmentFee: 10755,
    isNew: false,
    createdAt: "2026-11-26",
    originalFee: 11950,
    discount: 10,
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
];

export const adsPrograms: Program[] = raw.map((p) => ({
  ...p,
  cashCommission: p.cashFee === null ? null : commissionOf(p.cashFee),
  installmentCommission: p.installmentFee === null ? null : commissionOf(p.installmentFee),
}));
