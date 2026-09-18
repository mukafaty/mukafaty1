// بيانات تجريبية مؤرخة للوحة التحكم — جاهزة للاستبدال ببيانات قاعدة البيانات لاحقًا.
// كل سجل يحمل تاريخ حدث فعلي، وتُحسب المؤشرات بالفلترة على هذه التواريخ.

export type ReferralStatus = "تم الدفع" | "مهتم" | "جديد";

export type ReferralRecord = {
  id: string;
  name: string;
  program: string;
  /** تاريخ الإحالة (ISO) */
  date: string;
  status: ReferralStatus;
  /** المكافأة المستحقة عند حالة "تم الدفع" */
  reward: number;
};

export type ClickRecord = {
  /** تاريخ النقرة (ISO) */
  date: string;
  count: number;
};

/** الرصيد الحالي القابل للسحب — لا يتأثر بفلتر الفترة */
export const AVAILABLE_BALANCE = 2500;

const NAMES = [
  "محمد الحربي",
  "سارة الشهري",
  "عبد الله المالكي",
  "نورة القحطاني",
  "خالد العتيبي",
  "ريم الدوسري",
  "فيصل الزهراني",
  "لمى السبيعي",
  "ماجد الغامدي",
  "هند البقمي",
  "تركي الشمري",
  "أمل الرشيدي",
];

const PROGRAMS = [
  "دبلوم إدارة الأعمال",
  "دبلوم الموارد البشرية",
  "دبلوم الأمن السيبراني",
  "دبلوم التسويق الرقمي",
  "دبلوم تحليل البيانات",
  "دبلوم المحاسبة المالية",
];

const STATUSES: ReferralStatus[] = ["تم الدفع", "مهتم", "جديد"];

/** مولّد عشوائي ثابت (حتى تبقى البيانات نفسها بين الخادم والمتصفح) */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function buildData() {
  const rand = seeded(20260918);
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const referrals: ReferralRecord[] = [];
  const clicks: ClickRecord[] = [];

  // 400 يوم من السجلات المؤرخة تنتهي اليوم
  for (let i = 400; i >= 0; i--) {
    const base = now - i * day;
    const clickCount = Math.floor(rand() * 9) + (i < 30 ? 3 : 1);
    clicks.push({ date: new Date(base - Math.floor(rand() * day * 0.4)).toISOString(), count: clickCount });

    const referralCount = rand() < 0.45 ? (rand() < 0.3 ? 2 : 1) : 0;
    for (let k = 0; k < referralCount; k++) {
      const status = STATUSES[Math.floor(rand() * STATUSES.length)] as ReferralStatus;
      referrals.push({
        id: `r-${i}-${k}`,
        name: NAMES[Math.floor(rand() * NAMES.length)] as string,
        program: PROGRAMS[Math.floor(rand() * PROGRAMS.length)] as string,
        date: new Date(base - Math.floor(rand() * day * 0.8)).toISOString(),
        status,
        reward: status === "تم الدفع" ? Math.round((rand() * 900 + 300) * 100) / 100 : 0,
      });
    }
  }

  referrals.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return { referrals, clicks };
}

const data = buildData();

export const REFERRAL_RECORDS: ReferralRecord[] = data.referrals;
export const CLICK_RECORDS: ClickRecord[] = data.clicks;

/* ---------------- الفترات ---------------- */

export type PeriodId =
  | "all"
  | "year"
  | "6m"
  | "3m"
  | "month"
  | "7d"
  | "today";

export const PERIOD_OPTIONS: { id: PeriodId; label: string }[] = [
  { id: "all", label: "جميع الأوقات" },
  { id: "year", label: "هذا العام" },
  { id: "6m", label: "آخر ستة أشهر" },
  { id: "3m", label: "آخر ثلاثة أشهر" },
  { id: "month", label: "هذا الشهر" },
  { id: "7d", label: "آخر سبعة أيام" },
  { id: "today", label: "اليوم" },
];

const RIYADH_OFFSET_MS = 3 * 60 * 60 * 1000;

/** أجزاء التاريخ بتوقيت السعودية */
function riyadhParts(d: Date) {
  const shifted = new Date(d.getTime() + RIYADH_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
  };
}

/** بداية اليوم/الشهر/العام بتوقيت السعودية كـ timestamp بالـ UTC */
function riyadhStart(year: number, month: number, day: number) {
  return Date.UTC(year, month, day) - RIYADH_OFFSET_MS;
}

/** بداية الفترة (null = دون تقييد زمني) */
export function periodStart(period: PeriodId, now: Date = new Date()): number | null {
  const { year, month, day } = riyadhParts(now);
  const startOfToday = riyadhStart(year, month, day);
  const monthMs = 30 * 24 * 60 * 60 * 1000;

  switch (period) {
    case "all":
      return null;
    case "year":
      return riyadhStart(year, 0, 1);
    case "6m":
      return now.getTime() - 6 * monthMs;
    case "3m":
      return now.getTime() - 3 * monthMs;
    case "month":
      return riyadhStart(year, month, 1);
    case "7d":
      return startOfToday - 6 * 24 * 60 * 60 * 1000;
    case "today":
      return startOfToday;
    default:
      return null;
  }
}

export function inPeriod(dateIso: string, period: PeriodId, now: Date = new Date()) {
  const t = +new Date(dateIso);
  if (t > now.getTime()) return false;
  const start = periodStart(period, now);
  return start === null ? true : t >= start;
}

/** تنسيق تاريخ عربي مختصر */
export function formatArabicDate(dateIso: string) {
  return new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Riyadh",
  }).format(new Date(dateIso));
}

export function formatChartLabel(ts: number, granularity: "day" | "month") {
  return new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
    ...(granularity === "day" ? { day: "numeric", month: "short" } : { month: "long" }),
    timeZone: "Asia/Riyadh",
  }).format(new Date(ts));
}
