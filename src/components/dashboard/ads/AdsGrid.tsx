import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Program } from "@/data/adsPrograms";
import { SquareProgramCard } from "./SquareProgramCard";
import emptySearchImg from "@/assets/empty-search.png";

const ROW_OPTIONS = [1, 2, 3, 4];

export function AdsGrid({
  programs,
  onReset,
}: {
  programs: Program[];
  onReset: () => void;
}) {
  const [rows, setRows] = useState(2);
  const [page, setPage] = useState(1);

  const perPage = rows * 3;
  const pageCount = Math.max(1, Math.ceil(programs.length / perPage));
  const currentPage = Math.min(page, pageCount);

  const visible = useMemo(
    () => programs.slice((currentPage - 1) * perPage, currentPage * perPage),
    [programs, currentPage, perPage],
  );

  if (!programs.length) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <img
          src={emptySearchImg}
          alt="لا توجد نتائج بحث"
          loading="lazy"
          width={1024}
          height={1024}
          className="h-40 w-40 object-contain"
        />
        <p className="text-base font-black text-navy">لا توجد نتائج مطابقة للبحث</p>
        <button
          onClick={onReset}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#006BFE] px-8 text-sm font-black text-white transition-colors hover:bg-[#FF0000]"
        >
          عرض جميع البرامج
        </button>
      </div>
    );
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <SquareProgramCard key={p.id} program={p} />
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* ترقيم الصفحات — يمين */}
        <nav className="flex items-center gap-2" aria-label="ترقيم الصفحات">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-10 items-center gap-1 rounded-xl border border-border bg-card px-4 text-sm font-bold text-navy transition-colors hover:border-brand disabled:opacity-40"
          >
            <ChevronRight size={16} />
            السابق
          </button>
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={`grid size-10 place-items-center rounded-xl border text-sm font-black transition-colors ${
                p === currentPage
                  ? "border-brand bg-brand text-primary-foreground"
                  : "border-border bg-card text-navy hover:border-brand"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={currentPage === pageCount}
            className="inline-flex h-10 items-center gap-1 rounded-xl border border-border bg-card px-4 text-sm font-bold text-navy transition-colors hover:border-brand disabled:opacity-40"
          >
            التالي
            <ChevronLeft size={16} />
          </button>
        </nav>
      </div>
    </div>
  );
}
