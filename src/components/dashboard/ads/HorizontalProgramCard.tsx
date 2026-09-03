import type { Program } from "@/data/adsPrograms";
import { CardMedia, PriceRow, PublishButton } from "./ProgramCardParts";

export function HorizontalProgramCard({ program }: { program: Program }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardMedia program={program} className="aspect-square sm:aspect-[16/9] lg:aspect-[2/1]" />
      <div className="flex flex-1 flex-col gap-3 p-5 text-right">
        <h3 className="text-lg font-black text-navy sm:text-xl">{program.name}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <PriceRow label="الرسوم كـاش" fee={program.cashFee} />
          <PriceRow label="الرسوم أقساط" fee={program.installmentFee} />
        </div>
        <p className="text-sm font-bold text-navy">{program.tagline}</p>
        <p className="text-xs text-muted-foreground">{program.note}</p>
        <div className="mt-auto pt-1">
          <PublishButton />
        </div>
      </div>
    </article>
  );
}
