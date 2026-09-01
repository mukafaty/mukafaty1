import type { Program } from "@/data/adsPrograms";
import { SquareProgramCard } from "./SquareProgramCard";
import { HorizontalProgramCard } from "./HorizontalProgramCard";

type Row = { type: "horizontal"; item: Program } | { type: "square"; items: Program[] };

function buildRows(programs: Program[]): Row[] {
  const rows: Row[] = [];
  let bucket: Program[] = [];

  const flush = () => {
    while (bucket.length) {
      rows.push({ type: "square", items: bucket.splice(0, 3) });
    }
  };

  for (const p of programs) {
    if (p.cardType === "horizontal") {
      flush();
      rows.push({ type: "horizontal", item: p });
    } else {
      bucket.push(p);
      if (bucket.length === 3) flush();
    }
  }
  flush();
  return rows;
}

function AdsRow({ row }: { row: Row }) {
  if (row.type === "horizontal") {
    return <HorizontalProgramCard program={row.item} />;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {row.items.map((p) => (
        <SquareProgramCard key={p.id} program={p} />
      ))}
    </div>
  );
}

export function AdsGrid({ programs }: { programs: Program[] }) {
  const rows = buildRows(programs);

  if (!programs.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-sm font-bold text-muted-foreground">
        لا توجد برامج مطابقة لخيارات البحث.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {rows.map((row, i) => (
        <AdsRow key={i} row={row} />
      ))}
    </div>
  );
}
