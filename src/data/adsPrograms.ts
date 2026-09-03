import hrImg from "@/assets/ads-hr.jpg";
import cyberImg from "@/assets/ads-cyber.jpg";
import dataImg from "@/assets/ads-data.jpg";
import devImg from "@/assets/ads-dev.jpg";
import marketingImg from "@/assets/ads-marketing.jpg";
import financeImg from "@/assets/ads-finance.jpg";

export type ProgramType = "دبلوم" | "دورة";
export type TrainingMode = "عن بُعد" | "حضوري" | "مدمج";
export type Audience = "رجال" | "نساء" | "الرجال والنساء";
export type City = "جدة" | "الرياض" | "مكة المكرمة" | "ينبع";

export type Program = {
  id: number;
  programName: string;
  programType: ProgramType;
  city: City;
  targetAudience: Audience;
  mode: TrainingMode;
  image: string;
  cashFee: number;
  cashCommission: number;
  installmentFee: number;
  installmentCommission: number;
  discount?: number;
  isNew: boolean;
  marketingText?: string;
  promotionalText?: string;
  createdAt: string;
};

export const COMMISSION_RATE = 0.05;

export const commissionOf = (fee: number) => Math.round(fee * COMMISSION_RATE);

export const CITIES: City[] = ["جدة", "الرياض", "مكة المكرمة", "ينبع"];
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
    image: devImg,
    city: "جدة",
    programType: "دبلوم",
    mode: "عن بُعد",
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
    programName: "دبلوم الأمن السيبراني",
    image: cyberImg,
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
    programName: "دبلوم البرمجيات",
    image: devImg,
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
    id: 5,
    programName: "دورة إدخال البيانات ومعالجة النصوص",
    image: dataImg,
    city: "جدة",
    programType: "دورة",
    mode: "حضوري",
    targetAudience: "رجال",
    cashFee: 1550,
    installmentFee: 1950,
    isNew: false,
    createdAt: "2026-07-30",
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 6,
    programName: "دبلوم الأمن السيبراني",
    image: cyberImg,
    city: "جدة",
    programType: "دبلوم",
    mode: "مدمج",
    targetAudience: "رجال",
    cashFee: 10755,
    installmentFee: 11755,
    isNew: false,
    discount: 15,
    createdAt: "2026-07-22",
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
  {
    id: 7,
    programName: "دبلوم إدارة الموارد البشرية",
    image: hrImg,
    city: "الرياض",
    programType: "دبلوم",
    mode: "حضوري",
    targetAudience: "رجال",
    cashFee: 10755,
    installmentFee: 11755,
    isNew: false,
    createdAt: "2026-07-18",
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
    promotionalText: "شهادات معتمدة من المؤسسة العامة للتدريب التقني والمهني",
  },
  {
    id: 8,
    programName: "دبلوم التسويق الرقمي",
    image: marketingImg,
    city: "الرياض",
    programType: "دبلوم",
    mode: "عن بُعد",
    targetAudience: "نساء",
    cashFee: 8500,
    installmentFee: 9200,
    isNew: false,
    createdAt: "2026-07-15",
    marketingText: "أقساط شهرية ميسرة تبدأ من 450 ريال فقط",
  },
  {
    id: 9,
    programName: "دورة إعداد التقارير المالية",
    image: financeImg,
    city: "مكة المكرمة",
    programType: "دورة",
    mode: "مدمج",
    targetAudience: "الرجال والنساء",
    cashFee: 3800,
    installmentFee: 4300,
    isNew: false,
    createdAt: "2026-07-10",
    marketingText: "أقساط شهرية ميسرة تبدأ من 400 ريال فقط",
  },
  {
    id: 10,
    programName: "دورة اللغة الإنجليزية للأعمال",
    image: marketingImg,
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
    programName: "دبلوم المحاسبة المالية",
    image: financeImg,
    city: "مكة المكرمة",
    programType: "دبلوم",
    mode: "حضوري",
    targetAudience: "رجال",
    cashFee: 6500,
    installmentFee: 7100,
    isNew: false,
    createdAt: "2026-06-28",
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
    promotionalText: "شهادات معتمدة من المؤسسة العامة للتدريب التقني والمهني",
  },
  {
    id: 12,
    programName: "دبلوم الأمن السيبراني",
    image: cyberImg,
    city: "ينبع",
    programType: "دبلوم",
    mode: "مدمج",
    targetAudience: "الرجال والنساء",
    cashFee: 10755,
    installmentFee: 11755,
    isNew: false,
    discount: 10,
    createdAt: "2026-06-20",
    marketingText: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
  },
];

export const adsPrograms: Program[] = raw.map((p) => ({
  ...p,
  cashCommission: commissionOf(p.cashFee),
  installmentCommission: commissionOf(p.installmentFee),
}));
