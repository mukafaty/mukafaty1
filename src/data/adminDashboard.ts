// بيانات تجريبية للوحة الإدارة (مرحلة اعتماد التصميم)
export const adminStats = [
  { key: "marketers", title: "المسوقون (خارجي)", value: 286, change: 8 },
  { key: "trainees", title: "عدد المتدربين", value: 147, change: 18 },
  { key: "leads", title: "تسجيلات الاهتمام", value: 623, change: 22 },
  { key: "clicks", title: "إجمالي النقرات", value: 8412, change: 15 },
] as const;

export const actionItems = [
  { key: "withdraw", title: "طلبات سحب جديدة", value: 5 },
  { key: "rewards", title: "مكافآت بانتظار الاعتماد", value: 18 },
  { key: "memberships", title: "عضويات بانتظار التفعيل", value: 12 },
] as const;

export const latestLeads = [
  { name: "أحمد محمد", program: "دبلوم إدارة الأعمال", city: "الرياض", source: "واتساب", date: "2026-09-22" },
  { name: "نورة عبدالله", program: "دبلوم الموارد البشرية", city: "جدة", source: "إنستجرام", date: "2026-09-21" },
  { name: "سعيد علي", program: "دبلوم الأمن السيبراني", city: "مكة المكرمة", source: "تيك توك", date: "2026-09-21" },
  { name: "ريم خالد", program: "دبلوم التسويق", city: "الرياض", source: "سناب شات", date: "2026-09-20" },
  { name: "خالد عبدالله", program: "دبلوم إدارة المشاريع", city: "ينبع", source: "Google", date: "2026-09-20" },
];

export type MarketerStatus = "active" | "pending" | "suspended";
export const latestMarketers: { id: string; name: string; city: string; date: string; status: MarketerStatus }[] = [
  { id: "MK0286", name: "سارة المطيري", city: "الرياض", date: "2026-09-22", status: "active" },
  { id: "MK0285", name: "محمد الغامدي", city: "جدة", date: "2026-09-21", status: "active" },
  { id: "MK0284", name: "فاطمة الزهراني", city: "مكة المكرمة", date: "2026-09-21", status: "pending" },
  { id: "MK0283", name: "أحمد القحطاني", city: "الرياض", date: "2026-09-20", status: "suspended" },
  { id: "MK0282", name: "نورة السبيعي", city: "ينبع", date: "2026-09-20", status: "active" },
];

export const platformMetrics = [
  { key: "clicks", label: "عدد النقرات" },
  { key: "leads", label: "تسجيلات الاهتمام" },
  { key: "trainees", label: "عدد المتدربين" },
  { key: "rewards", label: "إجمالي المكافآت" },
] as const;
export type PlatformMetric = (typeof platformMetrics)[number]["key"];

export const platformData: { key: string; label: string; color: string; values: Record<PlatformMetric, number> }[] = [
  { key: "whatsapp", label: "واتساب", color: "#22c55e", values: { clicks: 78, leads: 41, trainees: 19, rewards: 5200 } },
  { key: "telegram", label: "تيليجرام", color: "#0ea5e9", values: { clicks: 12, leads: 7, trainees: 3, rewards: 900 } },
  { key: "snapchat", label: "سناب شات", color: "#facc15", values: { clicks: 59, leads: 30, trainees: 12, rewards: 3600 } },
  { key: "tiktok", label: "تيك توك", color: "#ec4899", values: { clicks: 42, leads: 25, trainees: 9, rewards: 2700 } },
  { key: "instagram", label: "إنستجرام", color: "#d946ef", values: { clicks: 38, leads: 22, trainees: 8, rewards: 2400 } },
  { key: "facebook", label: "فيسبوك", color: "#1877f2", values: { clicks: 37, leads: 18, trainees: 6, rewards: 1800 } },
  { key: "x", label: "X", color: "#111111", values: { clicks: 20, leads: 9, trainees: 3, rewards: 900 } },
  { key: "linkedin", label: "لينكدإن", color: "#0a66c2", values: { clicks: 13, leads: 8, trainees: 4, rewards: 1200 } },
  { key: "google", label: "Google", color: "#4285f4", values: { clicks: 6, leads: 4, trainees: 2, rewards: 600 } },
  { key: "email", label: "البريد الإلكتروني", color: "#ef4444", values: { clicks: 6, leads: 3, trainees: 1, rewards: 300 } },
  { key: "unknown", label: "غير محدد", color: "#64748b", values: { clicks: 13, leads: 5, trainees: 1, rewards: 300 } },
];
