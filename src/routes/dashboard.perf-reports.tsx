import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import {
  AlertCircle,
  BarChart3,
  ChevronDown,
  Download,
  Info,
  LoaderCircle,
  MousePointer2,
  RotateCcw,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PerformanceReportDocument } from "@/components/dashboard/reports/PerformanceReportDocument";
import { exportPerformanceReportPdf } from "@/lib/performanceReportPdf";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TiktokColorIcon } from "@/components/dashboard/SocialIcons";
import {
  PLATFORM_META,
  PROGRAM_META,
  REPORT_PERIODS,
  buildReport,
  conversionRate,
  periodRange,
  toInputDate,
  type PerformanceRow,
  type PlatformPerformance,
  type ProgramPerformance,
  type ReportMetric,
  type ReportPeriod,
  type SourceKey,
} from "@/data/performanceReports";

export const Route = createFileRoute("/dashboard/perf-reports")({
  head: () => ({
    meta: [
      { title: "تقارير الأداء | لوحة تحكم مكافآتي" },
      { name: "description", content: "تابع نتائج مشاركاتك وتعرّف على المنصات والبرامج الأفضل أداءً." },
      { property: "og:title", content: "تقارير الأداء | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "تابع نتائج مشاركاتك وتعرّف على المنصات والبرامج الأفضل أداءً." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PerformanceReportsPage,
});

type ReportStatus = "ready" | "loading" | "error";
type IconType = ComponentType<{ size?: number; className?: string }>;

const METRICS: { key: ReportMetric; label: string }[] = [
  { key: "clicks", label: "عدد النقرات" },
  { key: "interests", label: "تسجيلات الاهتمام" },
  { key: "conversion", label: "معدل التحويل إلى التسجيل" },
  { key: "students", label: "عدد المتدربين" },
  { key: "rewards", label: "إجمالي المكافآت" },
];

const INFO_TEXT = {
  clicks: "عدد النقرات المسجلة على روابط إحالتك خلال الفترة المختارة، وقد ينقر الشخص نفسه أكثر من مرة.",
  interests: "عدد تسجيلات البيانات عبر روابطك خلال الفترة المختارة.",
  conversion: "تسجيلات الاهتمام مقسومة على عدد النقرات × 100.",
  students: "عدد من أكملوا التسجيل في المعهد وتم تأكيد سدادهم، وفق الفترة المختارة.",
  rewards: "مجموع المكافآت المعتمدة الناتجة عن إحالاتك خلال الفترة المختارة.",
  platforms: "تُحدَّد المنصة بحسب رابط الإحالة المستخدم، وقد تختلف عن المكان الذي نُشر فيه الرابط فعليًا.",
  chart: "اختر مؤشرًا للمقارنة بين المنصات. يعرض ارتفاع العمود قيمة المؤشر لكل منصة.",
  programs: "نتائج إحالاتك موزّعة حسب البرنامج التدريبي، وفق الفلاتر المختارة.",
};

const EMPTY_MESSAGE = "لا توجد بيانات خلال الفترة المحددة";

const PLATFORM_BAR_FILL: Record<SourceKey, string> = {
  whatsapp: "var(--report-whatsapp)",
  telegram: "var(--report-telegram)",
  snapchat: "var(--report-snapchat)",
  tiktok: "url(#tiktokBar)",
  instagram: "url(#instagramBar)",
  facebook: "var(--report-facebook)",
  x: "var(--report-x)",
  linkedin: "var(--report-linkedin)",
  google: "url(#googleBar)",
  email: "var(--report-email)",
  unknown: "var(--muted-foreground)",
};

function InfoHelp({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keepOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`معلومات عن ${label}`}
          onMouseEnter={keepOpen}
          onMouseLeave={closeSoon}
          className="size-7 shrink-0 rounded-full p-0 text-brand shadow-none hover:bg-brand-soft hover:text-brand"
        >
          <Info size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        collisionPadding={12}
        onMouseEnter={keepOpen}
        onMouseLeave={closeSoon}
        className="w-[min(19rem,calc(100vw-1.5rem))] rounded-xl p-3 text-right text-xs font-medium leading-6 text-navy"
        dir="rtl"
      >
        {text}
      </PopoverContent>
    </Popover>
  );
}

function GoogleIcon({ size = 24 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-full bg-card font-black"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.72) }}
    >
      <span className="text-report-google">G</span>
    </span>
  );
}

function PlatformIcon({ platform, size = 26 }: { platform: PlatformPerformance; size?: number }) {
  if (platform.key === "tiktok") return <TiktokColorIcon size={size} />;
  if (platform.key === "google") return <GoogleIcon size={size} />;
  return platform.iconUrl ? <img src={platform.iconUrl} alt="" className="rounded-full object-cover" style={{ width: size, height: size }} /> : null;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="relative min-w-0">
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-border bg-card pr-4 pl-10 text-sm font-bold text-navy outline-none transition-colors focus:border-brand">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand" />
    </div>
  );
}

function DateField({ label, value, onChange, disabled }: { label: string; value: string; onChange: (value: string) => void; disabled: boolean }) {
  return (
    <label className="relative min-w-0">
      <span className="sr-only">{label}</span>
      <input type="date" aria-label={label} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm font-bold text-navy outline-none focus:border-brand disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground" />
      {!value ? <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{label}</span> : null}
    </label>
  );
}

function MetricCard({ title, value, unit, icon: Icon, tone, info }: { title: string; value: string; unit?: string; icon: IconType; tone: string; info: string }) {
  return (
    <article className="flex min-h-36 flex-col justify-between rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-black leading-6 text-navy">{title}</h2>
        <InfoHelp label={title} text={info} />
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p dir="ltr" className="text-right text-2xl font-black text-navy sm:text-3xl">{value}</p>
          {unit ? <p className="mt-1 text-xs font-medium text-muted-foreground">{unit}</p> : null}
        </div>
        <span className={`grid size-11 shrink-0 place-items-center rounded-full ${tone}`}><Icon size={21} /></span>
      </div>
    </article>
  );
}

function SectionTitle({ title, info }: { title: string; info: string }) {
  return (
    <div className="flex items-center gap-1">
      <h2 className="text-lg font-black text-navy">{title}</h2>
      <InfoHelp label={title} text={info} />
    </div>
  );
}

const nf = (value: number) => value.toLocaleString("en-US");
const percent = (row: PerformanceRow) => `${conversionRate(row).toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;

function EmptySection() {
  return <p className="py-10 text-center text-sm font-bold text-muted-foreground">{EMPTY_MESSAGE}</p>;
}

function DataCells({ row }: { row: PerformanceRow }) {
  return (
    <>
      <td className="px-4 py-3 text-center font-bold text-navy">{nf(row.clicks)}</td>
      <td className="px-4 py-3 text-center font-bold text-navy">{nf(row.interests)}</td>
      <td className="px-4 py-3 text-center font-bold text-navy">{percent(row)}</td>
      <td className="px-4 py-3 text-center font-bold text-navy">{nf(row.students)}</td>
      <td className="px-4 py-3 text-center font-black text-emerald-700">{nf(row.rewards)} ريال</td>
    </>
  );
}

function ReportTable({
  type,
  rows,
  total,
}: {
  type: "platforms" | "programs";
  rows: PlatformPerformance[] | ProgramPerformance[];
  total?: PerformanceRow;
}) {
  const isPlatforms = type === "platforms";
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] border-separate border-spacing-0 text-sm">
        <thead><tr className="bg-brand-soft text-navy">
          <th className="rounded-r-xl px-4 py-3 text-right font-black">{isPlatforms ? "المنصة" : "البرنامج التدريبي"}</th>
          <th className="px-4 py-3 text-center font-black">عدد النقرات</th><th className="px-4 py-3 text-center font-black">تسجيلات الاهتمام</th><th className="px-4 py-3 text-center font-black">معدل التحويل إلى التسجيل</th><th className="px-4 py-3 text-center font-black">عدد المتدربين</th><th className="rounded-l-xl px-4 py-3 text-center font-black">إجمالي المكافآت</th>
        </tr></thead>
        <tbody>
          {rows.map((row, index) => {
            const platform = isPlatforms ? (row as PlatformPerformance) : null;
            return <tr key={platform ? platform.key : (row as ProgramPerformance).id} className={index % 2 ? "bg-brand-soft/55" : "bg-card"}>
              <td className="px-4 py-3 font-bold text-navy">{platform ? <span className="flex items-center gap-2"><PlatformIcon platform={platform} size={24} />{platform.name}</span> : (row as ProgramPerformance).name}</td>
              <DataCells row={row} />
            </tr>;
          })}
          {total ? <tr className="border-t border-border bg-muted font-black"><td className="rounded-r-xl px-4 py-3 text-navy">الإجمالي</td><DataCells row={total} /></tr> : null}
        </tbody>
      </table>
    </div>
  );
}

type ChartDatum = PlatformPerformance & { conversion: number };

function ChartTick({ x = 0, y = 0, payload, rows }: { x?: number; y?: number; payload?: { value: SourceKey }; rows?: ChartDatum[] }) {
  const platform = rows?.find((item) => item.key === payload?.value);
  if (!platform) return null;
  return (
    <g transform={`translate(${x},${y})`}>
      {platform.iconUrl ? <image href={platform.iconUrl} x={-12} y={8} width={24} height={24} /> : null}
      {platform.key === "google" ? <text x="0" y="26" textAnchor="middle" fontSize="20" fontWeight="800" fill="var(--report-google)">G</text> : null}
      {platform.key === "tiktok" ? <text x="0" y="26" textAnchor="middle" fontSize="19" fontWeight="900" fill="var(--report-tiktok-red)">♪</text> : null}
      <text x="0" y="48" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--navy)">{platform.name}</text>
    </g>
  );
}

function metricValueText(metric: ReportMetric, value: number) {
  if (metric === "conversion") return `${value.toFixed(1)}%`;
  if (metric === "rewards") return `${nf(value)} ريال`;
  return nf(value);
}

function ChartTooltip({ active, payload, metric }: { active?: boolean; payload?: { payload: ChartDatum }[]; metric: ReportMetric }) {
  const datum = active ? payload?.[0]?.payload : undefined;
  if (!datum) return null;
  const label = METRICS.find((item) => item.key === metric)?.label ?? "";
  return (
    <div dir="rtl" className="rounded-xl border border-border bg-card px-3 py-2 text-right text-xs font-bold text-navy shadow-md">
      <p className="font-black">{datum.name}</p>
      <p className="mt-1 text-muted-foreground">{label}</p>
      <p dir="ltr" className="text-right text-sm font-black text-navy">{metricValueText(metric, datum[metric])}</p>
    </div>
  );
}

function PerformanceChart({ metric, onMetricChange, rows }: { metric: ReportMetric; onMetricChange: (metric: ReportMetric) => void; rows: PlatformPerformance[] }) {
  const data = useMemo<ChartDatum[]>(() => [...rows].reverse().map((row) => ({ ...row, conversion: conversionRate(row) })), [rows]);
  const hasValues = data.some((item) => item[metric] > 0);
  return (
    <>
      <div className="mt-4 grid min-w-[760px] grid-cols-5 gap-1 rounded-xl bg-brand-soft p-1">
        {METRICS.map((item) => <Button key={item.key} type="button" variant={metric === item.key ? "default" : "ghost"} onClick={() => onMetricChange(item.key)} className={`h-auto min-h-11 whitespace-normal rounded-lg px-2 py-2 text-xs font-bold shadow-none ${metric === item.key ? "bg-brand text-primary-foreground hover:bg-brand" : "text-navy hover:bg-card"}`}>{item.label}</Button>)}
      </div>
      {!hasValues ? <div className="min-w-[760px]"><EmptySection /></div> : (
        <div className="mt-4 h-[350px] min-w-[760px]" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 28, right: 12, left: 0, bottom: 58 }} barCategoryGap="24%">
              <defs>
                <linearGradient id="tiktokBar" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="var(--report-tiktok-cyan)" /><stop offset="100%" stopColor="var(--report-tiktok-red)" /></linearGradient>
                <linearGradient id="instagramBar" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="var(--report-instagram-blue)" /><stop offset="52%" stopColor="var(--report-instagram-purple)" /><stop offset="100%" stopColor="var(--report-instagram-pink)" /></linearGradient>
                <linearGradient id="googleBar" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="var(--report-google)" /><stop offset="82%" stopColor="var(--report-google)" /><stop offset="100%" stopColor="var(--report-google-accent)" /></linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="key" interval={0} tickLine={false} axisLine={{ stroke: "var(--border)" }} tick={<ChartTick rows={data} />} />
              <YAxis
                allowDecimals={metric === "conversion"}
                domain={[0, "auto"]}
                width={metric === "rewards" ? 58 : 42}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => (metric === "conversion" ? `${value}%` : nf(value))}
              />
              <Tooltip cursor={{ fill: "var(--brand-soft)", opacity: 0.4 }} content={<ChartTooltip metric={metric} />} />
              <Bar dataKey={metric} radius={[7, 7, 0, 0]} animationDuration={700} minPointSize={2}>
                {data.map((entry) => <Cell key={entry.key} fill={PLATFORM_BAR_FILL[entry.key]} />)}
                <LabelList dataKey={metric} position="top" formatter={(value: number) => metricValueText(metric, value)} fill="var(--navy)" fontSize={11} fontWeight={800} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}

function ReportState({ status, onRetry }: { status: Exclude<ReportStatus, "ready">; onRetry: () => void }) {
  const loading = status === "loading";
  const Icon = loading ? LoaderCircle : AlertCircle;
  return (
    <div className="grid min-h-72 place-items-center rounded-2xl border border-border bg-card p-8 text-center">
      <div>
        <Icon size={34} className={`mx-auto ${loading ? "animate-spin text-brand" : "text-destructive"}`} />
        <h2 className="mt-3 font-black text-navy">{loading ? "جارٍ تحميل التقرير" : "تعذر تحميل التقرير"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{loading ? "يرجى الانتظار قليلًا." : "حدث خطأ أثناء جلب البيانات، يمكنك إعادة المحاولة."}</p>
        {!loading ? <Button type="button" onClick={onRetry} className="mt-4 h-11 rounded-xl bg-brand px-5 font-bold text-primary-foreground shadow-none hover:bg-navy"><RotateCcw size={16} />إعادة المحاولة</Button> : null}
      </div>
    </div>
  );
}

function PerformanceReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("all");
  const [platform, setPlatform] = useState<SourceKey | "all">("all");
  const [program, setProgram] = useState<string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [metric, setMetric] = useState<ReportMetric>("interests");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [status, setStatus] = useState<ReportStatus>("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const customPeriod = period === "custom";
  const invalidRange = customPeriod && fromDate !== "" && toDate !== "" && toDate < fromDate;
  const customReady = customPeriod && fromDate !== "" && toDate !== "" && !invalidRange;

  /** الفلاتر الفعلية المطبّقة: لا تُحدَّث الفترة المخصصة حتى اكتمال تاريخين صحيحين */
  const appliedPeriod: ReportPeriod = customPeriod && !customReady ? "all" : period;
  const filterKey = `${appliedPeriod}|${platform}|${program}|${customReady ? fromDate : ""}|${customReady ? toDate : ""}|${reloadKey}`;

  useEffect(() => {
    setStatus("loading");
    const timer = setTimeout(() => setStatus("ready"), 320);
    return () => clearTimeout(timer);
  }, [filterKey]);

  const report = useMemo(
    () => buildReport({ period: appliedPeriod, platform, program, from: fromDate, to: toDate }),
    [appliedPeriod, platform, program, fromDate, toDate],
  );

  /** حدود الفترة المعروضة في حقلي التاريخ */
  const bounds = useMemo(() => {
    if (period === "all" || period === "custom") return null;
    const range = periodRange(period);
    return range.start === null || range.end === null ? null : { from: toInputDate(range.start), to: toInputDate(range.end) };
  }, [period]);

  const fromValue = customPeriod ? fromDate : (bounds?.from ?? "");
  const toValue = customPeriod ? toDate : (bounds?.to ?? "");

  const hasFilters = period !== "all" || platform !== "all" || program !== "all" || fromDate !== "" || toDate !== "";

  const programRows = report.programs;
  const totalPages = Math.max(1, Math.ceil(programRows.length / perPage));
  const page = Math.min(currentPage, totalPages);
  const start = (page - 1) * perPage;
  const visiblePrograms = programRows.slice(start, start + perPage);

  const updateFilter = (apply: () => void) => {
    apply();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setPeriod("all");
    setPlatform("all");
    setProgram("all");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const totals = report.totals;
  const stats = [
    { title: "عدد النقرات", value: nf(totals.clicks), unit: "نقرة", icon: MousePointer2, tone: "bg-sky-100 text-sky-600", info: INFO_TEXT.clicks },
    { title: "تسجيلات الاهتمام", value: nf(totals.interests), unit: "تسجيل", icon: Users, tone: "bg-violet-100 text-violet-600", info: INFO_TEXT.interests },
    { title: "معدل التحويل إلى التسجيل", value: percent(totals), icon: BarChart3, tone: "bg-brand-soft text-brand", info: INFO_TEXT.conversion },
    { title: "عدد المتدربين", value: nf(totals.students), unit: "متدرب", icon: UserCheck, tone: "bg-orange-100 text-orange-600", info: INFO_TEXT.students },
    { title: "إجمالي المكافآت", value: nf(totals.rewards), unit: "ريال سعودي", icon: Wallet, tone: "bg-emerald-100 text-emerald-700", info: INFO_TEXT.rewards },
  ];

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500" dir="rtl">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"><BarChart3 size={23} /></span><div><h1 className="text-xl font-black text-navy sm:text-2xl">تقارير الأداء</h1><p className="mt-1 text-sm text-muted-foreground">تابع نتائج مشاركاتك وتعرّف على المنصات والبرامج الأفضل أداءً.</p></div></div>
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand"><Info size={14} />بيانات توضيحية</span>
      </header>

      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <SelectField
            label="الفترة"
            value={period}
            onChange={(value) => updateFilter(() => {
              setPeriod(value as ReportPeriod);
              setFromDate("");
              setToDate("");
            })}
            options={REPORT_PERIODS.map((item) => ({ value: item.value, label: item.label }))}
          />
          <SelectField label="المنصة" value={platform} onChange={(value) => updateFilter(() => setPlatform(value as SourceKey | "all"))} options={[{ value: "all", label: "جميع المنصات" }, ...PLATFORM_META.map((item) => ({ value: item.key, label: item.name }))]} />
          <SelectField label="البرنامج" value={program} onChange={(value) => updateFilter(() => setProgram(value))} options={[{ value: "all", label: "جميع البرامج" }, ...PROGRAM_META.map((item) => ({ value: item.id, label: item.name }))]} />
          <Button type="button" variant="outline" disabled={!hasFilters} onClick={clearFilters} className="h-12 rounded-xl px-5 font-bold text-brand shadow-none enabled:border-brand enabled:hover:bg-brand-soft"><RotateCcw size={16} />مسح الفلاتر</Button>
        </div>
        <div className="mt-3 grid items-center gap-3 lg:grid-cols-[1fr_1fr_1.25fr_auto]">
          <DateField label="من تاريخ" value={fromValue} onChange={(value) => updateFilter(() => setFromDate(value))} disabled={!customPeriod} />
          <DateField label="إلى تاريخ" value={toValue} onChange={(value) => updateFilter(() => setToDate(value))} disabled={!customPeriod} />
          <p className={`text-xs font-bold ${invalidRange ? "text-destructive" : "text-brand"}`}>
            {invalidRange ? "يجب أن يكون تاريخ النهاية مساويًا لتاريخ البداية أو بعده." : "تتفعّل التواريخ عند اختيار فترة مخصصة"}
          </p>
          <Button type="button" className="h-12 rounded-xl bg-brand px-5 font-bold text-primary-foreground shadow-none hover:bg-navy"><Download size={17} />تحميل التقرير PDF</Button>
        </div>
      </div>

      {status !== "ready" ? <ReportState status={status} onRetry={() => setReloadKey((value) => value + 1)} /> : <>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{stats.map((item) => <MetricCard key={item.title} {...item} />)}</div>
        <section className="rounded-2xl border border-border bg-card p-3 sm:p-5">
          <SectionTitle title="أداء المنصات" info={INFO_TEXT.platforms} />
          <div className="mt-4">{report.hasData ? <ReportTable type="platforms" rows={report.platforms} total={totals} /> : <EmptySection />}</div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-3 sm:p-5">
          <SectionTitle title="الأداء حسب المنصة" info={INFO_TEXT.chart} />
          <div className="overflow-x-auto"><PerformanceChart metric={metric} onMetricChange={setMetric} rows={report.platforms} /></div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-3 sm:p-5">
          <SectionTitle title="أداء البرامج التدريبية" info={INFO_TEXT.programs} />
          {!report.hasData ? <EmptySection /> : <>
            <div className="mt-4"><ReportTable type="programs" rows={visiblePrograms} /></div>
            <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-border pt-4 lg:flex-row">
              <p className="text-xs text-muted-foreground sm:text-sm">عرض {programRows.length === 0 ? 0 : start + 1} إلى {Math.min(start + perPage, programRows.length)} من إجمالي {programRows.length} برامج</p>
              <div className="flex items-center gap-2">{Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => <Button key={item} type="button" variant={item === page ? "default" : "outline"} aria-current={item === page ? "page" : undefined} aria-label={`الصفحة ${item}`} disabled={totalPages === 1} onClick={() => setCurrentPage(item)} className={`size-9 rounded-full p-0 font-bold shadow-none ${item === page ? "bg-brand text-primary-foreground hover:bg-brand" : "text-navy hover:bg-brand-soft"}`}>{item}</Button>)}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm"><span>عرض</span><div className="relative"><select aria-label="عدد البرامج في كل صفحة" value={perPage} onChange={(event) => { setPerPage(Number(event.target.value)); setCurrentPage(1); }} className="h-9 appearance-none rounded-xl border border-border bg-card pr-3 pl-7 font-bold text-navy outline-none focus:border-brand">{[5, 10, 15].map((count) => <option key={count} value={count}>{count}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2" /></div><span>من كل صفحة</span></div>
            </div>
          </>}
        </section>
      </>}
    </section>
  );
}
