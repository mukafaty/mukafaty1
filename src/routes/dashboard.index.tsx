import { createFileRoute } from "@tanstack/react-router";
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

const chartData = [
  { d: "22 أبريل", v: 38 },
  { d: "26 أبريل", v: 57 },
  { d: "30 أبريل", v: 30 },
  { d: "4 مايو", v: 61 },
  { d: "8 مايو", v: 18 },
  { d: "12 مايو", v: 58 },
  { d: "16 مايو", v: 40 },
  { d: "20 مايو", v: 80 },
  { d: "21 مايو", v: 26 },
  { d: "24 مايو", v: 68 },
];

const referrals = [
  {
    name: "محمد الحربي",
    program: "دبلوم إدارة الأعمال",
    date: "21 مايو 2026",
    status: "تم الدفع",
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "سارة الشهري",
    program: "دبلوم الموارد البشرية",
    date: "20 مايو 2026",
    status: "مهتم",
    tone: "bg-amber-100 text-amber-700",
  },
  {
    name: "عبد الله المالكي",
    program: "دبلوم الأمن السيبراني",
    date: "19 مايو 2026",
    status: "جديد",
    tone: "bg-sky-100 text-sky-700",
  },
];

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
  return (
    <div className="space-y-5">
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0 animate-in fade-in slide-in-from-bottom-2 text-right duration-500 sm:order-1">
          <h1 className="text-xl font-black text-navy sm:text-2xl">مرحباً، أحمد السبيعي 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            تابع أداءك ومكافآتك في كل ما يخص نشاطك التسويقي من مكان واحد.
          </p>
        </div>

        <button className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-bold text-navy transition-colors hover:border-brand sm:order-2">
          <Calendar size={18} className="text-brand" />
          <span>آخر 30 يومًا</span>
          <ChevronDown size={16} className="text-muted-foreground" />
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="إجمالي العملاء"
          value={162}
          unit="عميل"
          icon={User}
          iconClass="bg-sky-100 text-sky-600"
          delay={0}
        />
        <StatCard
          title="المهتمون"
          value={120}
          unit="مهتم"
          icon={Users}
          iconClass="bg-violet-100 text-violet-600"
          delay={80}
        />
        <StatCard
          title="عدد النقرات"
          value={248}
          unit="نقرة"
          icon={MousePointer2}
          iconClass="bg-brand-soft text-brand"
          delay={160}
        />
        <StatCard
          title="الرصيد المتاح"
          value={2500}
          unit="ريال سعودي"
          icon={Wallet}
          iconClass="bg-orange-100 text-orange-500"
          delay={240}
        />
        <StatCard
          title="إجمالي المكافآت"
          value={18950.5}
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
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-right">
            <thead>
              <tr className="text-xs font-bold text-muted-foreground">
                <th className="pb-3 pr-2 font-bold">الاسم</th>
                <th className="pb-3 font-bold">البرنامج التدريبي</th>
                <th className="pb-3 font-bold">تاريخ الإحالة</th>
                <th className="pb-3 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r.name} className="border-t border-border/70 text-sm text-navy">
                  <td className="py-4 pr-2">
                    <span className="flex items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                        <User size={16} />
                      </span>
                      <span className="font-bold">{r.name}</span>
                    </span>
                  </td>
                  <td className="py-4 text-muted-foreground">{r.program}</td>
                  <td className="py-4 text-muted-foreground">{r.date}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex rounded-lg px-3 py-1 text-xs font-bold ${r.tone}`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div
          className="animate-in fade-in slide-in-from-bottom-3 order-2 rounded-3xl border border-border bg-card p-5 duration-700 fill-mode-backwards lg:order-1"
          style={{ animationDelay: "460ms" }}
        >
          <h2 className="text-lg font-black text-navy">أداء الإحالات</h2>
          <div className="mt-4 h-[240px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
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
                  domain={[0, 100]}
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
        </div>

        <div
          className="animate-in fade-in slide-in-from-bottom-3 order-1 flex flex-col justify-center gap-4 rounded-3xl border border-brand/20 bg-brand-soft p-6 duration-700 fill-mode-backwards lg:order-2"
          style={{ animationDelay: "520ms" }}
        >
          <h2 className="text-xl font-black leading-9 text-navy sm:text-2xl">
            شارك رابطك واربح المزيد من المكافآت
          </h2>
          <p className="text-sm leading-8 text-navy/70">
            شارك رابط الإحالة الخاص بك مع زملائك وجمهورك واحصل على مكافآت مميزة.
          </p>
          <button className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-brand px-8 text-base font-bold text-primary-foreground transition-all duration-200 hover:bg-navy">
            <Link2 size={20} />
            شارك الآن
          </button>
        </div>
      </section>
    </div>
  );
}
