import { GraduationCap, FileText } from "lucide-react";
import { CountUp } from "@/components/dashboard/CountUp";

type Stat = { id: string; label: string; value: number };

const ICONS: Record<string, typeof GraduationCap> = {
  diplomas: GraduationCap,
  courses: FileText,
};

export function AdsStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
      {stats.map((s) => {
        const Icon = ICONS[s.id] ?? GraduationCap;
        return (
          <div
            key={s.id}
            className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
              <Icon size={26} />
            </span>
            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-bold text-muted-foreground">{s.label}</p>
              <CountUp value={s.value} className="text-3xl font-black text-navy" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
