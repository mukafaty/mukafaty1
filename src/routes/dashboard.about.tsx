import { createFileRoute } from "@tanstack/react-router";
import { Info, Percent, Calculator, Wallet } from "lucide-react";
import aboutHeroAsset from "@/assets/about-hero.png.asset.json";

export const Route = createFileRoute("/dashboard/about")({
  head: () => ({
    meta: [
      { title: "عن البرنامج | لوحة تحكم مكافآتي" },
      { name: "description", content: "تفاصيل برنامج التسويق بالعمولة وشروط المكافآت." },
      { property: "og:title", content: "عن البرنامج | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "تفاصيل برنامج التسويق بالعمولة وشروط المكافآت." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="space-y-5">
      {/* Page header */}
      <section className="animate-in fade-in slide-in-from-bottom-2 flex items-center gap-3 duration-500">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-primary-foreground">
          <Info size={22} />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-black text-navy sm:text-2xl">عن برنامج مكافأتي</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            تفاصيل برنامج التسويق بالعمولة وشروط المكافآت.
          </p>
        </div>
      </section>

      {/* Hero card */}
      <section
        className="animate-in fade-in slide-in-from-bottom-3 overflow-hidden rounded-3xl border border-border bg-card duration-700 fill-mode-backwards"
        style={{ animationDelay: "80ms" }}
      >
        <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:gap-10">
          <div className="order-2 min-w-0 text-right lg:order-1">
            <h2 className="text-2xl font-black text-navy sm:text-3xl">عن برنامج مكافأتي</h2>
            <p className="mt-3 text-lg font-bold text-brand sm:text-xl">
              حوّل علاقاتك ومهاراتك التسويقية إلى دخل إضافي.
            </p>
            <p className="mt-4 leading-8 text-muted-foreground">
              شارك البرامج التدريبية المتاحة، واستفد من المكافآت المالية عند تسجيل العملاء من خلال رابط الإحالة الخاص بك.
            </p>
          </div>
          <div className="order-1 flex items-center justify-center lg:order-2">
            <img
              src={aboutHeroAsset.url}
              alt="شرح برنامج مكافأتي للتسويق بالعمولة"
              className="h-auto w-full max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      </section>

      {/* How it works card */}
      <section
        className="animate-in fade-in slide-in-from-bottom-3 rounded-3xl border border-border bg-card p-6 duration-700 fill-mode-backwards sm:p-8"
        style={{ animationDelay: "160ms" }}
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
            <Calculator size={22} />
          </span>
          <h2 className="text-xl font-black text-navy sm:text-2xl">كيف تحسب المكافأة؟</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Reward explanation */}
          <div className="rounded-2xl border border-border bg-brand-soft/40 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1 text-right">
                <h3 className="text-lg font-black text-navy">المكافأة التسويقية</h3>
                <p className="mt-2 leading-7 text-muted-foreground">
                  يحصل المسوق على 5% من قيمة الرسوم للبرنامج التدريبي عند استحقاق المكافأة.
                </p>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand text-primary-foreground shadow-sm">
                <Percent size={26} />
              </span>
            </div>
          </div>

          {/* Example calculation */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-lg font-black text-navy">مثال توضيحي</h3>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Wallet size={20} />
              </span>
            </div>

            <div className="flex flex-nowrap items-center justify-between gap-2 overflow-x-auto rounded-2xl bg-brand-soft/40 px-4 py-5 text-navy sm:gap-4 sm:px-6">
              <div className="min-w-0 flex-1 text-center">
                <p className="text-[11px] font-bold text-muted-foreground sm:text-xs">رسوم البرنامج</p>
                <p className="mt-1 text-base font-black sm:text-lg">9,500 ريال</p>
              </div>
              <span className="shrink-0 text-lg font-black text-muted-foreground/60 sm:text-xl">×</span>
              <div className="min-w-0 flex-1 text-center">
                <p className="text-[11px] font-bold text-muted-foreground sm:text-xs">نسبة العمولة</p>
                <p className="mt-1 text-base font-black text-brand sm:text-lg">5%</p>
              </div>
              <span className="shrink-0 text-lg font-black text-muted-foreground/60 sm:text-xl">=</span>
              <div className="min-w-0 flex-1 text-center">
                <p className="text-[11px] font-bold text-muted-foreground sm:text-xs">مكافأتك</p>
                <p className="mt-1 text-base font-black text-emerald-600 sm:text-lg">475 ريال</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
