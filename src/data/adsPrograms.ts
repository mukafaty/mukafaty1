import hrImg from "@/assets/ads-hr.jpg";
import cyberImg from "@/assets/ads-cyber.jpg";
import dataImg from "@/assets/ads-data.jpg";
import devImg from "@/assets/ads-dev.jpg";
import marketingImg from "@/assets/ads-marketing.jpg";
import financeImg from "@/assets/ads-finance.jpg";

export type CardType = "square" | "horizontal";
export type ProgramKind = "دبلوم" | "دورة";
export type TrainingMode = "عن بُعد" | "حضوري" | "مدمج";
export type Audience = "رجال" | "نساء" | "الرجال والنساء";
export type City = "جدة" | "الرياض" | "مكة المكرمة" | "ينبع";

export type Program = {
  id: number;
  name: string;
  image: string;
  city: City;
  kind: ProgramKind;
  mode: TrainingMode;
  audience: Audience;
  cashFee: number;
  installmentFee: number;
  monthlyFrom: number;
  isNew: boolean;
  discount?: number;
  createdAt: string;
  cardType: CardType;
  tagline: string;
  note: string;
};

export const COMMISSION_RATE = 0.05;

export const commissionOf = (fee: number) => Math.round(fee * COMMISSION_RATE);

export const adsStats = [
  { id: "diplomas", label: "إجمالي عدد الدبلومات", value: 48 },
  { id: "courses", label: "إجمالي عدد الدورات", value: 32 },
];

export const CITIES: City[] = ["جدة", "الرياض", "مكة المكرمة", "ينبع"];
export const KINDS: ProgramKind[] = ["دبلوم", "دورة"];
export const MODES: TrainingMode[] = ["عن بُعد", "حضوري", "مدمج"];
export const AUDIENCES: Audience[] = ["رجال", "نساء", "الرجال والنساء"];
export const SORTS = ["جديد", "الأحدث", "الأعلى عمولة"] as const;
export type SortKey = (typeof SORTS)[number];

export const adsPrograms: Program[] = [
  {
    id: 1,
    name: "دبلوم إدارة الموارد البشرية",
    image: hrImg,
    city: "جدة",
    kind: "دبلوم",
    mode: "حضوري",
    audience: "رجال",
    cashFee: 10755,
    installmentFee: 11755,
    monthlyFrom: 500,
    isNew: true,
    createdAt: "2026-08-20",
    cardType: "horizontal",
    tagline: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
    note: "شهادات معتمدة من المؤسسة العامة للتدريب التقني والمهني",
  },
  {
    id: 2,
    name: "دبلوم الأمن السيبراني",
    image: cyberImg,
    city: "جدة",
    kind: "دبلوم",
    mode: "مدمج",
    audience: "رجال",
    cashFee: 10755,
    installmentFee: 11755,
    monthlyFrom: 500,
    isNew: false,
    discount: 15,
    createdAt: "2026-08-14",
    cardType: "square",
    tagline: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
    note: "شهادات معتمدة من المؤسسة العامة للتدريب التقني والمهني",
  },
  {
    id: 3,
    name: "دورة إدخال البيانات ومعالجة النصوص",
    image: dataImg,
    city: "جدة",
    kind: "دورة",
    mode: "حضوري",
    audience: "الرجال والنساء",
    cashFee: 1550,
    installmentFee: 1950,
    monthlyFrom: 500,
    isNew: false,
    createdAt: "2026-08-10",
    cardType: "square",
    tagline: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
    note: "تدريب عملي مكثف على البرامج المكتبية",
  },
  {
    id: 4,
    name: "دبلوم البرمجيات",
    image: devImg,
    city: "الرياض",
    kind: "دبلوم",
    mode: "عن بُعد",
    audience: "رجال",
    cashFee: 10755,
    installmentFee: 11755,
    monthlyFrom: 500,
    isNew: false,
    createdAt: "2026-08-08",
    cardType: "square",
    tagline: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
    note: "مسار متكامل لتطوير تطبيقات الويب",
  },
  {
    id: 5,
    name: "دبلوم التسويق الرقمي",
    image: marketingImg,
    city: "الرياض",
    kind: "دبلوم",
    mode: "عن بُعد",
    audience: "نساء",
    cashFee: 8500,
    installmentFee: 9200,
    monthlyFrom: 450,
    isNew: true,
    createdAt: "2026-08-25",
    cardType: "horizontal",
    tagline: "أقساط شهرية ميسرة تبدأ من 450 ريال فقط",
    note: "شهادات معتمدة وفرص عمل في وكالات التسويق",
  },
  {
    id: 6,
    name: "دورة إعداد التقارير المالية",
    image: financeImg,
    city: "مكة المكرمة",
    kind: "دورة",
    mode: "مدمج",
    audience: "الرجال والنساء",
    cashFee: 3800,
    installmentFee: 4300,
    monthlyFrom: 400,
    isNew: false,
    createdAt: "2026-07-30",
    cardType: "square",
    tagline: "أقساط شهرية ميسرة تبدأ من 400 ريال فقط",
    note: "تطبيق عملي على الحالات المالية الواقعية",
  },
  {
    id: 7,
    name: "دورة اللغة الإنجليزية للأعمال",
    image: marketingImg,
    city: "ينبع",
    kind: "دورة",
    mode: "عن بُعد",
    audience: "نساء",
    cashFee: 4500,
    installmentFee: 5000,
    monthlyFrom: 350,
    isNew: false,
    createdAt: "2026-07-22",
    cardType: "square",
    tagline: "أقساط شهرية ميسرة تبدأ من 350 ريال فقط",
    note: "مدربون معتمدون دوليًا",
  },
  {
    id: 8,
    name: "دبلوم المحاسبة المالية",
    image: financeImg,
    city: "مكة المكرمة",
    kind: "دبلوم",
    mode: "حضوري",
    audience: "رجال",
    cashFee: 6500,
    installmentFee: 7100,
    monthlyFrom: 500,
    isNew: false,
    createdAt: "2026-07-18",
    cardType: "square",
    tagline: "أقساط شهرية ميسرة تبدأ من 500 ريال فقط",
    note: "شهادات معتمدة من المؤسسة العامة للتدريب التقني والمهني",
  },
];
