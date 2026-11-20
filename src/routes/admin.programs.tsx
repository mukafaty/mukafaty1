import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, MonitorPlay, CheckCircle2, PauseCircle, Search, RotateCcw, Plus, MoreHorizontal, Eye, Pencil, PlayCircle, ChevronsLeft, ChevronsRight, Building2, Laptop, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  buildProgramRecords, programStats, filterPrograms, toggleProgram, paginatePrograms,
  EMPTY_PROGRAM_FILTERS, PROGRAM_TYPES, PROGRAM_MODES, PROGRAM_CITIES, PROGRAM_STATUS,
  type ProgramRecord, type ProgramFilters,
} from "@/data/adminPrograms";

export const Route = createFileRoute("/admin/programs")({
  head: () => ({ meta: [
    { title: "البرامج التدريبية — لوحة الإدارة مكافآتي" },
    { name: "description", content: "إدارة البرامج التدريبية في مكافآتي ومتابعة أنواعها ومدنها ورسومها وحالاتها." },
    { property: "og:title", content: "البرامج التدريبية — مكافآتي" },
    { property: "og:description", content: "قائمة البرامج التدريبية والدبلومات والدورات وبرامج اللغة الإنجليزية في مكافآتي." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: ProgramsPage,
});

const card = "rounded-2xl border border-admin-navy/5 bg-card shadow-sm";
const typeClasses: Record<ProgramRecord["type"], string> = {
  "دبلوم": "bg-admin-purple/10 text-admin-purple",
  "دورة": "bg-admin-blue/10 text-admin-blue",
  "لغة إنجليزية": "bg-admin-green/10 text-admin-green",
};
const statusClasses = { active: "bg-admin-green/10 text-admin-green", paused: "bg-admin-red/10 text-admin-red" };
const modeIcons = { "حضوري": Building2, "عن بُعد": Laptop, "مدمج": Layers };
const headers = ["الرقم", "اسم البرنامج", "نوع البرنامج", "نمط التدريب", "المدة", "المدن المتاحة", "رسوم الكاش", "رسوم الأقساط", "الحالة", "الإجراءات"];
const money = (value: number) => `${value.toLocaleString("en-US")} ر.س`;
const citiesLabel = (cities: string[]) => cities.length === PROGRAM_CITIES.length ? "جميع المدن" : cities.join("، ");

function ProgramsPage() {
  const [programs, setPrograms] = useState(buildProgramRecords);
  const [filters, setFilters] = useState<ProgramFilters>(EMPTY_PROGRAM_FILTERS);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [soon, setSoon] = useState<string | null>(null);
  const stats = useMemo(() => programStats(programs), [programs]);
  const rows = useMemo(() => filterPrograms(programs, filters), [programs, filters]);
  const { pages, current, start, visible } = paginatePrograms(rows, page, perPage);
  const detail = programs.find((p) => p.id === detailId);
  function updateFilter(key: keyof ProgramFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }
  const cards = [
    { title: "إجمالي البرامج", value: stats.total, icon: BookOpen, cls: "bg-admin-blue/10 text-admin-blue" },
    { title: "البرامج النشطة", value: stats.active, icon: CheckCircle2, cls: "bg-admin-green/10 text-admin-green" },
    { title: "البرامج الموقوفة", value: stats.paused, icon: PauseCircle, cls: "bg-admin-red/10 text-admin-red" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl"><MonitorPlay className="shrink-0 text-admin-blue" size={28} /> البرامج التدريبية</h1>
          <p className="mt-1 text-sm text-muted-foreground">إدارة الدبلومات والدورات وبرامج اللغة الإنجليزية</p>
        </div>
        <Button onClick={() => setSoon("إضافة برنامج جديد")} className="h-11 rounded-xl bg-admin-blue font-bold text-primary-foreground hover:bg-admin-blue/90"><Plus size={18} /> إضافة برنامج جديد</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((s) => <div key={s.title} className={`${card} flex items-center justify-between gap-3 p-5`}>
          <div><div className="text-[15px] font-bold">{s.title}</div><div className="mt-2 text-3xl font-extrabold" aria-label={s.title}>{s.value}</div></div>
          <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${s.cls}`}><s.icon size={26} /></span>
        </div>)}
      </div>

      <div className="grid gap-3 border-y border-admin-navy/5 bg-card p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(190px,1.7fr)_repeat(4,minmax(120px,1fr))_auto]">
        <label className="block min-w-0 sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <span className="mb-1.5 block text-xs font-bold">البحث</span>
          <div className="relative"><Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input aria-label="البحث باسم البرنامج" type="search" value={filters.query} onChange={(e) => updateFilter("query", e.target.value)} placeholder="ابحث باسم البرنامج..." className="h-11 w-full rounded-xl border border-admin-navy/10 bg-card ps-10 pe-3 text-sm outline-none focus:border-admin-blue" />
          </div>
        </label>
        <FilterSelect label="نوع البرنامج" value={filters.type} onChange={(v) => updateFilter("type", v)} options={[["all", "جميع الأنواع"], ...PROGRAM_TYPES.map((v): [string, string] => [v, v])]} />
        <FilterSelect label="المدينة" value={filters.city} onChange={(v) => updateFilter("city", v)} options={[["all", "جميع المدن"], ...PROGRAM_CITIES.map((v): [string, string] => [v, v])]} />
        <FilterSelect label="نمط التدريب" value={filters.mode} onChange={(v) => updateFilter("mode", v)} options={[["all", "جميع الأنماط"], ...PROGRAM_MODES.map((v): [string, string] => [v, v])]} />
        <FilterSelect label="الحالة" value={filters.status} onChange={(v) => updateFilter("status", v)} options={[["all", "جميع الحالات"], ...Object.entries(PROGRAM_STATUS)]} />
        <Button variant="outline" onClick={() => { setFilters(EMPTY_PROGRAM_FILTERS); setPage(1); }} className="h-11 self-end rounded-xl border-admin-navy/10 text-admin-navy hover:bg-admin-canvas hover:text-admin-navy"><RotateCcw size={16} /> مسح الفلاتر</Button>
      </div>

      <section className="min-w-0 border-y border-admin-navy/5 bg-card p-4 md:p-5" aria-label="قائمة البرامج التدريبية">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold"><BookOpen size={22} className="text-admin-blue" /> قائمة البرامج التدريبية <span className="text-sm font-medium text-muted-foreground">({rows.length})</span></h2>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[940px] table-fixed text-right text-xs">
            <colgroup><col className="w-[4%]" /><col className="w-[23%]" /><col className="w-[10%]" /><col className="w-[10%]" /><col className="w-[7%]" /><col className="w-[13%]" /><col className="w-[9%]" /><col className="w-[9%]" /><col className="w-[7%]" /><col className="w-[8%]" /></colgroup>
            <thead><tr className="bg-admin-canvas text-admin-navy">{headers.map((h) => <th key={h} scope="col" className="px-2 py-3 font-bold">{h}</th>)}</tr></thead>
            <tbody>
              {visible.map((p, i) => {
                const ModeIcon = modeIcons[p.mode];
                return <tr key={p.id} className="border-b border-admin-navy/5 hover:bg-admin-canvas/50">
                  <td className="px-2 py-3">{start + i + 1}</td>
                  <td className="px-2 py-3 font-bold">{p.name}</td>
                  <td className="px-2 py-3"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold ${typeClasses[p.type]}`}>{p.type}</span></td>
                  <td className="px-2 py-3"><span className="flex items-center gap-1 whitespace-nowrap"><ModeIcon size={15} className="shrink-0 text-admin-blue" />{p.mode}</span></td>
                  <td className="px-2 py-3">{p.duration}</td>
                  <td className="px-2 py-3" title={p.cities.join("، ")}>{citiesLabel(p.cities)}</td>
                  <td className="px-2 py-3 font-bold">{money(p.cash)}</td>
                  <td className="px-2 py-3 font-bold">{money(p.installments)}</td>
                  <td className="px-2 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-2 py-3">
                    <DropdownMenu dir="rtl">
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`إجراءات ${p.name}`} title="الإجراءات" className="h-8 w-8 rounded-lg bg-admin-blue/5 text-admin-blue hover:bg-admin-blue/10 hover:text-admin-blue"><MoreHorizontal size={18} /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setDetailId(p.id)}><Eye size={16} /> عرض التفاصيل</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setSoon("تعديل البرنامج")}><Pencil size={16} /> تعديل البرنامج <span className="ms-auto text-xs text-muted-foreground">قريبًا</span></DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setPrograms((prev) => toggleProgram(prev, p.id))}>{p.status === "active" ? <><PauseCircle size={16} /> إيقاف البرنامج</> : <><PlayCircle size={16} /> تفعيل البرنامج</>}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>;
              })}
              {visible.length === 0 && <tr><td colSpan={headers.length} className="py-12 text-center text-muted-foreground">لا توجد برامج مطابقة</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-muted-foreground">عرض {rows.length ? start + 1 : 0} – {Math.min(start + perPage, rows.length)} من {rows.length} برنامجًا</div>
          <nav aria-label="صفحات البرامج" className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" aria-label="الصفحة السابقة" disabled={current <= 1} onClick={() => setPage(current - 1)} className="rounded-lg border-admin-navy/10 hover:bg-admin-canvas hover:text-admin-navy"><ChevronsRight size={16} /></Button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => <Button key={n} variant="outline" aria-label={`الصفحة ${n}`} aria-current={n === current ? "page" : undefined} onClick={() => setPage(n)} className={`h-9 min-w-9 rounded-lg px-2 font-bold ${n === current ? "border-admin-blue bg-admin-blue text-primary-foreground hover:bg-admin-blue/90 hover:text-primary-foreground" : "border-admin-navy/10 hover:bg-admin-canvas hover:text-admin-navy"}`}>{n}</Button>)}
            <Button variant="outline" size="icon" aria-label="الصفحة التالية" disabled={current >= pages} onClick={() => setPage(current + 1)} className="rounded-lg border-admin-navy/10 hover:bg-admin-canvas hover:text-admin-navy"><ChevronsLeft size={16} /></Button>
          </nav>
          <div className="flex items-center gap-2 text-muted-foreground"><span>لكل صفحة</span>
            <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}><SelectTrigger dir="rtl" aria-label="عدد البرامج لكل صفحة" className="h-9 w-[76px] rounded-lg"><SelectValue /></SelectTrigger><SelectContent dir="rtl">{[10, 20, 50].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent></Select>
          </div>
        </div>
      </section>

      <Dialog open={Boolean(detail)} onOpenChange={(open) => { if (!open) setDetailId(null); }}>
        <DialogContent dir="rtl" className="max-h-[85vh] w-[calc(100%-2rem)] overflow-y-auto rounded-xl text-right sm:max-w-xl">
          <DialogHeader><DialogTitle className="ps-7 text-right tracking-normal">تفاصيل البرنامج</DialogTitle><DialogDescription className="text-right">{detail?.name}</DialogDescription></DialogHeader>
          {detail && <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <Detail label="رقم البرنامج" value={detail.id} />
            <Detail label="اسم البرنامج" value={detail.name} />
            <Detail label="نوع البرنامج" value={detail.type} />
            <Detail label="نمط التدريب" value={detail.mode} />
            <Detail label="المدة" value={detail.duration} />
            <div><dt className="mb-1 text-xs text-muted-foreground">الحالة</dt><dd><StatusBadge status={detail.status} /></dd></div>
            <Detail label="المدن المتاحة" value={detail.cities.join("، ")} />
            <Detail label="رسوم الكاش" value={money(detail.cash)} />
            <Detail label="رسوم الأقساط" value={money(detail.installments)} />
          </dl>}
        </DialogContent>
      </Dialog>
      <Dialog open={soon !== null} onOpenChange={(open) => { if (!open) setSoon(null); }}>
        <DialogContent dir="rtl" className="w-[calc(100%-2rem)] rounded-xl sm:max-w-sm"><DialogHeader><DialogTitle className="ps-7 text-right tracking-normal">{soon}</DialogTitle><DialogDescription className="text-right">قريبًا</DialogDescription></DialogHeader></DialogContent>
      </Dialog>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return <div className="min-w-0"><span className="mb-1.5 block text-xs font-bold">{label}</span><Select value={value} onValueChange={onChange}><SelectTrigger dir="rtl" aria-label={label} className="h-11 rounded-xl border-admin-navy/10"><SelectValue /></SelectTrigger><SelectContent dir="rtl">{options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select></div>;
}
function StatusBadge({ status }: { status: ProgramRecord["status"] }) {
  return <span className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold ${statusClasses[status]}`}>{PROGRAM_STATUS[status]}</span>;
}
function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="mb-1 text-xs text-muted-foreground">{label}</dt><dd className="break-words text-sm font-bold">{value}</dd></div>;
}