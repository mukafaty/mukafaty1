import emailIcon from "@/assets/social/email.png.asset.json";
import facebookIcon from "@/assets/social/facebook.jpg.asset.json";
import instagramIcon from "@/assets/social/instagram.jpg.asset.json";
import linkedinIcon from "@/assets/social/linkedin.png.asset.json";
import snapchatIcon from "@/assets/social/snapchat.jpg.asset.json";
import telegramIcon from "@/assets/social/telegram.jpg.asset.json";
import whatsappIcon from "@/assets/social/whatsapp.jpg.asset.json";
import xIcon from "@/assets/social/x.jpg.asset.json";

/**
 * بيانات توضيحية مؤرخة ومترابطة لتقارير الأداء.
 * كل رقم في الصفحة (البطاقات والجدولين والرسم) يُحسب من هذه السجلات نفسها.
 * عند الربط بمصدر فعلي: استبدل CLICK_EVENTS و REFERRAL_EVENTS بقراءة مقيدة
 * بصلاحيات المسوّق من قاعدة البيانات (RLS) مع إبقاء دوال الحساب كما هي.
 */

export type ReportMetric = "clicks" | "interests" | "conversion" | "students" | "rewards";

export type PlatformKey =
  | "whatsapp"
  | "telegram"
  | "snapchat"
  | "tiktok"
  | "instagram"
  | "facebook"
  | "x"
  | "linkedin"
  | "google"
  | "email";

/** مفتاح المنصة داخل السجلات، ويشمل المصدر المفقود */
export type SourceKey = PlatformKey | "unknown";

export type PerformanceRow = {
  clicks: number;
  interests: number;
  students: number;
  rewards: number;
};

export type PlatformPerformance = PerformanceRow & {
  key: SourceKey;
  name: string;
  iconUrl?: string;
};

export type ProgramPerformance = PerformanceRow & {
  id: string;
  name: string;
};

export const REPORT_PERIODS = [
  { value: "all", label: "جميع الأوقات" },
  { value: "year", label: "هذا العام" },
  { value: "6m", label: "آخر ستة أشهر" },
  { value: "3m", label: "آخر ثلاثة أشهر" },
  { value: "month", label: "هذا الشهر" },
  { value: "7d", label: "آخر سبعة أيام" },
  { value: "today", label: "اليوم" },
  { value: "custom", label: "فترة مخصصة" },
] as const;

export type ReportPeriod = (typeof REPORT_PERIODS)[number]["value"];

/** الترتيب الثابت للمنصات، و«غير محدد» دائمًا في النهاية */
export const PLATFORM_META: { key: SourceKey; name: string; iconUrl?: string }[] = [
  { key: "whatsapp", name: "واتساب", iconUrl: whatsappIcon.url },
  { key: "telegram", name: "تيليجرام", iconUrl: telegramIcon.url },
  { key: "snapchat", name: "سناب شات", iconUrl: snapchatIcon.url },
  { key: "tiktok", name: "تيك توك" },
  { key: "instagram", name: "إنستغرام", iconUrl: instagramIcon.url },
  { key: "facebook", name: "فيسبوك", iconUrl: facebookIcon.url },
  { key: "x", name: "إكس", iconUrl: xIcon.url },
  { key: "linkedin", name: "لينكدإن", iconUrl: linkedinIcon.url },
  { key: "google", name: "جوجل" },
  { key: "email", name: "البريد الإلكتروني", iconUrl: emailIcon.url },
  { key: "unknown", name: "غير محدد" },
];

export const PROGRAM_META: { id: string; name: string }[] = [
  { id: "hr", name: "دبلوم إدارة الموارد البشرية" },
  { id: "business", name: "دبلوم إدارة الأعمال" },
  { id: "cyber", name: "دبلوم الأمن السيبراني" },
  { id: "marketing", name: "دبلوم التسويق الرقمي" },
  { id: "data", name: "دبلوم تحليل البيانات" },
  { id: "accounting", name: "دبلوم المحاسبة المالية" },
  { id: "projects", name: "دبلوم إدارة المشاريع" },
  { id: "office", name: "دبلوم التطبيقات المكتبية" },
];

/* ---------------- السجلات المؤرخة ---------------- */

export type ClickEvent = {
  id: string;
  platform: SourceKey;
  programId: string;
  /** تاريخ النقرة */
  date: string;
};

export type ReferralEvent = {
  id: string;
  platform: SourceKey;
  programId: string;
  /** تاريخ تسجيل الاهتمام (إرسال النموذج بنجاح) */
  interestDate: string;
  /** تاريخ تأكيد السداد — يبقى التسجيل ضمن تسجيلات الاهتمام */
  paidDate: string | null;
  /** تاريخ اعتماد المكافأة */
  rewardDate: string | null;
  /** قيمة المكافأة المعتمدة */
  reward: number;
};

/** مولّد عشوائي ثابت حتى تتطابق البيانات بين الخادم والمتصفح */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const PLATFORM_WEIGHTS: { key: SourceKey; weight: number }[] = [
  { key: "whatsapp", weight: 26 },
  { key: "telegram", weight: 6 },
  { key: "snapchat", weight: 16 },
  { key: "tiktok", weight: 14 },
  { key: "instagram", weight: 14 },
  { key: "facebook", weight: 11 },
  { key: "x", weight: 5 },
  { key: "linkedin", weight: 3 },
  { key: "google", weight: 3 },
  { key: "email", weight: 1 },
  { key: "unknown", weight: 2 },
];

const WEIGHT_TOTAL = PLATFORM_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);

function pickPlatform(r: number): SourceKey {
  let acc = r * WEIGHT_TOTAL;
  for (const item of PLATFORM_WEIGHTS) {
    acc -= item.weight;
    if (acc <= 0) return item.key;
  }
  return "whatsapp";
}

const PROGRAM_WEIGHTS = [26, 18, 14, 12, 10, 8, 7, 5];
const PROGRAM_TOTAL = PROGRAM_WEIGHTS.reduce((a, b) => a + b, 0);

function pickProgram(r: number): string {
  let acc = r * PROGRAM_TOTAL;
  for (let i = 0; i < PROGRAM_WEIGHTS.length; i++) {
    acc -= PROGRAM_WEIGHTS[i] as number;
    if (acc <= 0) return PROGRAM_META[i]?.id ?? "hr";
  }
  return "hr";
}

const DAY = 24 * 60 * 60 * 1000;

function buildEvents() {
  const rand = seeded(20260918);
  const now = Date.now();
  const clicks: ClickEvent[] = [];
  const referrals: ReferralEvent[] = [];

  for (let i = 400; i >= 0; i--) {
    const base = now - i * DAY;
    const dayClicks = 4 + Math.floor(rand() * 8) + (i < 30 ? 3 : 0);

    for (let c = 0; c < dayClicks; c++) {
      const platform = pickPlatform(rand());
      const programId = pickProgram(rand());
      const clickTime = base - Math.floor(rand() * DAY * 0.9);
      clicks.push({
        id: `c-${i}-${c}`,
        platform,
        programId,
        date: new Date(clickTime).toISOString(),
      });

      // نحو 10% من النقرات تتحول إلى تسجيل اهتمام على المنصة والبرنامج نفسيهما
      if (rand() < 0.1) {
        const interestTime = Math.min(clickTime + Math.floor(rand() * DAY * 0.5), now);
        const becomesStudent = rand() < 0.2;
        const paidTime = becomesStudent ? Math.min(interestTime + Math.floor(rand() * 6 * DAY), now) : null;
        const rewardApproved = paidTime !== null && rand() < 0.9;
        const rewardTime = rewardApproved ? Math.min((paidTime as number) + Math.floor(rand() * 4 * DAY), now) : null;
        referrals.push({
          id: `r-${i}-${c}`,
          platform,
          programId,
          interestDate: new Date(interestTime).toISOString(),
          paidDate: paidTime === null ? null : new Date(paidTime).toISOString(),
          rewardDate: rewardTime === null ? null : new Date(rewardTime).toISOString(),
          reward: rewardTime === null ? 0 : Math.round((300 + rand() * 700) / 50) * 50,
        });
      }
    }
  }

  return { clicks, referrals };
}

const events = buildEvents();

export const CLICK_EVENTS: ClickEvent[] = events.clicks;
export const REFERRAL_EVENTS: ReferralEvent[] = events.referrals;

/* ---------------- الفترات بتوقيت السعودية ---------------- */

const RIYADH_OFFSET_MS = 3 * 60 * 60 * 1000;

function riyadhParts(d: Date) {
  const shifted = new Date(d.getTime() + RIYADH_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
  };
}

/** بداية يوم بتوقيت السعودية كـ timestamp UTC */
function riyadhStart(year: number, month: number, day: number) {
  return Date.UTC(year, month, day) - RIYADH_OFFSET_MS;
}

/** نهاية اليوم (شاملة) بتوقيت السعودية */
function riyadhEnd(year: number, month: number, day: number) {
  return riyadhStart(year, month, day + 1) - 1;
}

/** طرح أشهر تقويمية مع معالجة اختلاف عدد أيام الأشهر */
function subtractMonths(year: number, month: number, day: number, months: number) {
  const targetMonth = month - months;
  const y = year + Math.floor(targetMonth / 12);
  const m = ((targetMonth % 12) + 12) % 12;
  const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return { year: y, month: m, day: Math.min(day, daysInMonth) };
}

export type DateRange = { start: number | null; end: number | null };

export function periodRange(
  period: ReportPeriod,
  now: Date = new Date(),
  custom?: { from: string; to: string },
): DateRange {
  const { year, month, day } = riyadhParts(now);
  const end = now.getTime();

  switch (period) {
    case "all":
      return { start: null, end: null };
    case "year":
      return { start: riyadhStart(year, 0, 1), end };
    case "6m": {
      const p = subtractMonths(year, month, day, 6);
      return { start: riyadhStart(p.year, p.month, p.day), end };
    }
    case "3m": {
      const p = subtractMonths(year, month, day, 3);
      return { start: riyadhStart(p.year, p.month, p.day), end };
    }
    case "month":
      return { start: riyadhStart(year, month, 1), end };
    case "7d":
      return { start: riyadhStart(year, month, day) - 6 * DAY, end };
    case "today":
      return { start: riyadhStart(year, month, day), end };
    case "custom": {
      if (!custom?.from || !custom?.to) return { start: null, end: null };
      const from = parseIsoDate(custom.from);
      const to = parseIsoDate(custom.to);
      if (!from || !to) return { start: null, end: null };
      return {
        start: riyadhStart(from.year, from.month, from.day),
        end: riyadhEnd(to.year, to.month, to.day),
      };
    }
    default:
      return { start: null, end: null };
  }
}

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]) - 1,
    day: Number(match[3]),
  };
}

/** صيغة yyyy-mm-dd بتوقيت السعودية لعرضها في حقلي التاريخ */
export function toInputDate(ts: number) {
  const shifted = new Date(ts + RIYADH_OFFSET_MS);
  const y = shifted.getUTCFullYear();
  const m = `${shifted.getUTCMonth() + 1}`.padStart(2, "0");
  const d = `${shifted.getUTCDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function inRange(dateIso: string | null, range: DateRange) {
  if (!dateIso) return false;
  const t = +new Date(dateIso);
  if (range.start !== null && t < range.start) return false;
  if (range.end !== null && t > range.end) return false;
  return true;
}

/* ---------------- الحسابات المشتركة ---------------- */

export function conversionRate(row: PerformanceRow) {
  return row.clicks === 0 ? 0 : (row.interests / row.clicks) * 100;
}

export function totalPerformance(rows: PerformanceRow[]): PerformanceRow {
  return rows.reduce(
    (total, row) => ({
      clicks: total.clicks + row.clicks,
      interests: total.interests + row.interests,
      students: total.students + row.students,
      rewards: total.rewards + row.rewards,
    }),
    { clicks: 0, interests: 0, students: 0, rewards: 0 },
  );
}

export type ReportFilters = {
  period: ReportPeriod;
  platform: SourceKey | "all";
  program: string | "all";
  from?: string;
  to?: string;
};

export type ReportResult = {
  totals: PerformanceRow;
  platforms: PlatformPerformance[];
  programs: ProgramPerformance[];
  hasData: boolean;
};

const emptyRow = (): PerformanceRow => ({ clicks: 0, interests: 0, students: 0, rewards: 0 });

/** منطق حساب واحد تستخدمه البطاقات والجدولان والرسم (وجاهز لتصدير PDF لاحقًا) */
export function buildReport(filters: ReportFilters, now: Date = new Date()): ReportResult {
  const range = periodRange(filters.period, now, { from: filters.from ?? "", to: filters.to ?? "" });

  const byPlatform = new Map<SourceKey, PerformanceRow>();
  const byProgram = new Map<string, PerformanceRow>();

  const bump = (platform: SourceKey, programId: string, patch: Partial<PerformanceRow>) => {
    const p = byPlatform.get(platform) ?? emptyRow();
    const g = byProgram.get(programId) ?? emptyRow();
    for (const key of ["clicks", "interests", "students", "rewards"] as const) {
      const add = patch[key] ?? 0;
      p[key] += add;
      g[key] += add;
    }
    byPlatform.set(platform, p);
    byProgram.set(programId, g);
  };

  const keep = (platform: SourceKey, programId: string) =>
    (filters.platform === "all" || filters.platform === platform) &&
    (filters.program === "all" || filters.program === programId);

  for (const click of CLICK_EVENTS) {
    if (!keep(click.platform, click.programId)) continue;
    if (!inRange(click.date, range)) continue;
    bump(click.platform, click.programId, { clicks: 1 });
  }

  for (const referral of REFERRAL_EVENTS) {
    if (!keep(referral.platform, referral.programId)) continue;
    const patch: Partial<PerformanceRow> = {};
    if (inRange(referral.interestDate, range)) patch.interests = 1;
    if (inRange(referral.paidDate, range)) patch.students = 1;
    if (inRange(referral.rewardDate, range)) patch.rewards = referral.reward;
    if (patch.interests || patch.students || patch.rewards) {
      bump(referral.platform, referral.programId, patch);
    }
  }

  const platforms: PlatformPerformance[] = PLATFORM_META.filter(
    (meta) => filters.platform === "all" || filters.platform === meta.key,
  ).map((meta) => ({ ...meta, ...(byPlatform.get(meta.key) ?? emptyRow()) }));

  const programs: ProgramPerformance[] = PROGRAM_META.filter(
    (meta) => filters.program === "all" || filters.program === meta.id,
  )
    .map((meta) => ({ ...meta, ...(byProgram.get(meta.id) ?? emptyRow()) }))
    .sort((a, b) => b.clicks - a.clicks || b.rewards - a.rewards);

  const totals = totalPerformance(platforms);

  return {
    totals,
    platforms,
    programs,
    hasData: totals.clicks > 0 || totals.interests > 0 || totals.students > 0 || totals.rewards > 0,
  };
}
