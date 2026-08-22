import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Download, Users, Wallet } from "lucide-react";
import { CountUp } from "@/components/dashboard/CountUp";

export const Route = createFileRoute("/dashboard/balance")({
  head: () => ({
    meta: [
      { title: "رصيدي المالي | لوحة تحكم مكافآتي" },
      { name: "description", content: "تابع مكافآتك المالية الناتجة عن تسجيل عملائك." },
      { property: "og:title", content: "رصيدي المالي | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "تابع مكافآتك المالية الناتجة عن تسجيل عملائك." },
    ],
  }),
  component: BalancePage,
});

type BalanceRow = {
  id: number;
  name: string;
  program: string;
  branch: string;
  fee: number;
  paid: number;
  reward: number;
};

const BALANCE_ROWS: BalanceRow[] = [
  { id: 1, name: "فادي حسن المالكي", program: "دبلوم إدارة الموارد البشرية", branch: "جدة الصالحية", fee: 9500, paid: 9500, reward: 475 },
  { id: 2, name: "سعود محسن الحارثي", program: "دبلوم إدارة الموارد البشرية", branch: "مكة المكرمة - الزاهر", fee: 9500, paid: 9500, reward: 475 },
  { id: 3, name: "خالد ناصر العتيبي", program: "دبلوم الذكاء الاصطناعي", branch: "الرياض المنار", fee: 9500, paid: 9500, reward: 475 },
  { id: 4, name: "طلال فهد الزهراني", program: "دبلوم المحاسبة المالية", branch: "جدة الحمراء", fee: 6500, paid: 6500, reward: 325 },
  { id: 5, name: "نايف عمر الشريف", program: "دبلوم التسويق الرقمي", branch: "مكة المكرمة - الزاهر", fee: 8500, paid: 8500, reward: 425 },
  { id: 6, name: "عمر يوسف الحربي", program: "دبلوم تحليل البيانات", branch: "الرياض المنار", fee: 9500, paid: 9500, reward: 475 },
  { id: 7, name: "سلطان أحمد البقمي", program: "دبلوم إدارة المشاريع", branch: "جدة الصالحية", fee: 9000, paid: 9000, reward: 450 },
  { id: 8, name: "عبدالعزيز فيصل السبيعي", program: "دبلوم إدارة الأعمال", branch: "الرياض المنار", fee: 8000, paid: 8000, reward: 400 },
  { id: 9, name: "تركي عادل الشمراني", program: "دبلوم الأمن السيبراني", branch: "جدة الصالحية", fee: 7500, paid: 7500, reward: 375 },
  { id: 10, name: "فيصل منصور الثبيتي", program: "دبلوم الذكاء الاصطناعي", branch: "الرياض المنار", fee: 9500, paid: 9500, reward: 475 },
  { id: 11, name: "عادل حمزة الصاعدي", program: "دبلوم إدارة المشاريع", branch: "مكة المكرمة - الزاهر", fee: 9000, paid: 9000, reward: 450 },
  { id: 12, name: "وليد صابر الحازمي", program: "دبلوم تحليل البيانات", branch: "جدة الحمراء", fee: 9500, paid: 9500, reward: 475 },
];

const stats = [
  { title: "العملاء المسجلون", value: 12, unit: "عميل", icon: Users, tone: "bg-brand-soft text-brand" },
  { title: "إجمالي المكافآت", value: 2450, unit: "ريال سعودي", icon: Wallet, tone: "bg-emerald-50 text-emerald-600" },
  { title: "الرصيد المسحوب", value: 0, unit: "ريال سعودي", icon: Wallet, tone: "bg-slate-100 text-slate-600" },
  { title: "الرصيد المتاح", value: 2450, unit: "ريال سعودي", icon: Wallet, tone: "bg-sky-50 text-sky-600" },
];

function BalancePage() {
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => BALANCE_ROWS, []);
  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * perPage;
  const visible = rows.slice(start, start + perPage);

  const exportPdf = () => {
    const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
<title>رصيدي المالي - مكافآتي</title>
<style>
body{font-family:Tajawal,system-ui,sans-serif;padding:24px;color:#06143F}
h1{font-size:20px;margin:0 0 4px}p{margin:0 0 16px;color:#64748b;font-size:12px}
table{width:100%;border-collapse:collapse;font-size:11px}
th{background:#00194F;color:#fff;padding:8px;text-align:right}
td{padding:7px 8px;border-bottom:1px solid #e5e7eb;text-align:right}
tr:nth-child(even) td{background:#f1f6ff}
</style></head><body>
<h1>رصيدي المالي</h1><p>تابع مكافآتك المالية الناتجة عن تسجيل عملائك.</p>
<table><thead><tr><th>الرقم</th><th>اسم المتدرب</th><th>البرنامج التدريبي</th><th>الفرع</th><th>الرسوم</th><th>المبلغ المسدد</th><th>المكافأة المالية</th></tr></thead><tbody>
${rows
  .map(
    (r) =>
      `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.program}</td><td>${r.branch}</td><td>${r.fee.toLocaleString("en-US")} ريال</td><td>${r.paid.toLocaleString("en-US")} ريال</td><td>${r.reward.toLocaleString("en-US")} ريال</td></tr>`,
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

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500">
      <div className="text-right">
        <h1 className="text-2xl font-black text-navy sm:text-3xl">رصيدي المالي</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          تابع مكافآتك المالية الناتجة عن تسجيل عملائك.
        </p>
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
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-lg font-black text-navy">جدول الرصيد المالي</h2>
          <button
            onClick={exportPdf}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-navy"
          >
            <Download size={17} />
            تصدير
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse overflow-hidden rounded-2xl text-right">
            <thead>
              <tr className="bg-navy-deep text-primary-foreground">
                <th className="px-4 py-3.5 text-sm font-bold">الرقم</th>
                <th className="px-4 py-3.5 text-sm font-bold">اسم المتدرب</th>
                <th className="px-4 py-3.5 text-sm font-bold">البرنامج التدريبي</th>
                <th className="px-4 py-3.5 text-sm font-bold">الفرع</th>
                <th className="px-4 py-3.5 text-sm font-bold">الرسوم</th>
                <th className="px-4 py-3.5 text-sm font-bold">المبلغ المسدد</th>
                <th className="px-4 py-3.5 text-sm font-bold">المكافأة المالية</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr key={row.id} className={i % 2 === 1 ? "bg-brand-soft/70" : "bg-card"}>
                  <td className="px-4 py-3 text-sm font-bold text-navy">{row.id}</td>
                  <td className="px-4 py-3 text-sm font-bold text-navy">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-navy">{row.program}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{row.branch}</td>
                  <td className="px-4 py-3 text-sm font-bold text-navy">
                    {row.fee.toLocaleString("en-US")} ريال
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-navy">
                    {row.paid.toLocaleString("en-US")} ريال
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-navy">
                    {row.reward.toLocaleString("en-US")} ريال
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground sm:text-sm">
            عرض {rows.length === 0 ? 0 : start + 1} إلى {Math.min(start + perPage, rows.length)} من{" "}
            {rows.length} متدرب
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
