import { CheckCircle2 } from "lucide-react";
import sofaAsset from "@/assets/hero-sofa.png.asset.json";

const points = [
  "شارك .. واحصل على عمولات مجزية",
  "كل تسجيل = عمولات تضاف لحسابك",
  "كلما زاد تفاعلك زادت أرباحك",
];

export function HeroSlide2() {
  return (
    <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:py-24">
      <div className="order-1 flex flex-col items-start gap-6 text-right">
        <h2 className="text-navy">
          <span className="block text-4xl font-black leading-[1.25] tracking-tight text-brand sm:text-5xl md:text-6xl">
            خطوات بسيطة
          </span>
          <span className="mt-2 block text-5xl font-black leading-[1.25] tracking-tight text-navy-deep sm:text-6xl md:text-7xl">
            مكافآت كثيرة
          </span>
        </h2>

        <ul className="flex flex-col gap-4 text-base text-navy sm:text-lg">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-3">
              <CheckCircle2 size={22} className="shrink-0 text-[oklch(0.62_0.16_150)]" />
              <span>{p}</span>
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
          className="mx-auto w-full max-w-2xl object-contain"
        />
      </div>
    </div>
  );
}
