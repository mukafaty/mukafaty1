import { MapPin, Send, User } from "lucide-react";
import { commissionOf, type Program } from "@/data/adsPrograms";

const fmt = (n: number) => n.toLocaleString("en-US");

export function CardMedia({
  program,
  className,
  layout = "square",
}: {
  program: Program;
  className?: string;
  layout?: "square" | "wide";
}) {
  const isWide = layout === "wide";

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <img
        src={program.image}
        alt={program.name}
        loading="lazy"
        width={1024}
        height={640}
        className="h-full w-full object-cover"
      />

      {program.isNew && (
        <span
          className={`absolute top-0 h-0 w-0 border-t-[70px] border-t-destructive ${
            isWide
              ? "left-0 border-r-[70px] border-r-transparent"
              : "right-0 border-l-[70px] border-l-transparent"
          }`}
        />
      )}
      {program.isNew && (
        <span
          className={`absolute top-4 text-[11px] font-black text-primary-foreground ${
            isWide ? "left-2 -rotate-45" : "right-2 rotate-45"
          }`}
        >
          جديد
        </span>
      )}
      {!program.isNew && program.discount && (
        <span
          className={`absolute top-3 grid size-14 place-items-center rounded-full bg-destructive text-xs font-black leading-tight text-primary-foreground ${
            isWide ? "left-3" : "right-3"
          }`}
        >
          خصم
          <br />
          {program.discount}%
        </span>
      )}

      <span
        className={`absolute top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-3 py-1.5 text-xs font-bold text-navy shadow-sm ${
          isWide ? "right-3" : "left-3"
        }`}
      >
        <MapPin size={14} className="text-brand" />
        {program.city}
      </span>

      <span
        className={`absolute bottom-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-3 py-1.5 text-xs font-bold text-navy shadow-sm ${
          isWide ? "left-3" : "right-3"
        }`}
      >
        <User size={14} className="text-brand" />
        {program.audience}
      </span>

      <span
        className={`absolute bottom-3 rounded-full px-4 py-1.5 text-xs font-bold text-primary-foreground ${
          program.kind === "دبلوم" ? "bg-brand" : "bg-gold"
        } ${isWide ? "right-3" : "left-3"}`}
      >
        {program.kind}
      </span>
    </div>
  );
}

export function PriceRow({ label, fee }: { label: string; fee: number }) {
  return (
    <div className="flex items-stretch gap-2">
      <div className="flex flex-1 items-center justify-between gap-2 rounded-xl bg-brand-soft px-3 py-2">
        <span className="text-xs font-bold text-muted-foreground">{label}</span>
        <span className="text-sm font-black text-brand">{fmt(fee)} ريال</span>
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 rounded-xl bg-gold/10 px-3 py-2">
        <span className="text-xs font-bold text-muted-foreground">عمولتك</span>
        <span className="text-sm font-black text-destructive">{fmt(commissionOf(fee))} ريال</span>
      </div>
    </div>
  );
}

export function WidePricePill({ label, fee }: { label: string; fee: number }) {
  return (
    <div className="flex overflow-hidden rounded-2xl">
      <div className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-brand/10 px-3 py-2.5">
        <span className="text-[11px] font-bold text-brand/80">{label}</span>
        <span className="text-sm font-black text-brand">{fmt(fee)} ريال</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-destructive/10 px-3 py-2.5">
        <span className="text-[11px] font-bold text-destructive/80">عمولتك</span>
        <span className="text-sm font-black text-destructive">{fmt(commissionOf(fee))} ريال</span>
      </div>
    </div>
  );
}

export function PublishButton() {
  return (
    <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-sm font-black text-primary-foreground transition-colors hover:bg-navy">
      <Send size={17} />
      ابدأ النشر
    </button>
  );
}
