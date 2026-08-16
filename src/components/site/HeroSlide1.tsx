import { Sparkles, CheckCircle2 } from "lucide-react";
import { CTAButtons } from "./CTAButtons";
import heroAsset from "@/assets/hero-dashboard.png.asset.json";

const heroImage = heroAsset.url;

export function HeroSlide1() {
  return (
    <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:py-24">
      <div className="order-1 flex flex-col items-start gap-6 text-right">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-background/80 px-5 py-2 text-xs font-medium text-navy shadow-sm sm:text-sm">
          <Sparkles size={16} className="text-brand" />
          برنامج تسويق بالعمولة يحقق لك الأرباح
        </span>

        <h1 className="text-navy">
          <span className="block text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            حوّل تأثيرك إلى
          </span>
          <span className="mt-2 block text-6xl font-black leading-[1.25] tracking-tight text-navy-deep drop-shadow-[0_10px_25px_color-mix(in_oklab,var(--brand)_25%,transparent)] sm:text-7xl md:text-8xl">
            مُكافآت
          </span>
        </h1>

        <p className="max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
          مكافآتي تمنحك الأدوات التي تحتاجها للتسويق، وتتبع نتائجك، واستلام عمولاتك بكل سهولة.
        </p>

        <CTAButtons />

        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-navy">
          <li className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-brand" />
            التسجيل سهل ومباشر
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-brand" />
            لا يوجد رسوم للانضمام
          </li>
        </ul>
      </div>

      <div className="order-2">
        <img
          src={heroImage}
          width={1200}
          height={912}
          alt="لوحة تحكم مكافآتي مع أرباح العمولات والعملات الذهبية"
          className="w-full max-w-2xl mx-auto object-contain"
        />
      </div>
    </div>
  );
}
