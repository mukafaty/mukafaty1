// Mock ads for /admin/ads (UI only — not linked to real marketer ads). Replace buildAdRecords with real data later.
import hr from "@/assets/ads-hr.jpg";
import business from "@/assets/ads-business.jpg";
import cyber from "@/assets/ads-cyber.jpg";
import safety from "@/assets/ads-safety.jpg";
import english from "@/assets/ads-english.jpg";
import englishRemote from "@/assets/ads-english-remote.jpg";
import office from "@/assets/ads-office-course.jpg";
import marketing from "@/assets/ads-marketing.jpg";
import finance from "@/assets/ads-finance.jpg";
import data from "@/assets/ads-data.jpg";
import { periodRange, type InterestPeriod } from "@/data/adminInterests";

export type AdStatus = "active" | "paused" | "scheduled" | "draft";
export type ProgramType = "دبلوم" | "دورة تدريبية" | "لغة إنجليزية";
export type TrainingMode = "حضوري" | "عن بُعد" | "مدمج";
export type AdRecord = {
  id: string; name: string; programId: string; program: string; type: ProgramType; mode: TrainingMode;
  cities: string[]; cash: number; installments: number; image: string; createdAt: Date; status: AdStatus; order: number;
  details?: AdDetails;
};

export type LocalMedia = { url: string; name: string; size: number; width: number; height: number; duration?: number; title?: string; description?: string };
export type AdDetails = {
  audience: string; ageFrom: string; ageTo: string; duration: string; durationUnit: string;
  description: string; tagline: string; installmentsEnabled: boolean; monthly: string; discount: string;
  images: Partial<Record<'square' | 'portrait' | 'x' | 'a5', LocalMedia>> & Record<string, LocalMedia | undefined>;
  videos: Partial<Record<'private' | 'public', LocalMedia>> & Record<string, LocalMedia | undefined>;
  marketing: string; xText: string; benefits: string[]; startsAt: string; endsAt: string;
  visibility: string[]; badges: string[];
};

export const AD_STATUS_LABEL: Record<AdStatus, string> = { active: "نشط", paused: "موقوف", scheduled: "مجدول", draft: "مسودة" };
export const AD_CITIES = ["جدة", "مكة المكرمة", "الرياض", "ينبع"];
export const AD_TYPES: ProgramType[] = ["دبلوم", "دورة تدريبية", "لغة إنجليزية"];
export const AD_MODES: TrainingMode[] = ["حضوري", "عن بُعد", "مدمج"];

const P = {
  hr: { programId: "P-HR", program: "دبلوم إدارة الموارد البشرية", type: "دبلوم", cash: 8900 },
  ba: { programId: "P-BA", program: "دبلوم إدارة الأعمال", type: "دبلوم", cash: 9500 },
  cy: { programId: "P-CY", program: "دبلوم الأمن السيبراني", type: "دبلوم", cash: 7500 },
  sf: { programId: "P-SF", program: "دبلوم السلامة والصحة المهنية", type: "دبلوم", cash: 8200 },
  pm: { programId: "P-PM", program: "دبلوم إدارة المشاريع", type: "دبلوم", cash: 9800 },
  en: { programId: "P-EN", program: "دورات اللغة الإنجليزية", type: "لغة إنجليزية", cash: 4500 },
  sc: { programId: "P-SC", program: "دورات تدريبية قصيرة", type: "دورة تدريبية", cash: 1900 },
} as const;
export const AD_PROGRAMS = Object.values(P);

// [program, name, image, mode, cities, dayOffset, status]
const SEED: [keyof typeof P, string, string, TrainingMode, string[], number, AdStatus][] = [
  ["ba", "دبلوم إدارة الأعمال – خاص 2026", business, "حضوري", ["الرياض"], 0, "active"],
  ["hr", "موارد بشرية – فرصة مميزة", hr, "حضوري", ["جدة"], 0, "active"],
  ["cy", "الأمن السيبراني – سجل الآن", cyber, "مدمج", ["مكة المكرمة"], 2, "paused"],
  ["sc", "مهارات الحاسب – دورة مكثفة", office, "عن بُعد", ["جدة", "الرياض", "ينبع"], 3, "active"],
  ["pm", "إدارة المشاريع – معتمد", data, "حضوري", ["جدة"], 5, "scheduled"],
  ["en", "اللغة الإنجليزية – مستويات متقدمة", english, "حضوري", ["ينبع"], 9, "active"],
  ["hr", "الموارد البشرية – دفعة جديدة", business, "مدمج", ["الرياض", "جدة"], 14, "active"],
  ["sf", "السلامة المهنية – شهادة معتمدة", safety, "حضوري", ["ينبع"], 20, "active"],
  ["en", "الإنجليزية عن بُعد – ابدأ اليوم", englishRemote, "عن بُعد", AD_CITIES, 27, "active"],
  ["ba", "إدارة الأعمال – تأهيل قيادي", finance, "مدمج", ["جدة"], 35, "paused"],
  ["sc", "التسويق الرقمي – دورة قصيرة", marketing, "عن بُعد", ["الرياض"], 44, "active"],
  ["cy", "الأمن السيبراني – مسار احترافي", data, "حضوري", ["جدة", "الرياض"], 58, "active"],
  ["pm", "إدارة المشاريع – خصم التسجيل المبكر", business, "مدمج", ["مكة المكرمة"], 71, "active"],
  ["hr", "الموارد البشرية – عن بُعد", hr, "عن بُعد", AD_CITIES, 89, "active"],
  ["sf", "السلامة والصحة المهنية – انضم الآن", safety, "مدمج", ["جدة"], 104, "scheduled"],
  ["sc", "المحاسبة المالية – دورة عملية", finance, "حضوري", ["الرياض"], 126, "active"],
  ["en", "الإنجليزية للأعمال", english, "مدمج", ["جدة", "مكة المكرمة"], 150, "active"],
  ["ba", "إدارة الأعمال – الدفعة الصيفية", business, "حضوري", ["ينبع"], 182, "paused"],
  ["cy", "الأمن السيبراني – أساسيات", cyber, "عن بُعد", AD_CITIES, 210, "active"],
  ["sc", "خدمة العملاء – تطوير مهاراتك", office, "حضوري", ["جدة"], 245, "active"],
  ["pm", "إدارة المشاريع – PMP تمهيدي", data, "عن بُعد", ["الرياض"], 290, "active"],
  ["hr", "الموارد البشرية – تأهيل مهني", hr, "حضوري", ["مكة المكرمة"], 340, "paused"],
  ["sf", "السلامة المهنية – للقطاع الصناعي", safety, "حضوري", ["ينبع", "جدة"], 410, "active"],
  ["en", "الإنجليزية – المستوى التأسيسي", englishRemote, "عن بُعد", ["الرياض"], 480, "active"],
];

const DAY = 86400000;

/** Deterministic 24 ads; creation dates are relative to `now` so every period has data. */
export function buildAdRecords(now = new Date()): AdRecord[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return SEED.map(([pk, name, image, mode, cities, off, status], i) => {
    const p = P[pk];
    const minutes = off === 0 ? Math.min((i * 17) % 60, now.getHours() * 60 + now.getMinutes()) : 9 * 60 + ((i * 53) % (9 * 60));
    return {
      id: `AD-${String(i + 1).padStart(3, "0")}`, name, programId: p.programId, program: p.program, type: p.type as ProgramType,
      mode, cities, cash: p.cash, installments: Math.round((p.cash * 1.15) / 100) * 100, image,
      createdAt: new Date(today.getTime() - off * DAY + minutes * 60000), status, order: i + 1,
    };
  });
}

export function adsInPeriod(ads: AdRecord[], period: InterestPeriod, now: Date, from?: string, to?: string) {
  const [s, e] = periodRange(period, now, from, to);
  return ads.filter((a) => a.createdAt >= s && a.createdAt <= e);
}

export function adStats(ads: AdRecord[]) {
  const n = (s: AdStatus) => ads.filter((a) => a.status === s).length;
  return { total: ads.length, active: n("active"), paused: n("paused"), scheduled: n("scheduled") };
}

/** Swap display order with neighbour; orders stay unique. */
export function moveAd(ads: AdRecord[], id: string, dir: -1 | 1): AdRecord[] {
  const sorted = [...ads].sort((a, b) => a.order - b.order);
  const i = sorted.findIndex((a) => a.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= sorted.length) return ads;
  const a = sorted[i]; const b = sorted[j];
  if (!a || !b) return ads;
  return ads.map((x) => (x.id === a.id ? { ...x, order: b.order } : x.id === b.id ? { ...x, order: a.order } : x));
}

export function duplicateAd(ads: AdRecord[], id: string, now: Date): AdRecord[] {
  const src = ads.find((a) => a.id === id);
  if (!src) return ads;
  const max = Math.max(0, ...ads.map((a) => Number(a.id.slice(3))).filter(Number.isFinite));
  const order = Math.max(...ads.map((a) => a.order)) + 1;
  return [...ads, { ...src, id: `AD-${String(max + 1).padStart(3, "0")}`, name: `${src.name} (نسخة)`, status: "draft", createdAt: now, order }];
}

export function toggleAd(ads: AdRecord[], id: string): AdRecord[] {
  return ads.map((a) => (a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a));
}
