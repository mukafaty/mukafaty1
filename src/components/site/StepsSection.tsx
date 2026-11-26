import { User, Link2, Share2, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StepCard } from "./StepCard";

const steps = [
  {
    number: "01",
    title: "سجّل حسابك كمسوق",
    description: "بياناتك تحفظ في حساب خاص وآمن.",
    icon: User,
  },
  {
    number: "02",
    title: "اختر البرنامج المناسب",
    description: "اطلع على تفاصيل العمولة لكل برنامج واختر ما يناسبك.",
    icon: Link2,
  },
  {
    number: "03",
    title: "شارك رابطك الخاص",
    description: "انسخ الرابط وشاركه في قنواتك المفضلة.",
    icon: Share2,
  },
  {
    number: "04",
    title: "تابع نتائجك واستلم عمولاتك",
    description: "استلم عمولاتك بعد تأكيد الدفع الفعلي.",
    icon: TrendingUp,
  },
];

export function StepsSection() {
  return (
    <section
      id="steps"
      className="relative overflow-hidden bg-navy-deep py-16 md:flex md:min-h-0 md:flex-col md:flex-1 md:py-6 lg:py-8"
    >
      <div className="tech-dots pointer-events-none absolute inset-0 opacity-10" aria-hidden />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 md:flex md:flex-1 md:flex-col md:justify-center lg:px-10">
        <header className="text-center">
          <h2 className="text-3xl font-black text-primary-foreground sm:text-4xl md:text-5xl">
            ابدأ في أربع خطوات
          </h2>
          <p className="mt-3 text-base tracking-wide text-primary-foreground/70 sm:text-lg">
            طريقك واضح وبسيط إلى المكافآت
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-10 lg:grid-cols-4">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>

        <div className="mt-[60px] flex justify-center">
          <Link
            to="/register"
            className="inline-flex h-[65px] w-[500px] max-w-full origin-center items-center justify-center rounded-full bg-register-blue text-[26px] font-bold text-primary-foreground transition-[background-color,transform] duration-300 ease-in-out hover:bg-register-gold sm:hover:[transform:scale(1.10)]"
          >
            سجّل الآن
          </Link>
        </div>
      </div>
    </section>
  );
}
