import { MapPin, Send, User } from "lucide-react";
import { commissionOf, type Program } from "@/data/adsPrograms";

const fmt = (n: number) => n.toLocaleString("en-US");

export function CardMedia({ program, className }: { program: Program; className?: string }) {
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
        <span className="absolute right-0 top-0 h-0 w-0 border-l-[70px] border-t-[70px] border-l-transparent border-t-destructive" />
      )}
      {program.isNew && (
        <span className="absolute right-2 top-4 rotate-45 text-[11px] font-black text-primary-foreground">
          جديد
        </span>
      )}
      {!program.isNew && program.discount && (
        <span className="absolute right-3 top-3 grid size-14 place-items-center rounded-full bg-destructive text-xs font-black leading-tight text-primary-foreground">
          خصم
          <br />
          {program.discount}%
        </span>
      )}

      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-3 py-1.5 text-xs font-bold text-navy shadow-sm">
        <MapPin size={14} className="text-brand" />
        {program.city}
      </span>

      <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-3 py-1.5 text-xs font-bold text-navy shadow-sm">
        <User size={14} className="text-brand" />
        {program.audience}
      </span>

      <span
        className={`absolute left-3 bottom-3 rounded-full px-4 py-1.5 text-xs font-bold text-primary-foreground ${
          program.kind === "دبلوم" ? "bg-brand" : "bg-gold"
        }`}
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

export function PublishButton() {
  return (
    <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-sm font-black text-primary-foreground transition-colors hover:bg-navy">
      <Send size={17} />
      ابدأ النشر
    </button>
  );
}
