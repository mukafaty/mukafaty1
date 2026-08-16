import { CheckCircle2 } from "lucide-react";
import sofaAsset from "@/assets/hero-sofa-2.png.asset.json";

const points = [
  "شارك .. واحصل على عمولات مجزية",
  "كل تسجيل = عمولات تضاف لحسابك",
  "كلما زاد تفاعلك زادت أرباحك",
];

export function HeroSlide2() {
  return (
    <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:py-20">
      <div className="order-1 flex flex-col items-start gap-6 text-right">
        <h2 className="text-navy">
          <span className="block text-4xl font-black leading-[1.25] tracking-tight text-brand sm:text-5xl md:text-6xl">
            خطوات بسيطة
          </span>
          <span className="mt-2 block text-5xl font-black leading-[1.25] tracking-tight text-navy-deep sm:text-6xl md:text-7xl">
            مكافآت كثيرة
          </span>
        </h2>

        <ul className="flex flex-col gap-5 text-navy-deep">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-3">
              <CheckCircle2 size={28} className="shrink-0 text-[oklch(0.62_0.16_150)]" />
              <span className="text-lg font-bold leading-[1.9] sm:text-xl md:text-[22px]">{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-2">
        <img
          src={sofaAsset.url}
          width={1200}
          height={912}
          loading="lazy"
          alt="مسوّق سعودي يجلس على الكنبة ويتابع مكافآته المستحقة عبر الهاتف"
          className="mx-auto w-full max-w-xl object-contain"
        />
      </div>

    </div>
  );
}
