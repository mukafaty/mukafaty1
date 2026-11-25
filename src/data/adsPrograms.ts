import hrImg from "@/assets/program-hr.webp.asset.json";
import dataImg from "@/assets/ads-data.jpg";
import devImg from "@/assets/program-dev.webp.asset.json";
import financeImg from "@/assets/program-ins.webp.asset.json";
import businessImg from "@/assets/program-business.webp.asset.json";
import logisticsImg from "@/assets/program-logistics.webp.asset.json";
import officeDiplomaImg from "@/assets/program-office-diploma.webp.asset.json";
import officeCourseImg from "@/assets/program-photo.webp.asset.json";
import safetyImg from "@/assets/program-safety.webp.asset.json";
import englishRemoteImg from "@/assets/program-english-remote.webp.asset.json";

export type ProgramType = "دبلوم" | "دورة";
export type TrainingMode = "عن بُعد" | "حضوري" | "مدمج";
export type Audience = "رجال" | "نساء" | "الرجال والنساء";
export type City = "جدة" | "الرياض" | "مكة المكرمة" | "ينبع";

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
  isNew: boolean;
  marketingText?: string;
  promotionalText?: string;
  createdAt: string;
};

export const COMMISSION_RATE = 0.05;

export const commissionOf = (fee: number) => Math.round(fee * COMMISSION_RATE);

export const CITIES: City[] = ["جدة", "مكة المكرمة", "الرياض", "ينبع"];
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
    id: 1,
    programName: "دبلوم البرمجيات",
    image: devImg.url,
    city: "جدة",
    programType: "دبلوم",
    mode: "حضوري",
    targetAudience: "رجال",
    cashFee: 10755,
    installmentFee: 11755,
    isNew: true,
    createdAt: "2026-08-20",
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 2,
    programName: "دورة إدخال البيانات ومعالجة النصوص",
    image: dataImg,
    city: "جدة",
    programType: "دورة",
    mode: "حضوري",
    targetAudience: "رجال",
    cashFee: 1550,
    installmentFee: 1950,
    isNew: false,
    createdAt: "2026-08-10",
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
    installmentFee: 11755,
    isNew: false,
    discount: 15,
    createdAt: "2026-08-14",
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
    cashFee: 10755,
    installmentFee: 11755,
    isNew: true,
    createdAt: "2026-08-08",
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
    cashFee: 10755,
    installmentFee: 11755,
    isNew: false,
    discount: 15,
    createdAt: "2026-07-22",
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 8,
    programName: "دبلوم إدارة الموارد البشرية عن بُعد",
    image: hrImg.url,
    city: "الرياض",
    programType: "دبلوم",
    mode: "عن بُعد",
    targetAudience: "رجال",
    cashFee: 8500,
    installmentFee: 9200,
    isNew: false,
    createdAt: "2026-07-15",
    marketingText: "أقساط شهرية ميسرة تبدأ من 450 ريال فقط",
  },
  {
    id: 9,
    programName: "دورة التصوير الفوتوغرافي",
    image: officeCourseImg.url,
    city: null,
    programType: "دورة",
    mode: null,
    targetAudience: "الرجال والنساء",
    cashFee: null,
    installmentFee: null,
    isNew: false,
    createdAt: "2026-07-10",
  },
  {
    id: 10,
    programName: "دورة اللغة الإنجليزية عن بُعد",
    image: englishRemoteImg.url,
    city: "ينبع",
    programType: "دورة",
    mode: "عن بُعد",
    targetAudience: "نساء",
    cashFee: 4500,
    installmentFee: 5000,
    isNew: false,
    createdAt: "2026-07-05",
    marketingText: "أقساط شهرية ميسرة تبدأ من 350 ريال فقط",
  },
  {
    id: 11,
    programName: "دبلوم التأمين",
    image: financeImg.url,
    city: null,
    programType: "دبلوم",
    mode: null,
    targetAudience: "الرجال والنساء",
    cashFee: null,
    installmentFee: null,
    isNew: false,
    createdAt: "2026-06-28",
  },
  {
    id: 12,
    programName: "دبلوم إدارة الخدمات اللوجستية",
    image: logisticsImg.url,
    city: "ينبع",
    programType: "دبلوم",
    mode: "حضوري",
    targetAudience: "الرجال والنساء",
    cashFee: 10755,
    installmentFee: 11755,
    isNew: false,
    discount: 10,
    createdAt: "2026-06-20",
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 13,
    programName: "دبلوم التجارة الإلكترونية",
    image: ecommImg.url,
    city: null,
    programType: "دبلوم",
    mode: null,
    targetAudience: "الرجال والنساء",
    cashFee: null,
    installmentFee: null,
    isNew: true,
    createdAt: "2026-11-25",
  },
];

export const adsPrograms: Program[] = raw.map((p) => ({
  ...p,
  cashCommission: p.cashFee === null ? null : commissionOf(p.cashFee),
  installmentCommission: p.installmentFee === null ? null : commissionOf(p.installmentFee),
}));
