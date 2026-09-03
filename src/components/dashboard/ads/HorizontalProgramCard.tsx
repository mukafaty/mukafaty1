import type { Program } from "@/data/adsPrograms";
import { CardMedia, WidePricePill, PublishButton } from "./ProgramCardParts";

export function HorizontalProgramCard({ program }: { program: Program }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardMedia program={program} className="aspect-[16/8]" layout="wide" />
      <div className="flex flex-1 flex-col gap-4 p-5 text-center">
        <h3 className="text-lg font-black text-navy sm:text-xl">{program.name}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <WidePricePill label="الرسوم كاش" fee={program.cashFee} />
          <WidePricePill label="الرسوم أقساط" fee={program.installmentFee} />
        </div>
        <p className="text-sm font-bold text-navy">{program.note}</p>
        <p className="text-xs text-muted-foreground">{program.tagline}</p>
        <div className="mt-auto pt-2">
          <PublishButton />
        </div>
      </div>
    </article>
  );
}
