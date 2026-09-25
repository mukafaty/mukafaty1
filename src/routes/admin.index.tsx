import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Home, Users, GraduationCap, UsersRound, MousePointerClick, ArrowUp, AlarmClock, Wallet,
  Coins, UserPlus, ArrowLeft, ClipboardList, MoreHorizontal, Info, CalendarDays, HelpCircle,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  adminStats, actionItems, latestLeads, latestMarketers, platformMetrics, platformData,
  type PlatformMetric, type MarketerStatus,
} from "@/data/adminDashboard";
import { TiktokColorIcon } from "@/components/dashboard/SocialIcons";
import whatsapp from "@/assets/social/whatsapp.jpg.asset.json";
import telegram from "@/assets/social/telegram.jpg.asset.json";
import snapchat from "@/assets/social/snapchat.jpg.asset.json";
import instagram from "@/assets/social/instagram.jpg.asset.json";
import facebook from "@/assets/social/facebook.jpg.asset.json";
import xIcon from "@/assets/social/x.jpg.asset.json";
import linkedin from "@/assets/social/linkedin.png.asset.json";
import email from "@/assets/social/email.png.asset.json";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة — مكافآتي" },
      { name: "description", content: "نظرة عامة على أداء منصة مكافآتي: المسوقون والمتدربون وتسجيلات الاهتمام والنقرات." },
      { property: "og:title", content: "لوحة الإدارة — مكافآتي" },
      { property: "og:description", content: "نظرة عامة على أداء منصة مكافآتي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminHome,
});

const periods = ["جميع الأوقات", "هذا العام", "آخر 6 أشهر", "آخر 3 أشهر", "هذا الشهر", "آخر 7 أيام", "اليوم", "فترة مخصصة"];

const statStyle = {
  marketers: { icon: Users, cls: "bg-admin-red/10 text-admin-red" },
  trainees: { icon: GraduationCap, cls: "bg-admin-blue/10 text-admin-blue" },
  leads: { icon: UsersRound, cls: "bg-admin-purple/10 text-admin-purple" },
  clicks: { icon: MousePointerClick, cls: "bg-admin-green/10 text-admin-green" },
} as const;

const actionStyle = {
  withdraw: { icon: Wallet, bg: "bg-admin-blue/10", ic: "text-admin-blue" },
  rewards: { icon: Coins, bg: "bg-admin-amber/15", ic: "text-admin-amber" },
  memberships: { icon: UserPlus, bg: "bg-admin-red/10", ic: "text-admin-red" },
} as const;

const statusMap: Record<MarketerStatus, { label: string; cls: string }> = {
  active: { label: "نشط", cls: "bg-admin-green/15 text-admin-green" },
  pending: { label: "بانتظار التفعيل", cls: "bg-admin-amber/20 text-admin-navy" },
  suspended: { label: "موقوف", cls: "bg-admin-red/10 text-admin-red" },
};

const card = "rounded-2xl border border-admin-navy/5 bg-card shadow-[0_2px_10px_-4px_rgb(15_30_70/0.12)]";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden>
      <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.2-2.7l-3.5-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.8A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.2a11 11 0 0 0 0 9.8l3.6-2.8z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.2 7.1l3.6 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}

const platformImg: Record<string, string> = {
  whatsapp: whatsapp.url, telegram: telegram.url, snapchat: snapchat.url, instagram: instagram.url,
  facebook: facebook.url, x: xIcon.url, linkedin: linkedin.url, email: email.url,
};

function PlatformIcon({ k }: { k: string }) {
  const box = "grid h-7 w-7 place-items-center overflow-hidden rounded-full";
  if (platformImg[k]) return <img src={platformImg[k]} alt="" className={`${box} object-cover`} />;
  if (k === "tiktok") return <span className={`${box} bg-card`}><TiktokColorIcon size={22} /></span>;
  if (k === "google") return <span className={`${box} bg-card p-1`}><GoogleMark /></span>;
  return <span className={`${box} bg-muted-foreground text-card`}><HelpCircle size={18} /></span>;
}

function DetailsLink({ label }: { label: string }) {
  return (
    <button type="button" className="inline-flex items-center gap-1 text-sm font-bold text-admin-blue hover:underline">
      {label} <ArrowLeft size={15} />
    </button>
  );
}

function AdminHome() {
  const [period, setPeriod] = useState<string>("جميع الأوقات");
  const [metric, setMetric] = useState<PlatformMetric>("clicks");
  const chartData = platformData.map((p) => ({ ...p, value: p.values[metric] }));

  return (
    <div className="space-y-5">
      {/* العنوان + الفلتر */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
            <Home className="text-admin-blue" size={28} fill="currentColor" /> الرئيسية
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">نظرة عامة على أداء منصة مكافآتي</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger dir="rtl" className={`h-11 w-[190px] gap-2 ${card} font-bold`}>
            <CalendarDays size={18} className="text-admin-navy" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent dir="rtl">
            {periods.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* الإحصائيات */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((s) => {
          const st = statStyle[s.key];
          return (
            <div key={s.key} className={`${card} flex items-start justify-between p-5`}>
              <div>
                <div className="text-[15px] font-bold">{s.title}</div>
                <div className="mt-2 text-3xl font-extrabold">{s.value.toLocaleString("en-US")}</div>
                <div className="mt-3 text-xs text-muted-foreground">مقارنة بالفترة السابقة</div>
              </div>
              <div className="flex flex-col items-center justify-between gap-6 self-stretch">
                <span className={`grid h-14 w-14 place-items-center rounded-full ${st.cls}`}><st.icon size={26} /></span>
                <span className="flex items-center gap-0.5 text-lg font-bold text-admin-green"><ArrowUp size={18} />{s.change}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* يتطلب إجراء */}
      <section className={`${card} p-4 md:p-5`}>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold">
          <AlarmClock className="text-admin-red" size={22} /> يتطلب إجراء
        </h2>
        <div className="grid gap-4 md:grid-cols-3 [&>*]:min-w-0">
          {actionItems.map((a) => {
            const st = actionStyle[a.key];
            return (
              <div key={a.key} className={`flex items-center gap-4 rounded-xl ${st.bg} p-5`}>
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full bg-card ${st.ic}`}><st.icon size={26} /></span>
                <div className="space-y-1">
                  <div className="font-bold">{a.title}</div>
                  <div className="text-2xl font-extrabold">{a.value}</div>
                  <DetailsLink label="عرض التفاصيل" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* الجداول */}
      <div className="grid gap-5 xl:grid-cols-2 [&>*]:min-w-0">
        <section className={`${card} p-4`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><ClipboardList className="text-admin-blue" size={20} /> أحدث تسجيلات الاهتمام</h2>
            <DetailsLink label="عرض الكل" />
          </div>
          <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full min-w-[560px] text-sm">
              <thead><tr className="bg-admin-canvas text-xs font-bold">
                {["#", "اسم العميل", "البرنامج التدريبي", "المدينة", "المصدر", "تاريخ التسجيل", ""].map((h, i) => <th key={i} className="px-3 py-2.5 text-start">{h}</th>)}
              </tr></thead>
              <tbody>
                {latestLeads.map((r, i) => (
                  <tr key={i} className="border-b border-admin-navy/5 last:border-0">
                    <td className="px-3 py-3">{i + 1}</td>
                    <td className="px-3 py-3">{r.name}</td>
                    <td className="px-3 py-3">{r.program}</td>
                    <td className="px-3 py-3">{r.city}</td>
                    <td className="px-3 py-3">{r.source}</td>
                    <td className="px-3 py-3 tabular-nums">{r.date}</td>
                    <td className="px-3 py-3"><MoreHorizontal size={18} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${card} p-4`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><Users className="text-admin-blue" size={20} /> أحدث المسوقين الخارجيين المسجلين</h2>
            <DetailsLink label="عرض الكل" />
          </div>
          <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full min-w-[520px] text-sm">
              <thead><tr className="bg-admin-canvas text-xs font-bold">
                {["#", "رقم العضوية", "الاسم", "المدينة", "تاريخ التسجيل", "الحالة", ""].map((h, i) => <th key={i} className="px-3 py-2.5 text-start">{h}</th>)}
              </tr></thead>
              <tbody>
                {latestMarketers.map((r, i) => (
                  <tr key={r.id} className="border-b border-admin-navy/5 last:border-0">
                    <td className="px-3 py-3">{i + 1}</td>
                    <td className="px-3 py-3 font-medium">{r.id}</td>
                    <td className="px-3 py-3">{r.name}</td>
                    <td className="px-3 py-3">{r.city}</td>
                    <td className="px-3 py-3 tabular-nums">{r.date}</td>
                    <td className="px-3 py-3"><span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusMap[r.status].cls}`}>{statusMap[r.status].label}</span></td>
                    <td className="px-3 py-3"><MoreHorizontal size={18} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* الرسم البياني — آخر عنصر */}
      <section className={`${card} p-4 md:p-6`}>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold">الأداء حسب المنصة <Info size={18} className="text-admin-blue" /></h2>
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-admin-sidebar p-1.5 md:grid-cols-4">
          {platformMetrics.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMetric(m.key)}
              className={`rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${metric === m.key ? "bg-admin-blue text-primary-foreground shadow" : "text-admin-navy hover:bg-card/70"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="h-[260px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...chartData].reverse()} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e9f2" />
                  <XAxis dataKey="label" hide />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} width={44} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={64}>
                    {[...chartData].reverse().map((d) => <Cell key={d.key} fill={d.color} />)}
                    <LabelList dataKey="value" position="top" fontSize={13} fontWeight={700} fill="#1e2a4a" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex ps-[44px]" dir="ltr">
              {[...chartData].reverse().map((d) => (
                <div key={d.key} className="flex flex-1 flex-col items-center gap-1.5 pt-2">
                  <PlatformIcon k={d.key} />
                  <span className="text-xs font-bold">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
