import { ChevronDown, MapPin, LayoutGrid, User, Users, ArrowUpDown, Search, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FiltersState = {
  q: string;
  city: string;
  kind: string;
  mode: string;
  audience: string;
  sort: string;
};

type Props = {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  cities: string[];
  kinds: string[];
  modes: string[];
  audiences: string[];
  sorts: readonly string[];
};

function SelectBox({
  icon: Icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Icon
        size={17}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand"
      />
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full appearance-none rounded-2xl border border-border bg-card pr-10 pl-8 text-right text-[13px] font-bold text-navy outline-none transition-colors focus:border-brand"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

export function AdsFilters({
  value,
  onChange,
  onClear,
  hasActiveFilters,
  cities,
  kinds,
  modes,
  audiences,
  sorts,
}: Props) {
  const set = (patch: Partial<FiltersState>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="relative xl:order-1">
          <Search
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={value.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="بحث عن دورة أو دبلوم"
            className="h-12 w-full rounded-2xl border border-border bg-card pr-11 pl-4 text-right text-sm font-medium text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
          />
        </div>

        <div className="xl:order-2">
          <SelectBox
            icon={MapPin}
            label="المدينة"
            value={value.city}
            options={cities}
            onChange={(v) => set({ city: v })}
          />
        </div>
        <div className="xl:order-3">
          <SelectBox
            icon={LayoutGrid}
            label="نوع البرنامج"
            value={value.kind}
            options={kinds}
            onChange={(v) => set({ kind: v })}
          />
        </div>
        <div className="xl:order-4">
          <SelectBox
            icon={User}
            label="نمط التدريب"
            value={value.mode}
            options={modes}
            onChange={(v) => set({ mode: v })}
          />
        </div>
        <div className="xl:order-5">
          <SelectBox
            icon={Users}
            label="الفئة المستهدفة"
            value={value.audience}
            options={audiences}
            onChange={(v) => set({ audience: v })}
          />
        </div>
        <div className="xl:order-6">
          <SelectBox
            icon={ArrowUpDown}
            label="الترتيب"
            value={value.sort}
            options={sorts}
            onChange={(v) => set({ sort: v })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className={`inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-black transition-colors ${
            hasActiveFilters
              ? "bg-[#006BFE] text-white hover:bg-[#2789F2]"
              : "cursor-not-allowed bg-muted text-muted-foreground opacity-60"
          }`}
        >
          <X size={16} />
          مسح الفلاتر
        </button>
      </div>
    </div>
  );
}
