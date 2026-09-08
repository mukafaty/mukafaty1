import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  Clock3,
  CreditCard,
  GraduationCap,
  Laptop,
  TrendingUp,
} from "lucide-react";
import bannerAsset from "@/assets/landing/banner.jpg.asset.json";
import diplomaAdAsset from "@/assets/landing/HR-diploma-ad.jpg.asset.json";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ad/$slug")({
  head: () => ({
    meta: [
      { title: "دبلوم إدارة الموارد البشرية عن بُعد" },
      {
        name: "description",
        content: "سجّل اهتمامك بدبلوم إدارة الموارد البشرية عن بُعد، برنامج معتمد لمدة عامين ونصف.",
      },
      { property: "og:title", content: "دبلوم إدارة الموارد البشرية عن بُعد" },
      {
        property: "og:description",
        content: "انتقل بمستواك المهني إلى مستويات جديدة من الإدارة والتميز.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdLandingPage,
});

const features = [
  {
    label: "شهادة جامعية متوسطة معتمدة",
    icon: GraduationCap,
    color: "bg-brand-soft text-brand",
  },
  { label: "79 وحدة تدريبية", icon: BookOpen, color: "bg-emerald-50 text-emerald-700" },
  { label: "مدة البرنامج عامين ونصف", icon: Clock3, color: "bg-brand-soft text-brand" },
  { label: "التدريب عن بُعد", icon: Laptop, color: "bg-sky-50 text-sky-700" },
  {
    label: "معتمد في القطاعات الحكومية والعسكرية",
    icon: Building2,
    color: "bg-emerald-50 text-emerald-700",
  },
  { label: "إمكانية التجسير للبكالوريوس", icon: TrendingUp, color: "bg-emerald-50 text-emerald-700" },
  { label: "إمكانية التقسيط", icon: CreditCard, color: "bg-brand-soft text-brand" },
] as const;

const inputClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/15";

function FieldLabel({ children, required = false }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-xs font-bold text-navy">
      {children}
      {required ? <span className="mr-1 text-destructive">*</span> : null}
    </label>
  );
}

function AdLandingPage() {
  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-brand-soft/35 text-foreground">
      <header className="border-b border-border/70 bg-brand-soft/55">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-5 sm:h-16 sm:px-8 lg:px-12">
          <a href="#contact" className="text-sm font-bold text-navy transition-colors hover:text-brand">
            تواصل معنا
          </a>
        </div>
      </header>

      <main>
        <section aria-label="الجهات المعتمدة" className="bg-[#f6fbfe]">
          <img
            src={bannerAsset.url}
            alt="شعارات الجهات والمعاهد المعتمدة لبرنامج الدبلوم"
            width={1920}
            height={480}
            className="mx-auto block h-auto w-full max-w-[1200px] object-contain"
          />
        </section>

        <section className="bg-navy px-5 py-8 text-center sm:py-10 lg:py-11">
          <h1 className="text-2xl font-black leading-tight text-primary-foreground sm:text-3xl lg:text-4xl">
            دبلوم إدارة الموارد البشرية - عن بُعد
          </h1>
          <p className="mt-3 text-sm font-bold text-primary-foreground/90 sm:text-base lg:text-lg">
            انتقل بمستواك المهني إلى مستويات جديدة من الإدارة والتميز
          </p>
        </section>

        <section aria-label="مميزات البرنامج" className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-7">
            {features.map(({ label, icon: Icon, color }) => (
              <article
                key={label}
                className="flex min-h-32 flex-col items-center justify-start rounded-lg border border-border/80 bg-card px-2 py-4 text-center shadow-sm sm:min-h-36 sm:px-3 sm:py-5"
              >
                <span className={`grid size-11 shrink-0 place-items-center rounded-full sm:size-12 ${color}`}>
                  <Icon size={23} strokeWidth={2.1} aria-hidden="true" />
                </span>
                <p className="mt-3 text-xs font-bold leading-5 text-navy sm:text-sm">{label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 pt-1 sm:px-6 sm:pb-16 lg:px-10">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] lg:gap-7" dir="ltr">
            <div className="min-w-0 lg:col-start-1" dir="rtl">
              <img
                src={diplomaAdAsset.url}
                alt="إعلان دبلوم إدارة الموارد البشرية بنمط التدريب عن بُعد"
                width={619}
                height={1100}
                className="mx-auto block h-auto w-full max-w-[619px] border border-navy/30 object-contain"
              />
            </div>

            <section
              aria-labelledby="registration-title"
              className="min-w-0 rounded-3xl border border-brand/35 bg-card px-5 py-7 shadow-sm sm:px-8 sm:py-9 lg:col-start-2"
              dir="rtl"
            >
              <div className="text-center sm:text-right">
                <span className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-brand-soft text-brand sm:mx-0">
                  <Award size={25} aria-hidden="true" />
                </span>
                <h2 id="registration-title" className="text-2xl font-black text-navy sm:text-3xl">
                  سجّل الآن
                </h2>
                <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                  أدخل بياناتك وسوف يتم التواصل معك لاستكمال إجراءات التسجيل.
                </p>
              </div>


              <form className="mt-6 space-y-5" onSubmit={(event) => event.preventDefault()}>
                <div>
                  <FieldLabel required>الاسم الكامل</FieldLabel>
                  <input className={inputClass} type="text" placeholder="أدخل اسمك الكامل" />
                </div>
                <div>
                  <FieldLabel required>المدينة</FieldLabel>
                  <select className={inputClass} defaultValue="">
                    <option value="" disabled>اختر المدينة</option>
                    <option>الرياض</option>
                    <option>جدة</option>
                    <option>مكة المكرمة</option>
                    <option>المدينة المنورة</option>
                    <option>مدينة أخرى</option>
                  </select>
                </div>
                <div>
                  <FieldLabel required>رقم الجوال</FieldLabel>
                  <input className={inputClass} type="tel" inputMode="tel" dir="ltr" placeholder="05xxxxxxxx" />
                </div>
                <div>
                  <FieldLabel>البريد الإلكتروني</FieldLabel>
                  <input className={inputClass} type="email" dir="ltr" placeholder="example@domain.com" />
                </div>

                <Button type="submit" className="h-12 w-full rounded-lg bg-brand text-base font-black hover:bg-navy">
                  إرسال
                  <ArrowLeft size={19} aria-hidden="true" />
                </Button>
              </form>

              <a href="#privacy" className="mt-4 block text-center text-xs font-bold text-navy underline underline-offset-4 hover:text-brand">
                للاطلاع على سياسة الخصوصية - اضغط هنا
              </a>
            </section>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-navy text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 py-7 text-center text-xs sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-8 sm:text-right lg:px-12">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-start">
            <a href="#terms" className="transition-opacity hover:opacity-75">الشروط والأحكام</a>
            <a id="privacy" href="#privacy" className="transition-opacity hover:opacity-75">سياسة الخصوصية</a>
            <a href="#contact" className="transition-opacity hover:opacity-75">تواصل معنا</a>
          </nav>
          <p className="font-medium">جميع الحقوق محفوظة © 2026</p>
        </div>
      </footer>
    </div>
  );
}