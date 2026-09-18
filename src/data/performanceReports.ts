import emailIcon from "@/assets/social/email.png.asset.json";
import facebookIcon from "@/assets/social/facebook.jpg.asset.json";
import instagramIcon from "@/assets/social/instagram.jpg.asset.json";
import linkedinIcon from "@/assets/social/linkedin.png.asset.json";
import snapchatIcon from "@/assets/social/snapchat.jpg.asset.json";
import telegramIcon from "@/assets/social/telegram.jpg.asset.json";
import whatsappIcon from "@/assets/social/whatsapp.jpg.asset.json";
import xIcon from "@/assets/social/x.jpg.asset.json";

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

export type PerformanceRow = {
  clicks: number;
  interests: number;
  students: number;
  rewards: number;
};

export type PlatformPerformance = PerformanceRow & {
  key: PlatformKey;
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

export const PLATFORM_PERFORMANCE: PlatformPerformance[] = [
  { key: "whatsapp", name: "واتساب", iconUrl: whatsappIcon.url, clicks: 550, interests: 55, students: 14, rewards: 7000 },
  { key: "telegram", name: "تيليجرام", iconUrl: telegramIcon.url, clicks: 100, interests: 10, students: 2, rewards: 1000 },
  { key: "snapchat", name: "سناب شات", iconUrl: snapchatIcon.url, clicks: 350, interests: 35, students: 7, rewards: 3500 },
  { key: "tiktok", name: "تيك توك", clicks: 300, interests: 30, students: 5, rewards: 2500 },
  { key: "instagram", name: "إنستغرام", iconUrl: instagramIcon.url, clicks: 300, interests: 30, students: 5, rewards: 2000 },
  { key: "facebook", name: "فيسبوك", iconUrl: facebookIcon.url, clicks: 250, interests: 25, students: 4, rewards: 1500 },
  { key: "x", name: "إكس", iconUrl: xIcon.url, clicks: 100, interests: 10, students: 2, rewards: 1000 },
  { key: "linkedin", name: "لينكدإن", iconUrl: linkedinIcon.url, clicks: 50, interests: 5, students: 1, rewards: 500 },
  { key: "google", name: "جوجل", clicks: 50, interests: 5, students: 0, rewards: 1000 },
  { key: "email", name: "البريد الإلكتروني", iconUrl: emailIcon.url, clicks: 0, interests: 0, students: 0, rewards: 0 },
];

export const PROGRAM_PERFORMANCE: ProgramPerformance[] = [
  { id: "hr", name: "دبلوم إدارة الموارد البشرية", clicks: 900, interests: 90, students: 20, rewards: 10000 },
  { id: "business", name: "دبلوم إدارة الأعمال", clicks: 470, interests: 40, students: 6, rewards: 4000 },
  { id: "cyber", name: "دبلوم الأمن السيبراني", clicks: 260, interests: 25, students: 5, rewards: 2000 },
  { id: "marketing", name: "دبلوم التسويق الرقمي", clicks: 180, interests: 20, students: 3, rewards: 1500 },
  { id: "data", name: "دبلوم تحليل البيانات", clicks: 100, interests: 15, students: 2, rewards: 1000 },
  { id: "accounting", name: "دبلوم المحاسبة المالية", clicks: 70, interests: 8, students: 2, rewards: 700 },
  { id: "projects", name: "دبلوم إدارة المشاريع", clicks: 50, interests: 5, students: 1, rewards: 500 },
  { id: "office", name: "دبلوم التطبيقات المكتبية", clicks: 20, interests: 2, students: 1, rewards: 300 },
];

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

export const REPORT_TOTALS = totalPerformance(PLATFORM_PERFORMANCE);
