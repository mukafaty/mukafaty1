import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Program } from "@/data/adsPrograms";
import { SquareProgramCard } from "./SquareProgramCard";

const ROW_OPTIONS = [1, 2, 3, 4];

export function AdsGrid({ programs }: { programs: Program[] }) {
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
      <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-sm font-bold text-muted-foreground">
        لا توجد برامج مطابقة لخيارات البحث.
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

      <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        {/* عرض عدد الأسطر */}
        <label className="inline-flex items-center gap-2 text-sm font-bold text-navy">
          <span>عرض عدد الأسطر</span>
          <span className="relative inline-flex">
            <select
              value={rows}
              onChange={(e) => {
                setRows(Number(e.target.value));
                setPage(1);
              }}
              className="h-10 appearance-none rounded-xl border border-border bg-card pl-9 pr-4 text-sm font-bold text-navy outline-none focus:border-brand"
            >
              {ROW_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </span>
        </label>

        {/* ترقيم الصفحات */}
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
