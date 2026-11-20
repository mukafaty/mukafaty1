export const PROGRAM_TYPES = ["دبلوم", "دورة", "لغة إنجليزية"] as const;
export const PROGRAM_MODES = ["حضوري", "عن بُعد", "مدمج"] as const;
export const PROGRAM_CITIES = ["الرياض", "جدة", "مكة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "ينبع", "أبها", "تبوك"];
export const PROGRAM_STATUS = { active: "نشط", paused: "موقوف" } as const;

export interface ProgramRecord {
  id: string;
  name: string;
  type: (typeof PROGRAM_TYPES)[number];
  mode: (typeof PROGRAM_MODES)[number];
  duration: string;
  cities: string[];
  cash: number;
  installments: number;
  status: keyof typeof PROGRAM_STATUS;
}

type ProgramSeed = [string, ProgramRecord["type"], ProgramRecord["mode"], string, string[], number, number, ProgramRecord["status"]];
const seeds: ProgramSeed[] = [
  ["دبلوم إدارة الموارد البشرية", "دبلوم", "حضوري", "سنتان", ["الرياض", "جدة"], 16000, 18000, "active"],
  ["دبلوم المحاسبة المالية", "دبلوم", "حضوري", "سنتان", ["الرياض", "ينبع"], 14000, 15500, "active"],
  ["دبلوم التسويق الرقمي", "دبلوم", "عن بُعد", "سنة واحدة", [...PROGRAM_CITIES], 9000, 10000, "active"],
  ["دورة مهارات القيادة", "دورة", "حضوري", "40 ساعة", ["الرياض"], 4500, 5000, "active"],
  ["دورة خدمة العملاء الاحترافية", "دورة", "حضوري", "3 أشهر", ["جدة", "الرياض", "ينبع"], 4800, 5300, "active"],
  ["برنامج اللغة الإنجليزية — المستوى العام", "لغة إنجليزية", "عن بُعد", "3 أشهر", [...PROGRAM_CITIES], 6500, 7500, "active"],
  ["برنامج اللغة الإنجليزية — المستوى المتقدم", "لغة إنجليزية", "مدمج", "3 أشهر", ["جدة", "الرياض"], 7500, 8500, "active"],
  ["دبلوم إدارة المشاريع", "دبلوم", "حضوري", "سنتان", ["مكة", "جدة"], 16000, 17500, "paused"],
  ["دورة تحليل البيانات", "دورة", "عن بُعد", "40 ساعة", ["الرياض", "ينبع"], 2200, 2600, "paused"],
  ["دبلوم إدارة الأعمال", "دبلوم", "حضوري", "سنتان", ["الرياض"], 15000, 16500, "active"],
  ["دبلوم الأمن السيبراني", "دبلوم", "مدمج", "سنتان", ["الرياض", "الدمام", "جدة"], 18000, 20000, "active"],
  ["دورة التصميم الجرافيكي", "دورة", "عن بُعد", "60 ساعة", [...PROGRAM_CITIES], 3200, 3600, "active"],
  ["برنامج اللغة الإنجليزية — المحادثة", "لغة إنجليزية", "حضوري", "شهران", ["جدة", "الخبر"], 2800, 3200, "active"],
  ["دبلوم الإدارة المكتبية", "دبلوم", "حضوري", "سنة واحدة", ["المدينة المنورة", "تبوك"], 11000, 12500, "active"],
  ["دورة إدارة الوقت", "دورة", "عن بُعد", "20 ساعة", [...PROGRAM_CITIES], 1200, 1500, "active"],
  ["دورة إدارة الجودة", "دورة", "مدمج", "40 ساعة", ["الرياض", "الدمام"], 3500, 4000, "active"],
  ["برنامج اللغة الإنجليزية — الأعمال", "لغة إنجليزية", "مدمج", "4 أشهر", ["الرياض", "جدة", "الخبر"], 5500, 6200, "active"],
  ["دبلوم تقنية المعلومات", "دبلوم", "حضوري", "سنتان", ["الطائف", "أبها"], 16500, 18500, "paused"],
  ["دورة إدارة المبيعات", "دورة", "حضوري", "30 ساعة", ["الرياض", "جدة", "الدمام"], 2500, 2900, "active"],
  ["دورة مهارات التواصل", "دورة", "مدمج", "24 ساعة", ["مكة", "المدينة المنورة"], 1800, 2100, "active"],
  ["برنامج اللغة الإنجليزية — التحضير لاختبار IELTS", "لغة إنجليزية", "عن بُعد", "شهران", [...PROGRAM_CITIES], 3800, 4300, "active"],
  ["دبلوم إدارة سلاسل الإمداد", "دبلوم", "مدمج", "سنة واحدة", ["الدمام", "الخبر", "جدة"], 13000, 14500, "active"],
  ["دورة التصوير الفوتوغرافي", "دورة", "حضوري", "30 ساعة", ["جدة", "أبها"], 2400, 2800, "paused"],
  ["برنامج اللغة الإنجليزية — المستوى التأسيسي", "لغة إنجليزية", "حضوري", "3 أشهر", ["تبوك", "الطائف", "ينبع"], 3500, 4000, "active"],
];

export function buildProgramRecords(): ProgramRecord[] {
  return seeds.map(([name, type, mode, duration, cities, cash, installments, status], i) => ({
    id: `PR-${String(i + 1).padStart(3, "0")}`, name, type, mode, duration, cities: [...cities], cash, installments, status,
  }));
}

export function programStats(records: ProgramRecord[]) {
  return {
    total: records.length,
    active: records.filter((p) => p.status === "active").length,
    paused: records.filter((p) => p.status === "paused").length,
  };
}

export interface ProgramFilters { query: string; type: string; city: string; mode: string; status: string }
export const EMPTY_PROGRAM_FILTERS: ProgramFilters = { query: "", type: "all", city: "all", mode: "all", status: "all" };
export function filterPrograms(records: ProgramRecord[], filters: ProgramFilters) {
  const query = filters.query.trim();
  return records.filter((p) => (!query || p.name.includes(query)) &&
    (filters.type === "all" || p.type === filters.type) &&
    (filters.city === "all" || p.cities.includes(filters.city)) &&
    (filters.mode === "all" || p.mode === filters.mode) &&
    (filters.status === "all" || p.status === filters.status));
}

export function toggleProgram(records: ProgramRecord[], id: string): ProgramRecord[] {
  return records.map((p) => p.id === id ? { ...p, status: p.status === "active" ? "paused" : "active" } : p);
}

export function paginatePrograms(records: ProgramRecord[], page: number, perPage = 10) {
  const pages = Math.max(1, Math.ceil(records.length / perPage));
  const current = Math.max(1, Math.min(page, pages));
  const start = (current - 1) * perPage;
  return { pages, current, start, visible: records.slice(start, start + perPage) };
}