import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from '@/components/ui/button';
import { useMockAds } from '@/data/adminAdsStore';
import { AdPreview } from '@/components/admin/AdPreview';
import {
  Megaphone, CheckCircle2, PauseCircle, CalendarClock, CalendarDays, Search, RotateCcw, Download, Plus,
  ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown, MoreHorizontal, Eye, Pencil, Copy, PlayCircle, BarChart3,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { INTEREST_PERIODS, type InterestPeriod } from "@/data/adminInterests";
import {
  AD_CITIES, AD_MODES, AD_STATUS_LABEL, AD_TYPES, adStats, adsInPeriod, duplicateAd, moveAd, toggleAd,
  type AdRecord,
} from "@/data/adminAds";

export const Route = createFileRoute("/admin/ads")({
  head: () => ({
    meta: [
      { title: "إدارة الإعلانات — لوحة الإدارة مكافآتي" },
      { name: "description", content: "إدارة الإعلانات التسويقية للبرامج التدريبية ومتابعة حالاتها وترتيب ظهورها في مكافآتي." },
      { property: "og:title", content: "إدارة الإعلانات — مكافآتي" },
      { property: "og:description", content: "إدارة الإعلانات التسويقية للبرامج التدريبية ومتابعة حالاتها وترتيب ظهورها." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdsPage,
});

const card = "rounded-2xl border border-admin-navy/5 bg-card shadow-[0_2px_10px_-4px_rgb(15_30_70/0.12)]";
const field = "h-11 w-full rounded-xl border border-admin-navy/10 bg-card px-3 text-sm outline-none focus:border-admin-blue";
const statusCls = {
  active: "bg-admin-green/10 text-admin-green", paused: "bg-admin-red/10 text-admin-red",
  scheduled: "bg-admin-amber/15 text-admin-amber", draft: "bg-muted text-muted-foreground",
};
const HEADERS = ["#", "صورة الإعلان", "اسم الإعلان", "البرنامج التدريبي", "المدينة", "الرسوم", "تاريخ الإنشاء", "الحالة", "ترتيب العرض", "الإجراءات"];
const pad = (n: number) => String(n).padStart(2, "0");
const fmtDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const money = (n: number) => `${n.toLocaleString("en-US")} ريال`;
const citiesText = (c: string[]) => (c.length === AD_CITIES.length ? "جميع المدن" : c.length > 2 ? `${c[0]} +${c.length - 1}` : c.join("، "));

function AdsPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [ads, setAds] = useMockAds();
  useEffect(() => { setNow(new Date()); }, []);

  const [period, setPeriod] = useState<InterestPeriod>("all");
  const [pFrom, setPFrom] = useState("");
  const [pTo, setPTo] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");
  const [mode, setMode] = useState("all");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<AdRecord | null>(null);
  const [exporting, setExporting] = useState(false);

  const inPeriod = useMemo(() => (now ? adsInPeriod(ads, period, now, pFrom, pTo) : []), [ads, period, pFrom, pTo, now]);
  const stats = now ? adStats(inPeriod) : null;
  const rows = useMemo(() => {
    const t = q.trim();
    return inPeriod
      .filter((a) => (!t || a.name.includes(t) || a.program.includes(t)) &&
        (status === "all" || a.status === status) && (city === "all" || a.cities.includes(city)) &&
        (type === "all" || a.type === type) && (mode === "all" || a.mode === mode))
      .sort((a, b) => a.order - b.order);
  }, [inPeriod, q, status, city, type, mode]);

  const pages = Math.max(1, Math.ceil(rows.length / perPage));
  const cur = Math.min(page, pages);
  const start = (cur - 1) * perPage;
  const visible = rows.slice(start, start + perPage);
  const upd = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(1); };
  const reset = () => { setQ(""); setStatus("all"); setCity("all"); setType("all"); setMode("all"); setPage(1); };
  const pageNums = Array.from({ length: Math.min(5, pages) }, (_, i) => Math.min(Math.max(1, cur - 2), Math.max(1, pages - 4)) + i);
  const maxOrder = Math.max(0, ...ads.map((a) => a.order));

  async function exportXlsx() {
    setExporting(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("الإعلانات", { views: [{ rightToLeft: true }] });
      ws.addRow(["#", "اسم الإعلان", "البرنامج التدريبي", "المدينة", "رسوم الكاش", "رسوم الأقساط", "تاريخ الإنشاء", "الحالة", "ترتيب العرض"]).font = { bold: true };
      rows.forEach((a, i) => ws.addRow([i + 1, a.name, a.program, a.cities.join("، "), a.cash, a.installments, fmtDate(a.createdAt), AD_STATUS_LABEL[a.status], a.order]));
      ws.columns.forEach((c, i) => { c.width = [6, 36, 30, 28, 14, 14, 16, 12, 12][i] ?? 14; c.alignment = { horizontal: "right" }; });
      const buf = await wb.xlsx.writeBuffer();
      const url = URL.createObjectURL(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url; a.download = "ads.xlsx"; a.click();
      URL.revokeObjectURL(url);
    } finally { setExporting(false); }
  }

  const cards = [
    { title: "إجمالي الإعلانات", value: stats?.total, icon: Megaphone, cls: "bg-admin-blue/10 text-admin-blue" },
    { title: "الإعلانات النشطة", value: stats?.active, icon: CheckCircle2, cls: "bg-admin-green/10 text-admin-green" },
    { title: "الإعلانات الموقوفة", value: stats?.paused, icon: PauseCircle, cls: "bg-admin-red/10 text-admin-red" },
    { title: "الإعلانات المجدولة", value: stats?.scheduled, icon: CalendarClock, cls: "bg-admin-amber/15 text-admin-amber" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
            <Megaphone className="text-admin-blue" size={28} /> إدارة الإعلانات
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">إدارة الإعلانات التسويقية للبرامج التدريبية ومتابعة حالاتها وترتيب ظهورها</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {period === "custom" && (
            <>
              <input type="date" aria-label="من تاريخ" value={pFrom} onChange={(e) => upd(setPFrom)(e.target.value)} className={`${field} w-auto`} />
              <input type="date" aria-label="إلى تاريخ" value={pTo} onChange={(e) => upd(setPTo)(e.target.value)} className={`${field} w-auto`} />
            </>
          )}
          <Select value={period} onValueChange={(v) => upd(setPeriod)(v as InterestPeriod)}>
            <SelectTrigger dir="rtl" aria-label="الفترة الزمنية" className={`h-11 w-[190px] gap-2 ${card} font-bold`}>
              <CalendarDays size={18} className="text-admin-navy" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir="rtl">{INTEREST_PERIODS.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
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

      <div className={`${card} grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.8fr_1fr_1fr_1fr_1fr_auto]`}>
        <div className="relative sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => upd(setQ)(e.target.value)} placeholder="ابحث باسم الإعلان أو البرنامج التدريبي" className={`${field} pe-3 ps-10`} />
        </div>
        <FilterSelect label="الحالة" value={status} onChange={upd(setStatus)} options={[["all", "جميع الحالات"], ...Object.entries(AD_STATUS_LABEL) as [string, string][]]} />
        <FilterSelect label="المدينة" value={city} onChange={upd(setCity)} options={[["all", "جميع المدن"], ...AD_CITIES.map((c) => [c, c] as [string, string])]} />
        <FilterSelect label="نوع البرنامج" value={type} onChange={upd(setType)} options={[["all", "جميع الأنواع"], ...AD_TYPES.map((c) => [c, c] as [string, string])]} />
        <FilterSelect label="نمط التدريب" value={mode} onChange={upd(setMode)} options={[["all", "جميع الأنماط"], ...AD_MODES.map((c) => [c, c] as [string, string])]} />
        <button type="button" onClick={reset} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-admin-navy/10 px-4 text-sm font-bold text-admin-navy hover:bg-admin-canvas">
          <RotateCcw size={16} /> مسح الفلاتر
        </button>
      </div>

      <div className={`${card} min-w-0 p-4 md:p-5`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-extrabold"><Megaphone size={20} className="text-admin-navy/70" /> قائمة الإعلانات ({rows.length})</h2>
          <div className="flex items-center gap-2">
            <Button asChild className="h-10 rounded-xl bg-admin-blue font-bold text-primary-foreground hover:bg-admin-blue/90"><Link to="/admin/ads/new"><Plus size={16} /> إضافة إعلان جديد</Link></Button>
            <button type="button" onClick={exportXlsx} disabled={exporting || !rows.length} className="inline-flex h-10 items-center gap-2 rounded-xl border border-admin-navy/15 px-4 text-sm font-bold hover:bg-admin-canvas disabled:opacity-50">
              <Download size={16} /> تصدير
            </button>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] text-right text-sm">
            <thead>
              <tr className="bg-admin-canvas text-admin-navy">
                {HEADERS.map((h) => <th key={h} className="whitespace-nowrap px-3 py-3 font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {visible.map((a, i) => (
                <tr key={a.id} className="border-b border-admin-navy/5">
                  <td className="px-3 py-3">{start + i + 1}</td>
                  <td className="px-3 py-2">{a.image ? <img src={a.image} alt={a.name} className="h-11 w-11 rounded-lg object-contain" loading="lazy" /> : <span className="grid h-11 w-11 place-items-center rounded-lg bg-muted text-xs">بلا صورة</span>}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-bold">{a.name}</td>
                  <td className="whitespace-nowrap px-3 py-3">{a.program}</td>
                  <td className="whitespace-nowrap px-3 py-3" title={a.cities.join("، ")}>{citiesText(a.cities)}</td>
                  <td className="whitespace-nowrap px-3 py-3 leading-5">
                    <div><span className="text-muted-foreground">كاش: </span><b>{money(a.cash)}</b></div>
                    <div className="text-xs"><span className="text-muted-foreground">أقساط: </span>{money(a.installments)}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3" dir="ltr">{fmtDate(a.createdAt)}</td>
                  <td className="px-3 py-3"><span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusCls[a.status]}`}>{AD_STATUS_LABEL[a.status]}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <span className="grid h-8 min-w-8 place-items-center rounded-lg border border-admin-navy/10 px-2 font-bold">{a.order}</span>
                      <div className="flex flex-col">
                        <button type="button" aria-label="تحريك للأعلى" disabled={a.order <= 1} onClick={() => setAds((x) => moveAd(x, a.id, -1))} className="rounded p-0.5 hover:bg-admin-canvas disabled:opacity-30"><ChevronUp size={14} /></button>
                        <button type="button" aria-label="تحريك للأسفل" disabled={a.order >= maxOrder} onClick={() => setAds((x) => moveAd(x, a.id, 1))} className="rounded p-0.5 hover:bg-admin-canvas disabled:opacity-30"><ChevronDown size={14} /></button>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <DropdownMenu dir="rtl">
                      <DropdownMenuTrigger aria-label="الإجراءات" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-admin-canvas"><MoreHorizontal size={18} /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setPreview(a)}><Eye size={16} /> معاينة الإعلان</DropdownMenuItem>
                        <DropdownMenuItem disabled><Pencil size={16} /> تعديل الإعلان <Soon /></DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => now && setAds((x) => duplicateAd(x, a.id, new Date()))}><Copy size={16} /> نسخ الإعلان</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setAds((x) => toggleAd(x, a.id))}>
                          {a.status === "active" ? <><PauseCircle size={16} /> إيقاف الإعلان</> : <><PlayCircle size={16} /> تفعيل الإعلان</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled><BarChart3 size={16} /> تقارير الأداء <Soon /></DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {now && visible.length === 0 && (
                <tr><td colSpan={HEADERS.length} className="px-3 py-10 text-center text-muted-foreground">لا توجد إعلانات مطابقة</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-muted-foreground">عرض {rows.length ? start + 1 : 0} - {Math.min(start + perPage, rows.length)} من {rows.length} إعلان</div>
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

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent dir="rtl" className="max-w-md text-right">
          <DialogHeader><DialogTitle className="pe-8 text-right">معاينة الإعلان</DialogTitle></DialogHeader>
          {preview && <AdPreview ad={preview} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Soon() {
  return <span className="ms-auto rounded-full bg-muted px-2 text-[11px]">قريبًا</span>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger dir="rtl" aria-label={label} className="h-11 rounded-xl border-admin-navy/10"><SelectValue /></SelectTrigger>
      <SelectContent dir="rtl">{options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
    </Select>
  );
}
