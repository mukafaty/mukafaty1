import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  UserRound, Users, UserCheck, Clock, UserX, Search, MoreHorizontal, RotateCcw,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MembershipConfirmation } from "@/components/admin/MembershipConfirmation";
import { useMockMarketers } from "@/data/adminMarketersStore";
import { marketerCities as cities, marketerName, statusMap, toggleMembership, type Marketer } from "@/data/adminMarketers";

export const Route = createFileRoute("/admin/external-marketers")({
  head: () => ({
    meta: [
      { title: "المسوقون (خارجي) — لوحة الإدارة مكافآتي" },
      { name: "description", content: "إدارة ومتابعة المسوقين الخارجيين في برنامج مكافآتي." },
      { property: "og:title", content: "المسوقون (خارجي) — مكافآتي" },
      { property: "og:description", content: "إدارة ومتابعة المسوقين الخارجيين في برنامج مكافآتي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExternalMarketersPage,
});

const card = "rounded-2xl border border-admin-navy/5 bg-card shadow-sm";
const field = "h-11 w-full rounded-xl border border-admin-navy/10 bg-card px-3 text-sm outline-none focus:border-admin-blue";

function ExternalMarketersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");
  const [gender, setGender] = useState("all");
  const [date, setDate] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const { marketers, update } = useMockMarketers();
  const [confirm, setConfirm] = useState<Marketer | null>(null);
  const [notice, setNotice] = useState("");
  const stats = [
    { title: "إجمالي المسوقين", value: marketers.length, icon: Users, cls: "bg-admin-blue/10 text-admin-blue" },
    { title: "المسوقون النشطون", value: marketers.filter(m => m.status === "active").length, icon: UserCheck, cls: "bg-admin-green/10 text-admin-green" },
    { title: "بانتظار التفعيل", value: marketers.filter(m => m.status === "pending").length, icon: Clock, cls: "bg-admin-amber/15 text-admin-amber" },
    { title: "الموقوفون", value: marketers.filter(m => m.status === "suspended").length, icon: UserX, cls: "bg-admin-red/10 text-admin-red" },
  ];
  function changeStatus(m: Marketer) {
    try { update(records => toggleMembership(records, m.id)); setNotice("تم تحديث حالة العضوية"); }
    catch { setNotice("تعذر حفظ الحالة محليًا، حاول مجددًا"); }
  }

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return marketers
      .filter((m) =>
        (!t || [marketerName(m), m.id, m.email, m.phone].some((v) => v.toLowerCase().includes(t))) &&
        (status === "all" || m.status === status) &&
        (city === "all" || m.city === city) &&
        (gender === "all" || m.gender === gender) &&
        (!date || m.date === date),
      );
  }, [q, status, city, gender, date, marketers]);

  const pages = Math.max(1, Math.ceil(rows.length / perPage));
  const cur = Math.min(page, pages);
  const start = (cur - 1) * perPage;
  const visible = rows.slice(start, start + perPage);
  const reset = () => { setQ(""); setStatus("all"); setCity("all"); setGender("all"); setDate(""); setPage(1); };
  const upd = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(1); };

  return (
    <div className="space-y-5">
      {notice && <p role="status" className="text-sm font-bold text-admin-blue">{notice}</p>}
      <MembershipConfirmation open={!!confirm} onOpenChange={open => { if (!open) setConfirm(null); }} name={confirm ? marketerName(confirm) : ""} onConfirm={() => { if (confirm) changeStatus(confirm); setConfirm(null); }} />
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
          <UserRound className="text-admin-blue" size={28} /> المسوقون (خارجي)
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">إدارة ومتابعة المسوقين الخارجيين في برنامج مكافآتي</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.title} className={`${card} flex items-center justify-between p-5`}>
            <div>
              <div className="text-[15px] font-bold">{s.title}</div>
              <div className="mt-2 text-3xl font-extrabold">{s.value}</div>
            </div>
            <span className={`grid h-14 w-14 place-items-center rounded-full ${s.cls}`}><s.icon size={26} /></span>
          </div>
        ))}
      </div>

      <div className={`${card} grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.6fr_1fr_1fr_0.8fr_1fr_auto]`}>
        <div className="relative sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => upd(setQ)(e.target.value)} placeholder="ابحث بالاسم، رقم العضوية، البريد أو الجوال" className={`${field} pe-3 ps-10`} />
        </div>
        <FilterSelect value={status} onChange={upd(setStatus)} options={[["all", "جميع الحالات"], ["active", "نشط"], ["pending", "بانتظار التفعيل"], ["suspended", "موقوف"]]} />
        <FilterSelect value={city} onChange={upd(setCity)} options={[["all", "جميع المدن"], ...cities.map((c) => [c, c] as [string, string])]} />
        <FilterSelect value={gender} onChange={upd(setGender)} options={[["all", "الكل"], ["ذكر", "ذكر"], ["أنثى", "أنثى"]]} />
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm text-muted-foreground">
            تاريخ التسجيل <span className="mx-1.5 font-light text-admin-navy/25">|</span>
          </span>
          <input type="date" aria-label="تاريخ التسجيل" value={date} onChange={(e) => upd(setDate)(e.target.value)} className={`${field} ps-[7.5rem]`} />
        </div>
        <button type="button" onClick={reset} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-admin-navy/10 px-4 text-sm font-bold text-admin-navy hover:bg-admin-canvas">
          <RotateCcw size={16} /> مسح الفلاتر
        </button>
      </div>

      <div className={`${card} min-w-0 p-4 md:p-5`}>
        <h2 className="mb-4 text-lg font-extrabold">قائمة المسوقين الخارجيين</h2>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[980px] text-right text-sm">
            <thead>
              <tr className="border-b border-admin-navy/10 text-muted-foreground">
                {["#", "رقم العضوية", "اسم المسوق", "الجوال", "البريد الإلكتروني", "الجنس", "المدينة", "تاريخ التسجيل", "حالة العضوية", "الإجراءات"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-3 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((m, i) => (
                <tr key={m.id} className="border-b border-admin-navy/5 last:border-0">
                  <td className="px-3 py-3">{start + i + 1}</td>
                  <td className="px-3 py-3 font-bold" dir="ltr">{m.id}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-bold">{marketerName(m)}</td>
                  <td className="px-3 py-3" dir="ltr">{m.phone}</td>
                  <td className="px-3 py-3" dir="ltr">{m.email}</td>
                  <td className="px-3 py-3">{m.gender}</td>
                  <td className="whitespace-nowrap px-3 py-3">{m.city}</td>
                  <td className="px-3 py-3" dir="ltr">{m.date}</td>
                  <td className="px-3 py-3">
                    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusMap[m.status].cls}`}>{statusMap[m.status].label}</span>
                  </td>
                  <td className="px-3 py-3">
                    <DropdownMenu modal={false} dir="rtl">
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`الإجراءات ${m.id}`}><MoreHorizontal size={18} /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-right">
                        <DropdownMenuItem asChild><Link to="/admin/external-marketers/$id" params={{ id: m.id }}>عرض ملف المسوق</Link></DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => m.status === "active" ? setConfirm(m) : changeStatus(m)}>
                          {m.status === "active" ? "إيقاف العضوية" : "تفعيل العضوية"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={10} className="px-3 py-10 text-center text-muted-foreground">لا توجد نتائج مطابقة</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-muted-foreground">
            عرض {rows.length ? start + 1 : 0} - {Math.min(start + perPage, rows.length)} من أصل {rows.length} مسوقًا
          </div>
          <div className="flex items-center gap-2">
            <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger dir="rtl" className="h-9 w-[80px]"><SelectValue /></SelectTrigger>
              <SelectContent dir="rtl">
                {[5, 10, 15, 25].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <button type="button" disabled={cur <= 1} onClick={() => setPage(cur - 1)} className="h-9 rounded-lg border border-admin-navy/10 px-3 font-bold disabled:opacity-40">السابق</button>
            <span className="px-1 font-bold">{cur} / {pages}</span>
            <button type="button" disabled={cur >= pages} onClick={() => setPage(cur + 1)} className="h-9 rounded-lg border border-admin-navy/10 px-3 font-bold disabled:opacity-40">التالي</button>
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
      <SelectContent dir="rtl">
        {options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
