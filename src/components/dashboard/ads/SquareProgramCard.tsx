import { MapPin, Send, User } from "lucide-react";
import type { Program } from "@/data/adsPrograms";

const fmt = (n: number) => n.toLocaleString("en-US");

function FeeRow({ label, fee, commission }: { label: string; fee: number; commission: number }) {
  return (
    <div className="flex items-stretch gap-2">
      <div className="flex flex-1 items-center justify-between gap-2 rounded-xl bg-[#F7F8FD] px-3 py-2">
        <span className="text-xs font-bold text-muted-foreground">{label}</span>
        <span className="text-sm font-black text-brand">{fmt(fee)} ريال</span>
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 rounded-xl bg-[#FDF9F0] px-3 py-2">
        <span className="text-xs font-bold text-muted-foreground">عمولتك لكل تسجيل</span>
        <span className="text-sm font-black text-destructive">{fmt(commission)} ريال</span>
      </div>
    </div>
  );
}

export function SquareProgramCard({ program }: { program: Program }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* صورة البطاقة */}
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <img
          src={program.image}
          alt={program.programName}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover"
        />

        {/* المدينة — أعلى يمين */}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-3 py-1.5 text-xs font-bold text-navy shadow-sm">
          <MapPin size={14} className="text-brand" />
          {program.city}
        </span>

        {/* جديد — شارة زاوية أعلى يسار الصورة */}
        {program.isNew && (
          <span className="pointer-events-none absolute left-0 top-0 z-10 block h-24 w-24 overflow-hidden">
            <span className="absolute left-[-34px] top-[20px] block w-32 -rotate-45 bg-destructive py-1 text-center text-xs font-black text-primary-foreground shadow-sm">
              جديد
            </span>
          </span>
        )}

        {/* خصم — أعلى يسار */}
        {program.discount && (
          <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1.5 text-xs font-black text-primary-foreground shadow-sm">
            خصم {program.discount}%
          </span>
        )}

        {/* نوع البرنامج — أسفل يمين */}
        <span
          className={`absolute bottom-3 right-3 rounded-full px-4 py-1.5 text-xs font-bold text-primary-foreground ${
            program.programType === "دبلوم" ? "bg-brand" : "bg-gold"
          }`}
        >
          {program.programType}
        </span>

        {/* الفئة المستهدفة — أسفل يسار */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-3 py-1.5 text-xs font-bold text-navy shadow-sm">
          <User size={14} className="text-brand" />
          {program.targetAudience}
        </span>
      </div>

      {/* محتوى البطاقة */}
      <div className="flex flex-1 flex-col gap-3 p-4 text-right">
        <h3 className="text-base font-black text-navy">{program.programName}</h3>

        <FeeRow label="الرسوم كـاش" fee={program.cashFee} commission={program.cashCommission} />
        <FeeRow
          label="الرسوم أقساط"
          fee={program.installmentFee}
          commission={program.installmentCommission}
        />

        {program.marketingText && (
          <p className="text-sm font-bold text-navy">{program.marketingText}</p>
        )}
        {program.promotionalText && (
          <p className="text-xs text-muted-foreground">{program.promotionalText}</p>
        )}

        <div className="mt-auto pt-1">
          <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#006BFE] text-sm font-black text-white transition-colors hover:bg-[#FF0000] hover:text-white">
            <Send size={17} />
            ابدأ النشر
          </button>
        </div>
      </div>
    </article>
  );
}
