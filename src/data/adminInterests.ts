// Mock interest registrations for /admin/interests. Replace INTEREST_RECORDS with real data later.
export type InterestStatus = "processing" | "registered";
export type InterestRecord = {
  id: number; name: string; phone: string; program: string; city: string;
  marketer: string; date: Date; status: InterestStatus;
};
export type InterestPeriod = "all" | "year" | "6m" | "3m" | "month" | "7d" | "today" | "custom";

export const INTEREST_PERIODS: [InterestPeriod, string][] = [
  ["all", "جميع الأوقات"], ["year", "هذا العام"], ["6m", "آخر 6 أشهر"], ["3m", "آخر 3 أشهر"],
  ["month", "هذا الشهر"], ["7d", "آخر 7 أيام"], ["today", "اليوم"], ["custom", "فترة مخصصة"],
];
export const INTEREST_CITIES = ["جدة", "مكة المكرمة", "الرياض", "ينبع"];
export const INTEREST_PROGRAMS = ["دبلوم إدارة الأعمال", "دبلوم الموارد البشرية", "دبلوم الأمن السيبراني", "دبلوم المحاسبة", "دبلوم التسويق الرقمي"];
export const INTEREST_STATUS_LABEL: Record<InterestStatus, string> = { processing: "جاري المعالجة", registered: "تم التسجيل" };

const FIRST = ["محمد", "نورة", "خالد", "ريم", "عبدالله", "لجين", "فهد", "سارة", "سلطان", "هيا", "تركي", "أمل", "ماجد", "دانة", "بندر", "جود", "ياسر", "منى", "نايف", "رهف"];
const LAST = ["الشهري", "الحربي", "العمري", "القحطاني", "المطيري", "الزهراني", "الدوسري", "العتيبي", "الغامدي", "الشمري", "المالكي", "العنزي", "الجهني", "السبيعي"];
const MARKETERS = ["سالم الغامدي", "أحمد الزهراني", "ماجد العتيبي", "هند الدوسري", "فيصل المالكي", "سعود البلوي", "عبدالرحمن القحطاني", "نورة العنزي", "أحمد السبيعي", "ليان الحربي"];
const DAY = 86400000;

function dayOffset(i: number) {
  if (i < 12) return 0;               // today
  if (i < 40) return 1 + (i % 6);     // last week
  if (i < 90) return 7 + (i % 23);    // this month-ish
  return 30 + ((i * 37) % 700);       // spread over ~2 years
}

/** Deterministic 530 records; dates are relative to `now` so every period has data. */
export function buildInterestRecords(now = new Date()): InterestRecord[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Array.from({ length: 530 }, (_, i): InterestRecord => {
    const minutes = 8 * 60 + ((i * 47) % (13 * 60));
    let date = new Date(today.getTime() - dayOffset(i) * DAY + minutes * 60000);
    if (date > now) date = new Date(today.getTime() + ((i * 13) % Math.max(1, now.getHours() * 60 + now.getMinutes())) * 60000);
    return {
      id: i + 1,
      name: `${FIRST[(i * 7) % FIRST.length]} ${FIRST[(i * 3 + 11) % FIRST.length]} ${LAST[(i * 5) % LAST.length]}`,
      phone: `05${String(10000000 + ((i * 7919 + 1234) % 89999999)).padStart(8, "0")}`,
      program: INTEREST_PROGRAMS[(i * 3) % INTEREST_PROGRAMS.length]!,
      city: INTEREST_CITIES[(i * 5 + 1) % INTEREST_CITIES.length]!,
      marketer: MARKETERS[(i * 11) % MARKETERS.length]!,
      date,
      status: (i * 7) % 53 < 32 ? "processing" : "registered", // 320 / 210 over 530
    };
  }).sort((a, b) => +b.date - +a.date);
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function periodRange(period: InterestPeriod, now: Date, from?: string, to?: string): [Date, Date] {
  const today = startOfDay(now);
  const end = new Date(today.getTime() + DAY - 1);
  switch (period) {
    case "year": return [new Date(now.getFullYear(), 0, 1), end];
    case "6m": return [new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()), end];
    case "3m": return [new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()), end];
    case "month": return [new Date(now.getFullYear(), now.getMonth(), 1), end];
    case "7d": return [new Date(today.getTime() - 6 * DAY), end];
    case "today": return [today, end];
    case "custom": {
      const s = from ? new Date(`${from}T00:00:00`) : new Date(0);
      const e = to ? new Date(`${to}T23:59:59.999`) : new Date(8.64e15);
      return [s, e];
    }
    default: return [new Date(0), new Date(8.64e15)];
  }
}

export function filterByRange(records: InterestRecord[], [s, e]: [Date, Date]) {
  return records.filter((r) => r.date >= s && r.date <= e);
}

export function interestStats(inPeriod: InterestRecord[], now: Date) {
  const today = startOfDay(now).getTime();
  return {
    total: inPeriod.length,
    today: inPeriod.filter((r) => startOfDay(r.date).getTime() === today).length,
    processing: inPeriod.filter((r) => r.status === "processing").length,
    registered: inPeriod.filter((r) => r.status === "registered").length,
  };
}
