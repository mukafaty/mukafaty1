import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  RotateCcw,
  Search,
  Users,
  Wallet,
} from "lucide-react";
import { CountUp } from "@/components/dashboard/CountUp";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const Route = createFileRoute("/dashboard/balance")({
  head: () => ({
    meta: [
      { title: "رصيدي المالي | لوحة تحكم مكافآتي" },
      { name: "description", content: "تابع مكافآتك المالية الناتجة عن تسجيل عملائك." },
      { property: "og:title", content: "رصيدي المالي | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "تابع مكافآتك المالية الناتجة عن تسجيل عملائك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BalancePage,
});

type WithdrawalStatus = "withdrawn" | "not-withdrawn" | "pending";

type PaymentRow = {
  /** معرّف الدفعة داخل التسجيل */
  id: string;
  /** رقم السند */
  receipt: string;
  /** تاريخ السداد بصيغة ISO */
  paidAt: string;
  amount: number;
  reward: number;
  status?: WithdrawalStatus;
};

type BalanceRow = {
  /** معرّف التسجيل (السجل المالي) */
  id: number;
  name: string;
  program: string;
  branch: string;
  fee?: number;
  reward: number;
  payments: PaymentRow[];
};

const STATUS_BADGE: Record<WithdrawalStatus, { label: string; className: string }> = {
  withdrawn: { label: "تم السحب", className: "bg-emerald-100 text-emerald-800" },
  "not-withdrawn": { label: "لم يتم السحب", className: "bg-slate-200 text-slate-700" },
  pending: { label: "قيد الاعتماد", className: "bg-amber-100 text-amber-800" },
};

/** مجموع الدفعات المحتسبة كسداد */
function sumPaid(row: BalanceRow) {
  return row.payments.reduce((total, payment) => total + payment.amount, 0);
}

function makePayments(
  prefix: string,
  entries: [receipt: string, paidAt: string, amount: number, reward: number, status: WithdrawalStatus][],
): PaymentRow[] {
  return entries.map(([receipt, paidAt, amount, reward, status]) => ({
    id: `${prefix}-${receipt}`,
    receipt,
    paidAt,
    amount,
    reward,
    status,
  }));
}

type BalanceFilters = {
  query: string;
  withdrawalStatus: string;
  city: string;
  branch: string;
  paidFrom: string;
  paidTo: string;
};

const BALANCE_ROWS: BalanceRow[] = [
  {
    id: 1,
    name: "فادي جميل المالكي",
    program: "دبلوم إدارة الموارد البشرية",
    branch: "جدة الصالحية",
    fee: 9500,
    reward: 225,
    payments: makePayments("REG-1", [
      ["REC-001", "2026-09-01", 2000, 100, "withdrawn"],
      ["REC-002", "2026-09-10", 1500, 75, "not-withdrawn"],
      ["REC-003", "2026-09-15", 1000, 50, "pending"],
    ]),
  },
  {
    id: 2,
    name: "سعود محسن الحارثي",
    program: "دبلوم إدارة الموارد البشرية",
    branch: "مكة المكرمة - الزاهر",
    fee: 9500,
    reward: 475,
    payments: makePayments("REG-2", [
      ["REC-004", "2026-08-05", 5000, 250, "withdrawn"],
      ["REC-005", "2026-08-28", 4500, 225, "not-withdrawn"],
    ]),
  },
  {
    id: 3,
    name: "خالد ناصر العتيبي",
    program: "دبلوم الذكاء الاصطناعي",
    branch: "الرياض المنار",
    fee: 9500,
    reward: 475,
    payments: makePayments("REG-3", [["REC-006", "2026-07-20", 9500, 475, "withdrawn"]]),
  },
  {
    id: 4,
    name: "طلال فهد الزهراني",
    program: "دبلوم المحاسبة المالية",
    branch: "جدة الحمراء",
    fee: 6500,
    reward: 325,
    payments: makePayments("REG-4", [
      ["REC-007", "2026-07-02", 3500, 175, "not-withdrawn"],
      ["REC-008", "2026-07-25", 3000, 150, "pending"],
    ]),
  },
  {
    id: 5,
    name: "نايف عمر الشريف",
    program: "دبلوم التسويق الرقمي",
    branch: "مكة المكرمة - الزاهر",
    fee: 8500,
    reward: 425,
    payments: makePayments("REG-5", [
      ["REC-009", "2026-06-11", 4000, 200, "withdrawn"],
      ["REC-010", "2026-06-30", 4500, 225, "withdrawn"],
    ]),
  },
  {
    id: 6,
    name: "عمر يوسف الحربي",
    program: "دبلوم تحليل البيانات",
    branch: "الرياض المنار",
    fee: 9500,
    reward: 475,
    payments: makePayments("REG-6", [["REC-011", "2026-06-03", 9500, 475, "not-withdrawn"]]),
  },
  {
    id: 7,
    name: "سلطان أحمد البقمي",
    program: "دبلوم إدارة المشاريع",
    branch: "جدة الصالحية",
    fee: 9000,
    reward: 450,
    payments: makePayments("REG-7", [
      ["REC-012", "2026-05-14", 4000, 200, "withdrawn"],
      ["REC-013", "2026-05-29", 5000, 250, "pending"],
    ]),
  },
  {
    id: 8,
    name: "عبدالعزيز فيصل السبيعي",
    program: "دبلوم إدارة الأعمال",
    branch: "الرياض المنار",
    fee: 8000,
    reward: 400,
    payments: makePayments("REG-8", [["REC-014", "2026-05-02", 8000, 400, "withdrawn"]]),
  },
  {
    id: 9,
    name: "تركي عادل الشمراني",
    program: "دبلوم الأمن السيبراني",
    branch: "جدة الصالحية",
    fee: 7500,
    reward: 375,
    payments: makePayments("REG-9", [
      ["REC-015", "2026-04-09", 2500, 125, "withdrawn"],
      ["REC-016", "2026-04-21", 5000, 250, "not-withdrawn"],
    ]),
  },
  {
    id: 10,
    name: "فيصل منصور الثبيتي",
    program: "دبلوم الذكاء الاصطناعي",
    branch: "الرياض المنار",
    fee: 9500,
    reward: 475,
    payments: makePayments("REG-10", [["REC-017", "2026-03-17", 9500, 475, "pending"]]),
  },
  {
    id: 11,
    name: "عادل حمزة الصاعدي",
    program: "دبلوم إدارة المشاريع",
    branch: "مكة المكرمة - الزاهر",
    fee: 9000,
    reward: 450,
    payments: makePayments("REG-11", [
      ["REC-018", "2026-03-04", 4500, 225, "withdrawn"],
      ["REC-019", "2026-03-22", 4500, 225, "not-withdrawn"],
    ]),
  },
  {
    id: 12,
    name: "وليد صابر الحازمي",
    program: "دبلوم تحليل البيانات",
    branch: "جدة الحمراء",
    fee: 9500,
    reward: 475,
    payments: makePayments("REG-12", [["REC-020", "2026-02-19", 9500, 475, "withdrawn"]]),
  },
];

const stats = [
  { title: "العملاء المسجلون", value: 12, unit: "عميل", icon: Users, tone: "bg-brand-soft text-brand" },
  { title: "إجمالي المكافآت", value: 2450, unit: "ريال سعودي", icon: Wallet, tone: "bg-emerald-50 text-emerald-600" },
  { title: "الرصيد المسحوب", value: 0, unit: "ريال سعودي", icon: Wallet, tone: "bg-slate-100 text-slate-600" },
  { title: "الرصيد المتاح", value: 2450, unit: "ريال سعودي", icon: Wallet, tone: "bg-sky-50 text-sky-600" },
];

const INITIAL_FILTERS: BalanceFilters = {
  query: "",
  withdrawalStatus: "all",
  city: "all",
  branch: "all",
  paidFrom: "",
  paidTo: "",
};

const WITHDRAWAL_STATUSES = [
  { value: "all", label: "جميع الحالات" },
  { value: "withdrawn", label: "تم السحب" },
  { value: "not-withdrawn", label: "لم يتم السحب" },
  { value: "pending", label: "قيد الاعتماد" },
];

const CITIES = ["جدة", "مكة المكرمة", "الرياض", "ينبع"];

/** ربط كل فرع بمدينته بمعرّف ثابت بدل مطابقة النصوص الحرة */
const BRANCH_CITY: Record<string, string> = {
  "جدة الصالحية": "جدة",
  "جدة الحمراء": "جدة",
  "مكة المكرمة - الزاهر": "مكة المكرمة",
  "الرياض المنار": "الرياض",
};

function formatMoney(value: number | undefined) {
  return typeof value === "number" ? `${value.toLocaleString("en-US")} ريال` : "—";
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label htmlFor={id} className="block text-xs font-bold text-navy">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-border bg-background pr-3 pl-8 text-right text-xs font-semibold text-navy outline-none transition-colors focus:border-brand"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    </div>
  );
}

function DateFilter({
  id,
  label,
  placeholder,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string | undefined;
  onChange: (value: string) => void;
}) {
  const selectedDate = value ? parseISO(value) : undefined;

  return (
    <div className="min-w-0 space-y-1.5">
      <label id={`${id}-label`} className="block text-xs font-bold text-navy">
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-labelledby={`${id}-label`}
            aria-invalid={Boolean(error)}
            className={`h-11 w-full justify-between rounded-xl bg-background px-3 text-xs font-semibold text-navy shadow-none hover:bg-background hover:text-navy ${
              error ? "border-red-500" : "border-border"
            }`}
          >
            <span className={value ? "text-navy" : "text-muted-foreground"}>
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : placeholder}
            </span>
            <CalendarDays size={16} className="text-brand" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
            locale={arSA}
            className="pointer-events-auto p-3"
          />
        </PopoverContent>
      </Popover>
      {error ? <p className="text-[11px] font-semibold text-red-600">{error}</p> : null}
    </div>
  );
}

function PaymentsTable({ payments, note }: { payments: PaymentRow[]; note?: string | undefined }) {
  const ordered = [...payments].sort((a, b) => a.paidAt.localeCompare(b.paidAt));

  if (ordered.length === 0) {
    return (
      <div className="space-y-2">
        {note ? <p className="text-[11px] font-semibold text-slate-600">{note}</p> : null}
        <div className="rounded-2xl border-4 border-white bg-[#FAFAFA] px-4 py-6 text-center text-sm font-semibold text-slate-600">
          لا توجد دفعات مسجلة لهذا العميل
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {note ? <p className="text-[11px] font-semibold text-slate-600">{note}</p> : null}
      <div className="overflow-hidden rounded-2xl border-4 border-white">
      <table className="w-full border-collapse text-right">
        <thead>
          <tr className="bg-[#D6D7DB] text-slate-800">
            <th className="border-b border-[#DADBDD] px-4 py-2.5 text-xs font-bold">رقم السند</th>
            <th className="border-b border-[#DADBDD] px-4 py-2.5 text-xs font-bold">تاريخ السداد</th>
            <th className="border-b border-[#DADBDD] px-4 py-2.5 text-xs font-bold">المبلغ المسدد</th>
            <th className="border-b border-[#DADBDD] px-4 py-2.5 text-xs font-bold">مكافأتك على الدفعة</th>
            <th className="border-b border-[#DADBDD] px-4 py-2.5 text-xs font-bold">حالة سحب المكافأة</th>
          </tr>
        </thead>
        <tbody>
          {ordered.map((payment) => {
            const badge = payment.status ? STATUS_BADGE[payment.status] : null;
            return (
              <tr key={payment.id} className="bg-[#FAFAFA]">
                <td className="border-b border-[#DADBDD] px-4 py-2.5 text-xs font-semibold text-slate-800">
                  <bdi>{payment.receipt}</bdi>
                </td>
                <td className="border-b border-[#DADBDD] px-4 py-2.5 text-xs font-semibold text-slate-800">
                  <bdi>{format(parseISO(payment.paidAt), "dd/MM/yyyy")}</bdi>
                </td>
                <td className="border-b border-[#DADBDD] px-4 py-2.5 text-xs font-semibold text-slate-800">
                  {formatMoney(payment.amount)}
                </td>
                <td className="border-b border-[#DADBDD] px-4 py-2.5 text-xs font-semibold text-slate-800">
                  {formatMoney(payment.reward)}
                </td>
                <td className="border-b border-[#DADBDD] px-4 py-2.5 text-xs font-semibold">
                  {badge ? (
                    <span className={`inline-flex rounded-lg px-3 py-1 text-xs font-bold ${badge.className}`}>
                      {badge.label}
                    </span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BalancePage() {
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<BalanceFilters>(INITIAL_FILTERS);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  /** تأخير قصير أثناء الكتابة في البحث */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(filters.query.trim()), 250);
    return () => clearTimeout(timer);
  }, [filters.query]);

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    setExpandedId(null);
  };

  /** أي تغيير في الفلاتر يعيد الترقيم للصفحة الأولى ويغلق التفاصيل */
  const updateFilters = (patch: Partial<BalanceFilters>) => {
    setFilters((currentFilters) => ({ ...currentFilters, ...patch }));
    setPage(1);
    setExpandedId(null);
  };

  const allBranches = useMemo(
    () => Array.from(new Set(BALANCE_ROWS.map((row) => row.branch))),
    [],
  );
  const branches = useMemo(
    () =>
      filters.city === "all"
        ? allBranches
        : allBranches.filter((branch) => BRANCH_CITY[branch] === filters.city),
    [allBranches, filters.city],
  );

  const invalidRange = Boolean(
    filters.paidFrom && filters.paidTo && filters.paidTo < filters.paidFrom,
  );
  const paidFrom = invalidRange ? "" : filters.paidFrom;
  const paidTo = invalidRange ? "" : filters.paidTo;
  const paymentFilterActive =
    filters.withdrawalStatus !== "all" || Boolean(paidFrom) || Boolean(paidTo);

  const matchPayment = (payment: PaymentRow) => {
    if (filters.withdrawalStatus !== "all" && payment.status !== filters.withdrawalStatus) {
      return false;
    }
    if (paidFrom && payment.paidAt < paidFrom) return false;
    if (paidTo && payment.paidAt > paidTo) return false;
    return true;
  };

  const rows = BALANCE_ROWS.filter((row) => {
    if (debouncedQuery && !row.name.includes(debouncedQuery)) return false;
    if (filters.city !== "all" && BRANCH_CITY[row.branch] !== filters.city) return false;
    if (filters.branch !== "all" && row.branch !== filters.branch) return false;
    if (paymentFilterActive && !row.payments.some(matchPayment)) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * perPage;
  const visible = rows.slice(start, start + perPage);

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setDebouncedQuery("");
    setPage(1);
    setExpandedId(null);
  };

  const exportPdf = () => {
    if (rows.length === 0 || isExporting) return;
    setIsExporting(true);
    try {
      const fileName = `الرصيد-المالي-${format(new Date(), "yyyy-MM-dd")}`;
      const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
<title>${fileName}</title>
<style>
body{font-family:Tajawal,system-ui,sans-serif;padding:24px;color:#06143F}
h1{font-size:20px;margin:0 0 4px}p{margin:0 0 16px;color:#64748b;font-size:12px}
table{width:100%;border-collapse:collapse;font-size:11px}
th{background:#00194F;color:#fff;padding:8px;text-align:right}
td{padding:7px 8px;border-bottom:1px solid #e5e7eb;text-align:right}
tr:nth-child(even) td{background:#f1f6ff}
</style></head><body>
<h1>رصيدي المالي</h1><p>تابع مكافآتك المالية الناتجة عن تسجيل عملائك.</p>
 <table><thead><tr><th>الرقم</th><th>اسم المتدرب</th><th>البرنامج التدريبي</th><th>الفرع</th><th>إجمالي الرسوم</th><th>المبلغ المسدد</th><th>المبلغ المتبقي</th><th>المكافأة المالية</th></tr></thead><tbody>
${rows
  .map(
    (r) =>
       `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.program}</td><td>${r.branch}</td><td>${formatMoney(r.fee)}</td><td>${formatMoney(sumPaid(r))}</td><td>${typeof r.fee === "number" ? formatMoney(r.fee - sumPaid(r)) : "—"}</td><td>${formatMoney(r.reward)}</td></tr>`,
  )
  .join("")}
</tbody></table></body></html>`;
      const w = window.open("", "_blank");
      if (!w) {
        toast.error("تعذّر فتح نافذة التصدير. فعّل النوافذ المنبثقة ثم حاول مجددًا.");
        setIsExporting(false);
        return;
      }
      w.document.write(html);
      w.document.close();
      w.focus();
      setTimeout(() => {
        w.print();
        setIsExporting(false);
      }, 400);
    } catch {
      toast.error("تعذّر تجهيز ملف التصدير. حاول مجددًا.");
      setIsExporting(false);
    }
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500">
      <header className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Wallet size={24} />
        </span>
        <div className="min-w-0 text-right">
          <h1 className="truncate text-2xl font-black text-navy sm:text-3xl">رصيدي المالي</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            تابع مكافآتك المالية الناتجة عن تسجيل عملائك.
          </p>
        </div>
      </header>

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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[minmax(120px,0.85fr)_minmax(150px,1fr)_minmax(120px,0.85fr)_minmax(150px,1fr)_minmax(130px,0.9fr)_minmax(130px,0.9fr)_auto] 2xl:items-end">
          <div className="min-w-0 space-y-1.5">
            <label htmlFor="balance-search" className="block text-xs font-bold text-navy">
              بحث عن عميل
            </label>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="balance-search"
                type="search"
                value={filters.query}
                onChange={(event) => updateFilters({ query: event.target.value })}
                placeholder="بحث عن عميل"
                className="h-11 w-full rounded-xl border border-border bg-background pr-9 pl-3 text-right text-xs font-semibold text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
              />
            </div>
          </div>

          <FilterSelect
            id="withdrawal-status"
            label="حالة سحب المكافأة"
            value={filters.withdrawalStatus}
            options={WITHDRAWAL_STATUSES}
            onChange={(withdrawalStatus) => updateFilters({ withdrawalStatus })}
          />
          <FilterSelect
            id="balance-city"
            label="المدينة"
            value={filters.city}
            options={[
              { value: "all", label: "جميع المدن" },
              ...CITIES.map((city) => ({ value: city, label: city })),
            ]}
            onChange={(city) => {
              const branchStillValid =
                filters.branch === "all" || city === "all" || BRANCH_CITY[filters.branch] === city;
              updateFilters({ city, branch: branchStillValid ? filters.branch : "all" });
            }}
          />
          <FilterSelect
            id="balance-branch"
            label="الفرع"
            value={filters.branch}
            options={[
              { value: "all", label: "جميع الفروع" },
              ...branches.map((branch) => ({ value: branch, label: branch })),
            ]}
            onChange={(branch) => updateFilters({ branch })}
          />
          <DateFilter
            id="paid-from"
            label="السداد من"
            placeholder="من تاريخ"
            value={filters.paidFrom}
            onChange={(paidFrom) => updateFilters({ paidFrom })}
          />
          <DateFilter
            id="paid-to"
            label="السداد إلى"
            placeholder="إلى تاريخ"
            value={filters.paidTo}
            error={invalidRange ? "يجب أن يكون تاريخ النهاية مساويًا لتاريخ البداية أو بعده." : undefined}
            onChange={(paidTo) => updateFilters({ paidTo })}
          />
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3 2xl:col-span-1 2xl:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="h-11 flex-1 rounded-xl border-brand bg-background px-3 text-xs font-bold text-brand shadow-none hover:border-brand hover:bg-brand-soft hover:text-brand 2xl:flex-none"
            >
              <RotateCcw size={16} />
              مسح الفلاتر
            </Button>
            <Button
              type="button"
              onClick={exportPdf}
              disabled={rows.length === 0 || isExporting}
              className="h-11 flex-1 rounded-xl bg-brand px-4 text-xs font-bold text-primary-foreground shadow-none hover:bg-navy disabled:opacity-50 2xl:flex-none"
            >
              <Download size={16} />
              {isExporting ? "جارٍ التجهيز" : "تصدير"}
            </Button>
          </div>
        </div>

        <div className="mt-5 max-w-full overflow-x-auto">
          <table className="w-full min-w-[1180px] border-collapse overflow-hidden rounded-2xl text-right">
            <thead>
              <tr className="bg-navy-deep text-primary-foreground">
                <th className="px-4 py-3.5 text-sm font-bold">الرقم</th>
                <th className="px-4 py-3.5 text-sm font-bold">اسم المتدرب</th>
                <th className="px-4 py-3.5 text-sm font-bold">البرنامج التدريبي</th>
                <th className="px-4 py-3.5 text-sm font-bold">الفرع</th>
                <th className="px-4 py-3.5 text-sm font-bold">إجمالي الرسوم</th>
                <th className="px-4 py-3.5 text-sm font-bold">المبلغ المسدد</th>
                <th className="px-4 py-3.5 text-sm font-bold">المبلغ المتبقي</th>
                <th className="px-4 py-3.5 text-sm font-bold">المكافأة المالية</th>
                <th className="px-4 py-3.5 text-sm font-bold">تفاصيل الدفعات</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => {
                const paid = sumPaid(row);
                const isOpen = expandedId === row.id;
                const panelId = `payments-${row.id}`;
                return (
                  <Fragment key={row.id}>
                    <tr
                      className={
                        isOpen
                          ? "bg-[#D8DCE2]"
                          : i % 2 === 1
                            ? "bg-brand-soft/70"
                            : "bg-card"
                      }
                    >
                      <td className="px-4 py-3 text-sm font-bold text-navy">{row.id}</td>
                      <td className="px-4 py-3 text-sm font-bold text-navy">{row.name}</td>
                      <td className="px-4 py-3 text-sm text-navy">{row.program}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{row.branch}</td>
                      <td className="px-4 py-3 text-sm font-bold text-navy">
                        {formatMoney(row.fee)}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-navy">
                        {formatMoney(paid)}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-navy">
                        {typeof row.fee === "number" ? formatMoney(row.fee - paid) : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-navy">
                        {formatMoney(row.reward)}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-brand">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isOpen ? null : row.id)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg outline-none transition-colors hover:text-navy focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                        >
                          <FileText size={16} />
                          التفاصيل
                          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>
                    {isOpen ? (
                      <tr className="bg-[#D8DCE2]">
                        <td id={panelId} colSpan={9} className="px-4 pb-4 pt-0">
                          <PaymentsTable payments={row.payments} />
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
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
              onClick={() => goToPage(Math.max(1, current - 1))}
              disabled={current === 1}
              className="h-9 rounded-xl border border-border px-3 text-sm font-bold text-navy transition-colors hover:bg-brand-soft disabled:opacity-40"
            >
              السابق
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
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
              onClick={() => goToPage(Math.min(totalPages, current + 1))}
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
                  goToPage(1);
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
