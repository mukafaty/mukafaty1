import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Info,
  Link2,
  MousePointer2,
  User,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CountUp } from "@/components/dashboard/CountUp";
import shareAsset from "@/assets/muk-card-dashboard.jpg.asset.json";
import {
  AVAILABLE_BALANCE,
  CLICK_RECORDS,
  PERIOD_OPTIONS,
  REFERRAL_RECORDS,
  formatArabicDate,
  formatChartLabel,
  periodStart,
  type PeriodId,
} from "@/data/dashboardActivity";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "لوحة تحكم المسوق | مكافآتي" },
      {
        name: "description",
        content: "تابع أداءك ومكافآتك وإحالاتك ورصيدك المالي في لوحة تحكم مكافآتي للمسوقين.",
      },
      { property: "og:title", content: "لوحة تحكم المسوق | مكافآتي" },
      {
        property: "og:description",
        content: "تابع أداءك ومكافآتك وإحالاتك ورصيدك المالي في لوحة تحكم مكافآتي للمسوقين.",
      },
    ],
  }),
  component: DashboardHome,
});

const STATUS_TONES: Record<string, string> = {
  "تم الدفع": "bg-emerald-100 text-emerald-700",
  مهتم: "bg-amber-100 text-amber-700",
  جديد: "bg-sky-100 text-sky-700",
};

const EMPTY_MESSAGE = "لا توجد بيانات خلال الفترة المحددة";

type StatProps = {
  title: string;
  value: number;
  unit: string;
  decimals?: number;
  icon: typeof Users;
  iconClass: string;
  delay: number;
};

function StatCard({ title, value, unit, decimals, icon: Icon, iconClass, delay }: StatProps) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-3 rounded-3xl border border-border bg-card p-5 duration-500 fill-mode-backwards"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[15px] font-bold text-navy">{title}</span>
        <Info size={16} className="mt-1 shrink-0 text-muted-foreground/60" />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-2">
          <CountUp
            key={`${title}-${value}`}
            value={value}
            decimals={decimals}
            className="text-3xl font-black tracking-tight text-navy sm:text-[34px]"
          />
          <span className="truncate text-sm text-muted-foreground">{unit}</span>
        </div>
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${iconClass}`}>
          <Icon size={22} />
        </span>
      </div>
    </div>
  );
}


function DashboardHome() {
  const [period, setPeriod] = useState<PeriodId>("all");

  const stats = useMemo(() => {
    const now = new Date();
    const nowTs = now.getTime();
    const start = periodStart(period, now);
    const from = start ?? -Infinity;

    const referrals = REFERRAL_RECORDS.filter((r) => {
      const t = +new Date(r.date);
      return t <= nowTs && t >= from;
    });
    const clicks = CLICK_RECORDS.filter((c) => {
      const t = +new Date(c.date);
      return t <= nowTs && t >= from;
    }).reduce((sum, c) => sum + c.count, 0);

    const interested = referrals.filter((r) => r.status === "مهتم").length;
    const rewards = referrals.reduce((sum, r) => sum + r.reward, 0);

    // الرسم البياني: توزيع الإحالات على فترات متساوية
    const spanStart =
      start ??
      (referrals.length
        ? Math.min(...referrals.map((r) => +new Date(r.date)))
        : nowTs - 24 * 60 * 60 * 1000);
    const span = Math.max(nowTs - spanStart, 60 * 60 * 1000);
    const buckets = Math.min(10, Math.max(1, Math.round(span / (24 * 60 * 60 * 1000)))) || 1;
    const size = span / buckets;
    const granularity: "day" | "month" = span > 120 * 24 * 60 * 60 * 1000 ? "month" : "day";

    const chart = Array.from({ length: buckets }, (_, i) => {
      const bucketStart = spanStart + i * size;
      const bucketEnd = bucketStart + size;
      const v = referrals.filter((r) => {
        const t = +new Date(r.date);
        return t >= bucketStart && (i === buckets - 1 ? t <= nowTs : t < bucketEnd);
      }).length;
      return { d: formatChartLabel(bucketStart, granularity), v };
    });

    return {
      referrals,
      latest: referrals.slice(0, 3),
      clients: referrals.length,
      interested,
      clicks,
      rewards,
      chart,
    };
  }, [period]);

  const hasReferrals = stats.referrals.length > 0;

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0 animate-in fade-in slide-in-from-bottom-2 text-right duration-500 sm:order-1">
          <h1 className="text-xl font-black text-navy sm:text-2xl">مرحباً، أحمد السبيعي 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            تابع أداءك ومكافآتك في كل ما يخص نشاطك التسويقي من مكان واحد.
          </p>
        </div>

        <div className="relative sm:order-2">
          <Calendar
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand"
          />
          <select
            aria-label="فلتر الفترة"
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodId)}
            className="h-[50px] w-full appearance-none rounded-2xl border border-border bg-card pr-11 pl-10 text-right text-sm font-bold text-navy outline-none transition-colors hover:border-brand focus:border-brand"
          >
            {PERIOD_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="إجمالي العملاء"
          value={stats.clients}
          unit="عميل"
          icon={User}
          iconClass="bg-sky-100 text-sky-600"
          delay={0}
        />
        <StatCard
          title="المهتمون"
          value={stats.interested}
          unit="مهتم"
          icon={Users}
          iconClass="bg-violet-100 text-violet-600"
          delay={80}
        />
        <StatCard
          title="عدد النقرات"
          value={stats.clicks}
          unit="نقرة"
          icon={MousePointer2}
          iconClass="bg-brand-soft text-brand"
          delay={160}
        />
        <StatCard
          title="الرصيد المتاح"
          value={AVAILABLE_BALANCE}
          unit="ريال سعودي"
          icon={Wallet}
          iconClass="bg-orange-100 text-orange-500"
          delay={240}
        />
        <StatCard
          title="إجمالي المكافآت"
          value={stats.rewards}
          decimals={2}
          unit="ريال سعودي"
          icon={UserRound}
          iconClass="bg-emerald-100 text-emerald-600"
          delay={320}
        />
      </section>

      <section
        className="animate-in fade-in slide-in-from-bottom-3 rounded-3xl border border-border bg-card p-5 duration-700 fill-mode-backwards"
        style={{ animationDelay: "380ms" }}
      >
        <h2 className="text-lg font-black text-navy">آخر الإحالات</h2>
        {hasReferrals ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-right">
              <thead>
                <tr className="text-xs font-bold text-muted-foreground">
                  <th className="pb-2 pr-2 font-bold">الاسم</th>
                  <th className="pb-2 font-bold">البرنامج التدريبي</th>
                  <th className="pb-2 font-bold">تاريخ الإحالة</th>
                  <th className="pb-2 font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {stats.latest.map((r) => (
                  <tr key={r.id} className="border-t border-border/70 text-sm text-navy">
                    <td className="py-2 pr-2">
                      <span className="flex items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                          <User size={16} />
                        </span>
                        <span className="font-bold">{r.name}</span>
                      </span>
                    </td>
                    <td className="py-2 text-muted-foreground">{r.program}</td>
                    <td className="py-2 text-muted-foreground">{formatArabicDate(r.date)}</td>
                    <td className="py-2">
                      <span
                        className={`inline-flex rounded-lg px-3 py-1 text-xs font-bold ${STATUS_TONES[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-6 py-8 text-center text-sm font-bold text-muted-foreground">
            {EMPTY_MESSAGE}
          </p>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div
          className="animate-in fade-in slide-in-from-bottom-3 order-2 rounded-3xl border border-border bg-card p-5 duration-700 fill-mode-backwards lg:order-1"
          style={{ animationDelay: "460ms" }}
        >
          <h2 className="text-lg font-black text-navy">أداء الإحالات</h2>
          {hasReferrals ? (
            <div className="mt-4 h-[240px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chart} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="refFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="d"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="var(--brand)"
                    strokeWidth={3}
                    fill="url(#refFill)"
                    dot={{ r: 4, fill: "var(--brand)", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1400}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-4 grid h-[240px] place-items-center text-center text-sm font-bold text-muted-foreground">
              {EMPTY_MESSAGE}
            </p>
          )}
        </div>


        <div
          className="animate-in fade-in slide-in-from-bottom-3 relative order-1 overflow-hidden rounded-3xl border border-brand/20 duration-700 fill-mode-backwards lg:order-2"
          style={{
            animationDelay: "520ms",
            backgroundImage: `url(${shareAsset.url})`,
            backgroundSize: "cover",
            backgroundPosition: "left center",
          }}
        >
          <div className="flex h-full flex-col justify-center gap-3 p-6 pl-[46%] text-right">
            <h2 className="text-lg font-black leading-8 text-navy sm:text-xl">
              شارك رابطك واربح المزيد من المكافآت
            </h2>
            <p className="text-sm leading-7 text-navy/70">
              شارك رابط الإحالة الخاص بك مع زملائك وجمهورك واحصل على مكافآت مميزة.
            </p>
            <button className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-primary-foreground transition-colors duration-200 hover:bg-navy">
              <Link2 size={17} />
              شارك الآن
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
