import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import {
  adsPrograms,
  adsStats,
  AUDIENCES,
  CITIES,
  commissionOf,
  KINDS,
  MODES,
  SORTS,
} from "@/data/adsPrograms";
import { AdsStats } from "@/components/dashboard/ads/AdsStats";
import { AdsFilters, type FiltersState } from "@/components/dashboard/ads/AdsFilters";
import { AdsGrid } from "@/components/dashboard/ads/AdsGrid";

export const Route = createFileRoute("/dashboard/ads")({
  head: () => ({
    meta: [
      { title: "تسويق الإعلانات | لوحة تحكم مكافآتي" },
      {
        name: "description",
        content:
          "اختر البرنامج التدريبي الذي ترغب في الترويج له من بطاقات الدبلومات والدورات وابدأ بكسب المكافآت.",
      },
      { property: "og:title", content: "تسويق الإعلانات | لوحة تحكم مكافآتي" },
      {
        property: "og:description",
        content:
          "اختر البرنامج التدريبي الذي ترغب في الترويج له من بطاقات الدبلومات والدورات وابدأ بكسب المكافآت.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdsPage,
});

const INITIAL: FiltersState = { q: "", city: "", kind: "", mode: "", audience: "", sort: "" };

function AdsPage() {
  const [filters, setFilters] = useState<FiltersState>(INITIAL);

  const programs = useMemo(() => {
    const q = filters.q.trim();
    const list = adsPrograms.filter(
      (p) =>
        (!q || p.name.includes(q)) &&
        (!filters.city || p.city === filters.city) &&
        (!filters.kind || p.kind === filters.kind) &&
        (!filters.mode || p.mode === filters.mode) &&
        (!filters.audience || p.audience === filters.audience),
    );

    if (filters.sort === "جديد") {
      return [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    }
    if (filters.sort === "الأحدث") {
      return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    if (filters.sort === "الأعلى عمولة") {
      return [...list].sort((a, b) => commissionOf(b.cashFee) - commissionOf(a.cashFee));
    }
    return list;
  }, [filters]);

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-row-reverse sm:justify-end">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Megaphone size={24} />
        </span>
        <div className="min-w-0 text-right">
          <h1 className="truncate text-2xl font-black text-navy sm:text-3xl">تسويق الإعلانات</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            اختر البرنامج التدريبي الذي ترغب في الترويج له وابدأ بكسب المكافآت.
          </p>
        </div>
      </header>

      <AdsStats stats={adsStats} />

      <AdsFilters
        value={filters}
        onChange={setFilters}
        cities={CITIES}
        kinds={KINDS}
        modes={MODES}
        audiences={AUDIENCES}
        sorts={SORTS}
      />

      <AdsGrid programs={programs} />
    </section>
  );
}
