import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  CalendarDays,
  ChevronDown,
  Coins,
  Gift,
  Info,
  Medal,
  RotateCcw,
  Trophy,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOP_REWARDS, TOP_REWARDS_NOTE, type TopReward } from "@/data/topRewards";

export const Route = createFileRoute("/dashboard/top")({
  head: () => ({
    meta: [
      { title: "المتميزون | لوحة تحكم مكافآتي" },
      { name: "description", content: "لوحة شرف أفضل المسوقين في مكافآتي." },
      { property: "og:title", content: "المتميزون | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "لوحة شرف أفضل المسوقين في مكافآتي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TopPage,
});

type PeriodKey = "all" | "month" | "quarter" | "year";

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "all", label: "جميع الفترات" },
  { key: "month", label: "هذا الشهر" },
  { key: "quarter", label: "آخر ثلاثة أشهر" },
  { key: "year", label: "هذا العام" },
];

type TopMarketer = {
  rank: number;
  memberId: string;
  type: "رجل" | "سيدة";
  city: string;
  totalCustomers: number;
  totalRewards: number;
  period: Exclude<PeriodKey, "all">;
};

const TOP_MARKETERS: TopMarketer[] = [
  { rank: 1, memberId: "MK-1025", type: "رجل", city: "الرياض", totalCustomers: 24, totalRewards: 9750, period: "month" },
  { rank: 2, memberId: "MK-1187", type: "سيدة", city: "جدة", totalCustomers: 21, totalRewards: 8500, period: "month" },
  { rank: 3, memberId: "MK-1042", type: "رجل", city: "مكة المكرمة", totalCustomers: 18, totalRewards: 7250, period: "month" },
  { rank: 4, memberId: "MK-1263", type: "رجل", city: "ينبع", totalCustomers: 16, totalRewards: 6800, period: "quarter" },
  { rank: 5, memberId: "MK-1098", type: "سيدة", city: "الرياض", totalCustomers: 14, totalRewards: 5950, period: "quarter" },
  { rank: 6, memberId: "MK-1176", type: "رجل", city: "الدمام", totalCustomers: 13, totalRewards: 4950, period: "quarter" },
  { rank: 7, memberId: "MK-1109", type: "سيدة", city: "الخبر", totalCustomers: 12, totalRewards: 4250, period: "year" },
  { rank: 8, memberId: "MK-1033", type: "رجل", city: "أبها", totalCustomers: 11, totalRewards: 4100, period: "year" },
  { rank: 9, memberId: "MK-1120", type: "سيدة", city: "تبوك", totalCustomers: 10, totalRewards: 3800, period: "year" },
  { rank: 10, memberId: "MK-1050", type: "رجل", city: "حائل", totalCustomers: 9, totalRewards: 3600, period: "year" },
];

const MY_STANDING = {
  rank: 7,
  totalCustomers: 12,
  totalRewards: 4250,
  customersToNextRank: 3,
  nextRankLabel: "المركز السادس",
};

const nf = (n: number) => n.toLocaleString("en-US");

function RankBadge({ rank }: { rank: number }) {
  const tone =
    rank === 1
      ? "bg-amber-100 text-amber-600"
      : rank === 2
        ? "bg-slate-100 text-slate-500"
        : "bg-orange-100 text-orange-600";
  if (rank > 3) return <span className="text-sm font-bold text-navy">{rank}</span>;
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${tone}`}>
        <Medal size={14} />
      </span>
      <span className="text-sm font-bold text-navy">{rank}</span>
    </span>
  );
}

function PrizeCard({ reward }: { reward: TopReward }) {
  return (
    <img
      src={reward.imageUrl}
      alt={reward.imageAlt}
      className="block h-auto w-full"
    />
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative min-w-0">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-border bg-card pr-4 pl-9 text-sm font-bold text-navy outline-none transition-colors focus:border-brand"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function TopPage() {
  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");
  const [period, setPeriod] = useState<PeriodKey>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const periodLabel = PERIODS.find((p) => p.key === period)?.label ?? "جميع الفترات";
  const rows = useMemo(
    () => TOP_MARKETERS
      .filter((marketer) => city === "all" || marketer.city === city)
      .filter((marketer) => type === "all" || marketer.type === type)
      .filter((marketer) => period === "all" || marketer.period === period)
      .sort((a, b) => b.totalRewards - a.totalRewards),
    [city, period, type],
  );
  const cities = useMemo(() => Array.from(new Set(TOP_MARKETERS.map((marketer) => marketer.city))), []);
  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const start = (currentPage - 1) * perPage;
  const visibleRows = rows.slice(start, start + perPage);
  const hasActiveFilters = city !== "all" || type !== "all" || period !== "all";

  const updateFilter = (update: () => void) => {
    update();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setCity("all");
    setType("all");
    setPeriod("all");
    setCurrentPage(1);
  };

  const stats = [
    { title: "الفترة الحالية", value: periodLabel, unit: "", icon: CalendarDays, tone: "bg-brand-soft text-brand" },
    { title: "أعلى مكافأة", value: nf(rows[0]?.totalRewards ?? 0), unit: "ريال", icon: Coins, tone: "bg-amber-50 text-amber-600" },
    { title: "أكثر العملاء تسجيلًا", value: nf(Math.max(0, ...rows.map((r) => r.totalCustomers))), unit: "عميل", icon: Users, tone: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
          <Trophy size={22} />
        </span>
        <div className="min-w-0 text-right">
          <h1 className="text-xl font-black text-navy sm:text-2xl">المتميزون</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            تعرّف على أفضل المسوقين والأكثر تحقيقًا للمكافآت في برنامج مكافآتي.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.title}
            className="animate-in fade-in slide-in-from-bottom-3 flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-5 duration-500 fill-mode-backwards"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="block text-[15px] font-bold text-navy">{s.title}</span>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-baseline gap-2">
                <span className="truncate text-2xl font-black tracking-tight text-navy sm:text-3xl">
                  {s.value}
                </span>
                {s.unit ? <span className="text-sm text-muted-foreground">{s.unit}</span> : null}
              </div>
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${s.tone}`}>
                <s.icon size={22} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Rewards */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
            <Gift size={22} />
          </span>
          <h2 className="text-xl font-black text-navy sm:text-2xl">الجوائز</h2>
        </div>

        <div className="grid items-start gap-3 md:grid-cols-3" dir="rtl">
          {TOP_REWARDS.map((reward) => <PrizeCard key={reward.rank} reward={reward} />)}
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand-soft px-4 py-3 text-brand">
          <Info size={20} className="shrink-0" />
          <p className="text-sm font-bold text-navy">{TOP_REWARDS_NOTE}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-3 rounded-2xl border border-border bg-card p-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <FilterSelect
          label="المدينة"
          value={city}
          options={[{ value: "all", label: "جميع المدن" }, ...cities.map((item) => ({ value: item, label: item }))]}
          onChange={(value) => updateFilter(() => setCity(value))}
        />
        <FilterSelect
          label="النوع"
          value={type}
          options={[{ value: "all", label: "الجميع" }, { value: "رجل", label: "رجل" }, { value: "سيدة", label: "سيدة" }]}
          onChange={(value) => updateFilter(() => setType(value))}
        />
        <FilterSelect
          label="الفترة"
          value={period}
          options={PERIODS.map((item) => ({ value: item.key, label: item.label }))}
          onChange={(value) => updateFilter(() => setPeriod(value as PeriodKey))}
        />
        <Button
          type="button"
          variant="outline"
          disabled={!hasActiveFilters}
          onClick={clearFilters}
          className="h-11 rounded-xl px-5 font-bold text-brand shadow-none enabled:border-brand enabled:hover:bg-brand-soft disabled:border-border disabled:bg-muted disabled:text-muted-foreground"
        >
          <RotateCcw size={16} />
          مسح الفلاتر
        </Button>
      </div>

      {/* Table (desktop) */}
      <div className="hidden rounded-3xl border border-border bg-card p-4 sm:block sm:p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-right">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3.5 text-sm font-bold text-navy">الترتيب</th>
                <th className="px-4 py-3.5 text-sm font-bold text-navy">رقم العضوية</th>
                <th className="px-4 py-3.5 text-sm font-bold text-navy">النوع</th>
                <th className="px-4 py-3.5 text-sm font-bold text-navy">المدينة</th>
                <th className="px-4 py-3.5 text-sm font-bold text-navy">إجمالي العملاء</th>
                <th className="px-4 py-3.5 text-sm font-bold text-navy">إجمالي المكافآت</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, i) => (
                <tr key={row.memberId} className={i % 2 === 1 ? "bg-brand-soft/50" : "bg-card"}>
                  <td className="px-4 py-3">
                    <RankBadge rank={row.rank} />
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-navy">{row.memberId}</td>
                  <td className="px-4 py-3 text-sm text-navy">{row.type}</td>
                  <td className="px-4 py-3 text-sm text-navy">{row.city}</td>
                  <td className="px-4 py-3 text-sm font-bold text-navy">{row.totalCustomers}</td>
                  <td className="px-4 py-3 text-sm font-bold text-emerald-600">
                    {nf(row.totalRewards)} ريال
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm font-bold text-navy">
                    لا توجد نتائج مطابقة للفلاتر
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards (mobile) */}
      <div className="space-y-3 sm:hidden">
        {visibleRows.map((row) => (
          <div key={row.memberId} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <RankBadge rank={row.rank} />
              <span className="text-sm font-bold text-navy">{row.memberId}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-right">
              <div>
                <p className="text-xs text-muted-foreground">النوع</p>
                <p className="text-sm font-bold text-navy">{row.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">المدينة</p>
                <p className="text-sm font-bold text-navy">{row.city}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">إجمالي العملاء</p>
                <p className="text-sm font-bold text-navy">{row.totalCustomers}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">إجمالي المكافآت</p>
                <p className="text-sm font-bold text-emerald-600">{nf(row.totalRewards)} ريال</p>
              </div>
            </div>
          </div>
        ))}
        {visibleRows.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-10 text-center text-sm font-bold text-navy">
            لا توجد نتائج مطابقة للفلاتر
          </div>
        ) : null}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 lg:flex-row">
        <p className="text-center text-xs text-muted-foreground sm:text-sm lg:text-right">
          عرض {rows.length === 0 ? 0 : start + 1} إلى {Math.min(start + perPage, rows.length)} من إجمالي {rows.length} مسوق
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2" dir="rtl">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1 || rows.length === 0}
            className="h-9 rounded-xl px-3 font-bold text-navy shadow-none hover:bg-brand-soft"
          >
            السابق
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button
              type="button"
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              disabled={rows.length === 0}
              aria-label={`الصفحة ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={`h-9 w-9 rounded-full p-0 font-bold shadow-none ${page === currentPage ? "bg-brand text-primary-foreground hover:bg-brand" : "text-navy hover:bg-brand-soft"}`}
            >
              {page}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages || rows.length === 0}
            className="h-9 rounded-xl px-3 font-bold text-navy shadow-none hover:bg-brand-soft"
          >
            التالي
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <span>عرض</span>
          <div className="relative">
            <select
              aria-label="عدد المسوقين في كل صفحة"
              value={perPage}
              onChange={(event) => {
                setPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="h-9 appearance-none rounded-xl border border-border bg-card pr-3 pl-7 text-sm font-bold text-navy outline-none focus:border-brand"
            >
              {[5, 10, 15].map((count) => <option key={count} value={count}>{count}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          <span>من كل صفحة</span>
        </div>
      </div>

      {/* My standing */}
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 text-right">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
              <Award size={22} />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-black text-navy">ترتيبك الحالي</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                استمر ونافس للوصول إلى المراكز الأولى.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            <div className="text-center">
              <p className="text-2xl font-black text-navy">{MY_STANDING.rank}</p>
              <p className="mt-1 text-xs text-muted-foreground">المركز</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-brand">{MY_STANDING.totalCustomers}</p>
              <p className="mt-1 text-xs text-muted-foreground">عميلًا مسجلًا</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-brand">{nf(MY_STANDING.totalRewards)}</p>
              <p className="mt-1 text-xs text-muted-foreground">ريال إجمالي المكافآت</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-center">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                <TrendingUp size={18} />
              </span>
              <div>
                <p className="text-2xl font-black text-navy">{MY_STANDING.customersToNextRank}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  عملاء للوصول إلى {MY_STANDING.nextRankLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
