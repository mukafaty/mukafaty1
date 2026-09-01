import type { Program } from "@/data/adsPrograms";
import { CardMedia, PriceRow, PublishButton } from "./ProgramCardParts";

export function SquareProgramCard({ program }: { program: Program }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardMedia program={program} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col gap-3 p-4 text-right">
        <h3 className="text-base font-black text-navy">{program.name}</h3>
        <PriceRow label="الرسوم كـاش" fee={program.cashFee} />
        <PriceRow label="الرسوم أقساط" fee={program.installmentFee} />
        <p className="text-sm font-bold text-navy">{program.tagline}</p>
        <p className="text-xs text-muted-foreground">{program.note}</p>
        <div className="mt-auto pt-1">
          <PublishButton />
        </div>
      </div>
    </article>
  );
}
