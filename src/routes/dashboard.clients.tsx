import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  MapPin,
  Search,
  UserCheck,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { CountUp } from "@/components/dashboard/CountUp";

export const Route = createFileRoute("/dashboard/clients")({
  head: () => ({
    meta: [
      { title: "عملائي | لوحة تحكم مكافآتي" },
      { name: "description", content: "قائمة العملاء والإحالات الخاصة بك مع حالة التسجيل والمكافآت." },
      { property: "og:title", content: "عملائي | لوحة تحكم مكافآتي" },
      {
        property: "og:description",
        content: "قائمة العملاء والإحالات الخاصة بك مع حالة التسجيل والمكافآت.",
      },
    ],
  }),
  component: ClientsPage,
});

type Status = "جاري المعالجة" | "مهتم بالتسجيل" | "غير مهتم بالتسجيل" | "تم التسجيل";

type Client = {
  id: number;
  name: string;
  program: string;
  city: string;
  branch: string;
  date: string;
  status: Status;
  agent: string;
  reward: number | null;
};

const STATUS_TONE: Record<Status, string> = {
  "جاري المعالجة": "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
  "مهتم بالتسجيل": "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  "غير مهتم بالتسجيل": "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  "تم التسجيل": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

const CLIENTS: Client[] = [
  {
    id: 1,
    name: "فادي حسن المالكي",
    program: "دبلوم إدارة الموارد البشرية",
    city: "جدة",
    branch: "جدة الصالحية",
    date: "10-09-2026",
    status: "جاري المعالجة",
    agent: "ماجد المظلوم",
    reward: null,
  },
  {
    id: 2,
    name: "سعد سعيد الشهري",
    program: "دبلوم إدارة الأعمال",
    city: "ينبع",
    branch: "ينبع",
    date: "10-09-2026",
    status: "جاري المعالجة",
    agent: "سرمد خالد",
    reward: null,
  },
  {
    id: 3,
    name: "فواز حسين الشهري",
    program: "دبلوم الأمن السيبراني",
    city: "جدة",
    branch: "جدة الصفا",
    date: "10-09-2026",
    status: "جاري المعالجة",
    agent: "ماجد المظلوم",
    reward: null,
  },
  {
    id: 4,
    name: "سعود محسن الحارثي",
    program: "دبلوم إدارة الموارد البشرية",
    city: "مكة المكرمة",
    branch: "مكة المكرمة - الزاهر",
    date: "10-09-2026",
    status: "تم التسجيل",
    agent: "محمد الزهارنة",
    reward: 200,
  },
  {
    id: 5,
    name: "خالد ناصر العتيبي",
    program: "دبلوم الذكاء الاصطناعي",
    city: "الرياض",
    branch: "الرياض المنار",
    date: "09-09-2026",
    status: "مهتم بالتسجيل",
    agent: "عبد الرحمن الزهارنة",
    reward: null,
  },
  {
    id: 6,
    name: "بدر عبدالله القحطاني",
    program: "دبلوم البرمجيات",
    city: "الرياض",
    branch: "الرياض الربوة",
    date: "09-09-2026",
    status: "جاري المعالجة",
    agent: "حسن سرور",
    reward: null,
  },
  {
    id: 7,
    name: "ماجد سالم الغامدي",
    program: "دبلوم إدارة الأعمال",
    city: "جدة",
    branch: "جدة الحمراء",
    date: "08-09-2026",
    status: "غير مهتم بالتسجيل",
    agent: "أيسر وكيل",
    reward: null,
  },
  {
    id: 8,
    name: "طلال فهد الزهراني",
    program: "دبلوم المحاسبة المالية",
    city: "جدة",
    branch: "جدة الحمراء",
    date: "08-09-2026",
    status: "تم التسجيل",
    agent: "حسن سرور",
    reward: 200,
  },
  {
    id: 9,
    name: "نايف عمر الشريف",
    program: "دبلوم التسويق الرقمي",
    city: "مكة المكرمة",
    branch: "مكة المكرمة - الزاهر",
    date: "05-09-2026",
    status: "تم التسجيل",
    agent: "محمد الزهارنة",
    reward: 200,
  },
  {
    id: 10,
    name: "عمر يوسف الحربي",
    program: "دبلوم تحليل البيانات",
    city: "الرياض",
    branch: "الرياض المنار",
    date: "04-09-2026",
    status: "مهتم بالتسجيل",
    agent: "عبد الرحمن الزهارنة",
    reward: null,
  },
  {
    id: 11,
    name: "راكان محمد الدوسري",
    program: "دبلوم الشبكات وأمن المعلومات",
    city: "الرياض",
    branch: "الرياض الربوة",
    date: "03-09-2026",
    status: "جاري المعالجة",
    agent: "حسن سرور",
    reward: null,
  },
  {
    id: 12,
    name: "سلطان أحمد البقمي",
    program: "دبلوم إدارة المشاريع",
    city: "جدة",
    branch: "جدة الصالحية",
    date: "02-09-2026",
    status: "تم التسجيل",
    agent: "ماجد المظلوم",
    reward: 200,
  },
  {
    id: 13,
    name: "يزيد صالح المطيري",
    program: "دبلوم التصميم الجرافيكي",
    city: "ينبع",
    branch: "ينبع",
    date: "01-09-2026",
    status: "غير مهتم بالتسجيل",
    agent: "سرمد خالد",
    reward: null,
  },
  {
    id: 14,
    name: "عبدالعزيز فيصل السبيعي",
    program: "دبلوم إدارة الأعمال",
    city: "الرياض",
    branch: "الرياض المنار",
    date: "30-08-2026",
    status: "تم التسجيل",
    agent: "عبد الرحمن الزهارنة",
    reward: 200,
  },
  {
    id: 15,
    name: "حسام وليد العمودي",
    program: "دورة مهارات البيع والإقناع",
    city: "جدة",
    branch: "جدة الصفا",
    date: "29-08-2026",
    status: "جاري المعالجة",
    agent: "أيسر وكيل",
    reward: null,
  },
  {
    id: 16,
    name: "مشعل تركي العنزي",
    program: "دبلوم الموارد البشرية المتقدم",
    city: "مكة المكرمة",
    branch: "مكة المكرمة - الزاهر",
    date: "28-08-2026",
    status: "مهتم بالتسجيل",
    agent: "محمد الزهارنة",
    reward: null,
  },
  {
    id: 17,
    name: "أنس رائد باعشن",
    program: "دبلوم المحاسبة المالية",
    city: "جدة",
    branch: "جدة الحمراء",
    date: "27-08-2026",
    status: "تم التسجيل",
    agent: "حسن سرور",
    reward: 200,
  },
  {
    id: 18,
    name: "زياد سامي القرني",
    program: "دورة الحوسبة السحابية",
    city: "الرياض",
    branch: "الرياض الربوة",
    date: "26-08-2026",
    status: "جاري المعالجة",
    agent: "عبد الرحمن الزهارنة",
    reward: null,
  },
  {
    id: 19,
    name: "تركي عادل الشمراني",
    program: "دبلوم الأمن السيبراني",
    city: "جدة",
    branch: "جدة الصالحية",
    date: "25-08-2026",
    status: "تم التسجيل",
    agent: "ماجد المظلوم",
    reward: 200,
  },
  {
    id: 20,
    name: "ريان خالد الجهني",
    program: "دورة اللغة الإنجليزية للأعمال",
    city: "ينبع",
    branch: "ينبع",
    date: "24-08-2026",
    status: "مهتم بالتسجيل",
    agent: "سرمد خالد",
    reward: null,
  },
  {
    id: 21,
    name: "فيصل منصور الثبيتي",
    program: "دبلوم الذكاء الاصطناعي",
    city: "الرياض",
    branch: "الرياض المنار",
    date: "23-08-2026",
    status: "تم التسجيل",
    agent: "عبد الرحمن الزهارنة",
    reward: 200,
  },
  {
    id: 22,
    name: "معاذ إبراهيم الأنصاري",
    program: "دبلوم البرمجيات",
    city: "جدة",
    branch: "جدة الصفا",
    date: "22-08-2026",
    status: "غير مهتم بالتسجيل",
    agent: "أيسر وكيل",
    reward: null,
  },
  {
    id: 23,
    name: "عادل حمزة الصاعدي",
    program: "دبلوم إدارة المشاريع",
    city: "مكة المكرمة",
    branch: "مكة المكرمة - الزاهر",
    date: "21-08-2026",
    status: "تم التسجيل",
    agent: "محمد الزهارنة",
    reward: 200,
  },
  {
    id: 24,
    name: "وليد صابر الحازمي",
    program: "دبلوم تحليل البيانات",
    city: "جدة",
    branch: "جدة الحمراء",
    date: "20-08-2026",
    status: "تم التسجيل",
    agent: "حسن سرور",
    reward: 200,
  },
];

const STATUSES = [
  "كل الحالات",
  "جاري المعالجة",
  "مهتم بالتسجيل",
  "غير مهتم بالتسجيل",
  "تم التسجيل",
] as const;
const CITIES = ["كل المدن", "الرياض", "جدة", "مكة المكرمة", "ينبع"] as const;
const BRANCHES = ["كل الفروع", ...Array.from(new Set(CLIENTS.map((c) => c.branch)))];
const PERIODS = ["كل الفترات", "آخر 7 أيام", "آخر 30 يومًا", "آخر 90 يومًا"] as const;

function parseDate(d: string) {
  const [dd, mm, yyyy] = d.split("-").map(Number);
  return new Date(yyyy!, (mm ?? 1) - 1, dd);
}

function Select({
  value,
  onChange,
  options,
  icon: Icon,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  icon: typeof MapPin;
  label: string;
}) {
  return (
    <div className="relative min-w-0">
      <Icon
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brand"
      />
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-2xl border border-border bg-card pr-10 pl-9 text-right text-sm font-bold text-navy outline-none transition-colors focus:border-brand"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

function ClientsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("كل الحالات");
  const [city, setCity] = useState<string>("كل المدن");
  const [branch, setBranch] = useState<string>("كل الفروع");
  const [period, setPeriod] = useState<string>("كل الفترات");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const now = parseDate("10-09-2026");
    const days = period === "آخر 7 أيام" ? 7 : period === "آخر 30 يومًا" ? 30 : period === "آخر 90 يومًا" ? 90 : null;
    return CLIENTS.filter((c) => {
      if (query.trim() && !c.name.includes(query.trim())) return false;
      if (status !== "كل الحالات" && c.status !== status) return false;
      if (city !== "كل المدن" && c.city !== city) return false;
      if (branch !== "كل الفروع" && c.branch !== branch) return false;
      if (days) {
        const diff = (now.getTime() - parseDate(c.date).getTime()) / 86400000;
        if (diff > days) return false;
      }
      return true;
    });
  }, [query, status, city, branch, period]);

  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * perPage;
  const visible = rows.slice(start, start + perPage);

  const reset = () => setPage(1);

  const exportPdf = () => {
    const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
<title>عملائي - مكافآتي</title>
<style>
body{font-family:Tajawal,system-ui,sans-serif;padding:24px;color:#06143F}
h1{font-size:20px;margin:0 0 4px}p{margin:0 0 16px;color:#64748b;font-size:12px}
table{width:100%;border-collapse:collapse;font-size:11px}
th{background:#00194F;color:#fff;padding:8px;text-align:right}
td{padding:7px 8px;border-bottom:1px solid #e5e7eb;text-align:right}
tr:nth-child(even) td{background:#f1f6ff}
</style></head><body>
<h1>عملائي</h1><p>قائمة العملاء والإحالات الخاصة بك.</p>
<table><thead><tr><th>الرقم</th><th>اسم العميل</th><th>البرنامج التدريبي</th><th>المدينة</th><th>الفرع</th><th>تاريخ الإحالة</th><th>حالة التسجيل</th><th>المسوق الداخلي</th><th>المكافأة المالية</th></tr></thead><tbody>
${rows
  .map(
    (c) =>
      `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.program}</td><td>${c.city}</td><td>${c.branch}</td><td>${c.date}</td><td>${c.status}</td><td>${c.agent}</td><td>${c.reward ? c.reward + " ريال" : "—"}</td></tr>`,
  )
  .join("")}
</tbody></table></body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  const stats = [
    { title: "إجمالي العملاء", value: 24, unit: "عميل", icon: Users, tone: "bg-brand-soft text-brand" },
    { title: "قيد المتابعة", value: 8, unit: "عملاء", icon: UserRound, tone: "bg-amber-50 text-amber-600" },
    { title: "تم تسجيل", value: 12, unit: "عميل", icon: UserCheck, tone: "bg-emerald-50 text-emerald-600" },
    {
      title: "إجمالي المكافآت",
      value: 2450,
      unit: "ريال سعودي",
      icon: Wallet,
      tone: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500">
      <div className="text-right">
        <h1 className="text-2xl font-black text-navy sm:text-3xl">عملائي</h1>
        <p className="mt-1 text-sm text-muted-foreground">قائمة العملاء والإحالات الخاصة بك.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.title}
            className="animate-in fade-in slide-in-from-bottom-3 rounded-3xl border border-border bg-card p-5 duration-500 fill-mode-backwards"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="block text-[15px] font-bold text-navy">{s.title}</span>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-baseline gap-2">
                <CountUp value={s.value} className="text-3xl font-black tracking-tight text-navy" />
                <span className="truncate text-sm text-muted-foreground">{s.unit}</span>
              </div>
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${s.tone}`}>
                <s.icon size={22} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))_auto]">
          <div className="relative min-w-0">
            <Search
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brand"
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                reset();
              }}
              placeholder="البحث عن عميل..."
              className="h-11 w-full rounded-2xl border border-border bg-card px-4 pr-10 text-right text-sm font-medium text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
            />
          </div>

          <Select
            value={status}
            onChange={(v) => {
              setStatus(v);
              reset();
            }}
            options={STATUSES}
            icon={Filter}
            label="كل الحالات"
          />
          <Select
            value={city}
            onChange={(v) => {
              setCity(v);
              reset();
            }}
            options={CITIES}
            icon={MapPin}
            label="كل المدن"
          />
          <Select
            value={branch}
            onChange={(v) => {
              setBranch(v);
              reset();
            }}
            options={BRANCHES}
            icon={Building2}
            label="كل الفروع"
          />
          <Select
            value={period}
            onChange={(v) => {
              setPeriod(v);
              reset();
            }}
            options={PERIODS}
            icon={Calendar}
            label="كل الفترات"
          />

          <button
            onClick={exportPdf}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-navy"
          >
            <Download size={17} />
            تصدير
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse overflow-hidden rounded-2xl text-right">
            <thead>
              <tr className="bg-navy-deep text-primary-foreground">
                <th className="px-4 py-3.5 text-sm font-bold">الرقم</th>
                <th className="px-4 py-3.5 text-sm font-bold">اسم العميل</th>
                <th className="px-4 py-3.5 text-sm font-bold">البرنامج التدريبي</th>
                <th className="px-4 py-3.5 text-sm font-bold">المدينة</th>
                <th className="px-4 py-3.5 text-sm font-bold">الفرع</th>
                <th className="px-4 py-3.5 text-sm font-bold">تاريخ الإحالة</th>
                <th className="px-4 py-3.5 text-sm font-bold">حالة التسجيل</th>
                <th className="px-4 py-3.5 text-sm font-bold">المسوق الداخلي</th>
                <th className="px-4 py-3.5 text-sm font-bold">المكافأة المالية</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr key={row.id} className={i % 2 === 1 ? "bg-brand-soft/70" : "bg-card"}>
                  <td className="px-4 py-3 text-sm font-bold text-navy">{row.id}</td>
                  <td className="px-4 py-3 text-sm font-bold text-navy">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-navy">{row.program}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{row.city}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{row.branch}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground" dir="ltr">
                    {row.date}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center whitespace-nowrap rounded-lg px-3 py-1 text-xs font-bold ${STATUS_TONE[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-navy">{row.agent}</td>
                  <td className="px-4 py-3 text-sm font-bold text-navy">
                    {row.reward ? `${row.reward.toLocaleString("en-US")} ريال` : "—"}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    لا توجد نتائج مطابقة للبحث أو الفلاتر المحددة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground sm:text-sm">
            عرض {rows.length === 0 ? 0 : start + 1} إلى {Math.min(start + perPage, rows.length)} من{" "}
            {rows.length} عميل
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, current - 1))}
              disabled={current === 1}
              className="h-9 rounded-xl border border-border px-3 text-sm font-bold text-navy transition-colors hover:bg-brand-soft disabled:opacity-40"
            >
              السابق
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-xl text-sm font-bold transition-colors ${
                  p === current
                    ? "bg-brand text-primary-foreground"
                    : "border border-border text-navy hover:bg-brand-soft"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, current + 1))}
              disabled={current === totalPages}
              className="h-9 rounded-xl border border-border px-3 text-sm font-bold text-navy transition-colors hover:bg-brand-soft disabled:opacity-40"
            >
              التالي
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <span>عرض</span>
            <div className="relative">
              <select
                aria-label="عدد العناصر في كل صفحة"
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="h-9 appearance-none rounded-xl border border-border bg-card pr-3 pl-7 text-sm font-bold text-navy outline-none focus:border-brand"
              >
                {[5, 10, 15].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
            <span>من كل صفحة</span>
          </div>
        </div>
      </div>
    </section>
  );
}
