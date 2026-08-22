import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, MapPin } from "lucide-react";

export const Route = createFileRoute("/dashboard/ads")({
  head: () => ({
    meta: [
      { title: "تسويق الإعلانات | لوحة تحكم مكافآتي" },
      {
        name: "description",
        content: "اختر المدينة لعرض البرامج التدريبية المتاحة للتسويق وابدأ تسويق الإعلانات.",
      },
      { property: "og:title", content: "تسويق الإعلانات | لوحة تحكم مكافآتي" },
      {
        property: "og:description",
        content: "اختر المدينة لعرض البرامج التدريبية المتاحة للتسويق وابدأ تسويق الإعلانات.",
      },
    ],
  }),
  component: AdsPage,
});

const CITIES = ["جدة", "الرياض", "مكة المكرمة", "ينبع"] as const;
type City = (typeof CITIES)[number];

const extra: Array<[string, number]> = [
  ["دبلوم التسويق الرقمي", 8500],
  ["دبلوم إدارة المشاريع", 9000],
  ["دبلوم السكرتارية التنفيذية", 5500],
  ["دبلوم تحليل البيانات", 9500],
  ["دبلوم الموارد البشرية المتقدم", 7000],
  ["دورة اللغة الإنجليزية للأعمال", 4500],
  ["دورة إدارة الوقت والإنتاجية", 2500],
  ["دورة مهارات البيع والإقناع", 3000],
  ["دورة خدمة العملاء الاحترافية", 2800],
  ["دبلوم الشبكات وأمن المعلومات", 8800],
  ["دبلوم التصميم الجرافيكي", 6800],
  ["دورة إعداد التقارير المالية", 3800],
  ["دورة الأمن السيبراني للمبتدئين", 3200],
  ["دبلوم إدارة سلاسل الإمداد", 7800],
  ["دورة الحوسبة السحابية", 4200],
];

const base: Array<[string, number]> = [
  ["دبلوم إدارة الموارد البشرية", 9500],
  ["دبلوم إدارة الأعمال", 8000],
  ["دبلوم الأمن السيبراني", 7500],
  ["دبلوم المحاسبة المالية", 6500],
  ["دبلوم الذكاء الاصطناعي", 9500],
  ["دبلوم البرمجيات", 9500],
];

const tail: Array<[string, number]> = [
  ["دورة إدخال البيانات ومعالجة النصوص", 3500],
  ["دورة استخدام الحاسب الآلي في الأعمال المكتبية", 2500],
];

function programsFor(city: City) {
  const count = city === "جدة" ? 15 : city === "الرياض" ? 12 : city === "مكة المكرمة" ? 6 : 3;
  const middle = extra.slice(0, count);
  return [...base, ...middle, ...tail].map(([name, fee], i) => ({
    id: i + 1,
    name,
    city,
    fee,
  }));
}

const PER_PAGE = 8;

function AdsPage() {
  const [city, setCity] = useState<City>("جدة");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => programsFor(city), [city]);
  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const visible = rows.slice(start, start + PER_PAGE);

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500">
      <div className="text-right">
        <h1 className="text-2xl font-black text-navy sm:text-3xl">تسويق الإعلانات</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          اختر المدينة لعرض البرامج التدريبية المتاحة للتسويق
        </p>
      </div>

      <div className="text-right">
        <label htmlFor="city" className="block text-sm font-bold text-navy">
          اختر المدينة
        </label>
        <div className="relative mt-2 w-full max-w-md">
          <MapPin
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand"
          />
          <select
            id="city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value as City);
              setPage(1);
            }}
            className="h-12 w-full appearance-none rounded-2xl border border-border bg-card pr-11 pl-11 text-right text-[15px] font-bold text-navy outline-none transition-colors focus:border-brand"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-4 sm:p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse overflow-hidden rounded-2xl text-right">
            <thead>
              <tr className="bg-navy-deep text-primary-foreground">
                <th className="px-4 py-3.5 text-sm font-bold">الرقم</th>
                <th className="px-4 py-3.5 text-sm font-bold">البرنامج التدريبي</th>
                <th className="px-4 py-3.5 text-sm font-bold">المدينة</th>
                <th className="px-4 py-3.5 text-sm font-bold">الحالة</th>
                <th className="px-4 py-3.5 text-sm font-bold">الرسوم</th>
                <th className="px-4 py-3.5 text-sm font-bold">تسويق الإعلان</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr
                  key={`${city}-${row.id}`}
                  className={i % 2 === 1 ? "bg-brand-soft/70" : "bg-card"}
                >
                  <td className="px-4 py-3 text-sm font-bold text-navy">{row.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-navy">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{row.city}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                      التسجيل متاح
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-navy">
                    {row.fee.toLocaleString("en-US")} ريال
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sm font-bold text-brand transition-colors hover:text-navy">
                      ابدأ التسويق
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground sm:text-sm">
            عرض {rows.length === 0 ? 0 : start + 1} إلى {Math.min(start + PER_PAGE, rows.length)} من{" "}
            {rows.length} دورة
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-9 rounded-xl border border-border px-3 text-sm font-bold text-navy transition-colors hover:bg-brand-soft disabled:opacity-40"
            >
              السابق
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-xl text-sm font-bold transition-colors ${
                  p === page
                    ? "bg-brand text-primary-foreground"
                    : "border border-border text-navy hover:bg-brand-soft"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-9 rounded-xl border border-border px-3 text-sm font-bold text-navy transition-colors hover:bg-brand-soft disabled:opacity-40"
            >
              التالي
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <span>عرض</span>
            <span className="inline-flex h-9 items-center rounded-xl border border-border px-3 font-bold text-navy">
              8
            </span>
            <span>من كل صفحة</span>
          </div>
        </div>
      </div>
    </section>
  );
}
