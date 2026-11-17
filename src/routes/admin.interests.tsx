import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardList, Users, CalendarDays, Calendar, Clock, CheckCircle2, Search, RotateCcw, Download,
  ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  INTEREST_CITIES, INTEREST_PERIODS, INTEREST_PROGRAMS, INTEREST_STATUS_LABEL,
  buildInterestRecords, filterByRange, interestStats, periodRange,
  type InterestPeriod, type InterestRecord,
} from "@/data/adminInterests";

export const Route = createFileRoute("/admin/interests")({
  head: () => ({
    meta: [
      { title: "تسجيلات الاهتمام — لوحة الإدارة مكافآتي" },
      { name: "description", content: "عرض ومتابعة تسجيلات الاهتمام بالبرامج التدريبية في مكافآتي." },
      { property: "og:title", content: "تسجيلات الاهتمام — مكافآتي" },
      { property: "og:description", content: "عرض ومتابعة تسجيلات الاهتمام بالبرامج التدريبية في مكافآتي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InterestsPage,
});

const card = "rounded-2xl border border-admin-navy/5 bg-card shadow-[0_2px_10px_-4px_rgb(15_30_70/0.12)]";
const field = "h-11 w-full rounded-xl border border-admin-navy/10 bg-card px-3 text-sm outline-none focus:border-admin-blue";
const statusCls = { processing: "bg-admin-amber/15 text-admin-amber", registered: "bg-admin-green/10 text-admin-green" };
const HEADERS = ["#", "اسم العميل", "رقم الجوال", "البرنامج التدريبي", "المدينة", "اسم المسوق", "تاريخ التسجيل", "الحالة"];

const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

function InterestsPage() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  const records = useMemo(() => (now ? buildInterestRecords(now) : []), [now]);

  const [period, setPeriod] = useState<InterestPeriod>("all");
  const [pFrom, setPFrom] = useState("");
  const [pTo, setPTo] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");
  const [program, setProgram] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const inPeriod = useMemo(() => (now ? filterByRange(records, periodRange(period, now, pFrom, pTo)) : []), [records, period, pFrom, pTo, now]);
  const stats = now ? interestStats(inPeriod, now) : null;

  const rows = useMemo(() => {
    const t = q.trim();
    const s = from ? new Date(`${from}T00:00:00`) : null;
    const e = to ? new Date(`${to}T23:59:59.999`) : null;
    return inPeriod.filter((r) =>
      (!t || r.name.includes(t) || r.phone.includes(t)) &&
      (status === "all" || r.status === status) &&
      (city === "all" || r.city === city) &&
      (program === "all" || r.program === program) &&
      (!s || r.date >= s) && (!e || r.date <= e));
  }, [inPeriod, q, status, city, program, from, to]);

  const pages = Math.max(1, Math.ceil(rows.length / perPage));
  const cur = Math.min(page, pages);
  const start = (cur - 1) * perPage;
  const visible = rows.slice(start, start + perPage);
  const upd = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(1); };
  const reset = () => { setQ(""); setStatus("all"); setCity("all"); setProgram("all"); setFrom(""); setTo(""); setPage(1); };
  const pageNums = Array.from({ length: Math.min(5, pages) }, (_, i) => Math.min(Math.max(1, cur - 2), Math.max(1, pages - 4)) + i);

  async function exportXlsx() {
    setExporting(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("تسجيلات الاهتمام", { views: [{ rightToLeft: true }] });
      ws.addRow(HEADERS).font = { bold: true };
      rows.forEach((r: InterestRecord, i) => ws.addRow([i + 1, r.name, r.phone, r.program, r.city, r.marketer, fmt(r.date), INTEREST_STATUS_LABEL[r.status]]));
      ws.columns.forEach((c, i) => { c.width = [6, 26, 14, 26, 14, 22, 18, 16][i]; c.alignment = { horizontal: "right" }; });
      const buf = await wb.xlsx.writeBuffer();
      const url = URL.createObjectURL(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url; a.download = "interest-registrations.xlsx"; a.click();
      URL.revokeObjectURL(url);
    } finally { setExporting(false); }
  }

  const cards = [
    { title: "إجمالي تسجيلات الاهتمام", value: stats?.total, icon: Users, cls: "bg-admin-blue/10 text-admin-blue" },
    { title: "تسجيلات اليوم", value: stats?.today, icon: Calendar, cls: "bg-admin-amber/15 text-admin-amber" },
    { title: "جاري المعالجة", value: stats?.processing, icon: Clock, cls: "bg-admin-navy/10 text-admin-navy/70" },
    { title: "تم التسجيل", value: stats?.registered, icon: CheckCircle2, cls: "bg-admin-green/10 text-admin-green" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
            <ClipboardList className="text-admin-blue" size={28} /> تسجيلات الاهتمام
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">عرض ومتابعة تسجيلات الاهتمام بالبرامج التدريبية</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {period === "custom" && (
            <>
              <input type="date" aria-label="من تاريخ" value={pFrom} onChange={(e) => upd(setPFrom)(e.target.value)} className={`${field} w-auto`} />
              <input type="date" aria-label="إلى تاريخ" value={pTo} onChange={(e) => upd(setPTo)(e.target.value)} className={`${field} w-auto`} />
            </>
          )}
          <Select value={period} onValueChange={(v) => upd(setPeriod)(v as InterestPeriod)}>
            <SelectTrigger dir="rtl" className={`h-11 w-[190px] gap-2 ${card} font-bold`}>
              <CalendarDays size={18} className="text-admin-navy" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {INTEREST_PERIODS.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((s) => (
          <div key={s.title} className={`${card} flex items-center justify-between p-5`}>
            <div>
              <div className="text-[15px] font-bold">{s.title}</div>
              <div className="mt-2 text-3xl font-extrabold">{s.value ?? "—"}</div>
            </div>
            <span className={`grid h-14 w-14 place-items-center rounded-full ${s.cls}`}><s.icon size={26} /></span>
          </div>
        ))}
      </div>

      <div className={`${card} grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.8fr_1fr_1fr_1.2fr_1.6fr_auto]`}>
        <div className="relative sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => upd(setQ)(e.target.value)} placeholder="بحث باسم العميل أو رقم الجوال" className={`${field} pe-3 ps-10`} />
        </div>
        <FilterSelect value={status} onChange={upd(setStatus)} options={[["all", "جميع الحالات"], ["processing", "جاري المعالجة"], ["registered", "تم التسجيل"]]} />
        <FilterSelect value={city} onChange={upd(setCity)} options={[["all", "جميع المدن"], ...INTEREST_CITIES.map((c) => [c, c] as [string, string])]} />
        <FilterSelect value={program} onChange={upd(setProgram)} options={[["all", "جميع البرامج"], ...INTEREST_PROGRAMS.map((c) => [c, c] as [string, string])]} />
        <div className="flex items-center gap-1">
          <input type="date" aria-label="تاريخ التسجيل من" value={from} onChange={(e) => upd(setFrom)(e.target.value)} className={`${field} px-2`} />
          <span className="text-muted-foreground">-</span>
          <input type="date" aria-label="تاريخ التسجيل إلى" value={to} onChange={(e) => upd(setTo)(e.target.value)} className={`${field} px-2`} />
        </div>
        <button type="button" onClick={reset} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-admin-navy/10 px-4 text-sm font-bold text-admin-navy hover:bg-admin-canvas">
          <RotateCcw size={16} /> مسح الفلاتر
        </button>
      </div>

      <div className={`${card} min-w-0 p-4 md:p-5`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-extrabold"><Users size={20} className="text-admin-navy/70" /> قائمة تسجيلات الاهتمام</h2>
          <button type="button" onClick={exportXlsx} disabled={exporting || !rows.length} className="inline-flex h-10 items-center gap-2 rounded-xl border border-admin-navy/15 px-4 text-sm font-bold hover:bg-admin-canvas disabled:opacity-50">
            <Download size={16} /> تصدير
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[960px] text-right text-sm">
            <thead>
              <tr className="bg-admin-canvas text-admin-navy">
                {HEADERS.map((h) => <th key={h} className="whitespace-nowrap px-3 py-3 font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => (
                <tr key={r.id} className="border-b border-admin-navy/5">
                  <td className="px-3 py-3">{start + i + 1}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-bold">{r.name}</td>
                  <td className="px-3 py-3" dir="ltr">{r.phone}</td>
                  <td className="whitespace-nowrap px-3 py-3">{r.program}</td>
                  <td className="whitespace-nowrap px-3 py-3">{r.city}</td>
                  <td className="whitespace-nowrap px-3 py-3">{r.marketer}</td>
                  <td className="whitespace-nowrap px-3 py-3" dir="ltr">{fmt(r.date)}</td>
                  <td className="px-3 py-3"><span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusCls[r.status]}`}>{INTEREST_STATUS_LABEL[r.status]}</span></td>
                </tr>
              ))}
              {now && visible.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-10 text-center text-muted-foreground">لا توجد تسجيلات مطابقة</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-muted-foreground">عرض {rows.length ? start + 1 : 0} - {Math.min(start + perPage, rows.length)} من {rows.length} تسجيل</div>
          <div className="flex items-center gap-1.5">
            <button type="button" aria-label="الصفحة السابقة" disabled={cur <= 1} onClick={() => setPage(cur - 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-admin-navy/10 disabled:opacity-40"><ChevronsRight size={16} /></button>
            {pageNums.map((n) => (
              <button key={n} type="button" onClick={() => setPage(n)} className={`h-9 min-w-9 rounded-lg border px-2 font-bold ${n === cur ? "border-admin-blue bg-admin-blue text-primary-foreground" : "border-admin-navy/10"}`}>{n}</button>
            ))}
            <button type="button" aria-label="الصفحة التالية" disabled={cur >= pages} onClick={() => setPage(cur + 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-admin-navy/10 disabled:opacity-40"><ChevronsLeft size={16} /></button>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            عرض
            <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger dir="rtl" className="h-9 w-[76px]"><SelectValue /></SelectTrigger>
              <SelectContent dir="rtl">{[10, 20, 50].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
            </Select>
            لكل صفحة
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger dir="rtl" className="h-11 rounded-xl border-admin-navy/10"><SelectValue /></SelectTrigger>
      <SelectContent dir="rtl">{options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
    </Select>
  );
}
