import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { OTHER_CITY, SAUDI_CITIES, searchCities } from "@/data/saudiCities";

interface CityComboboxProps {
  id: string;
  value: string;
  invalid: boolean;
  inputClassName: string;
  onChange: (value: string) => void;
}

export function CityCombobox({ id, value, invalid, inputClassName, onChange }: CityComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isOther, setIsOther] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchCities(query), [query]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const pick = (city: string) => {
    setOpen(false);
    setQuery("");
    if (city === OTHER_CITY) {
      setIsOther(true);
      onChange("");
    } else {
      setIsOther(false);
      onChange(city);
    }
  };

  const label = isOther ? OTHER_CITY : value && SAUDI_CITIES.includes(value) ? value : "";

  return (
    <div ref={wrapRef} className="relative space-y-3">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid && !isOther}
        onClick={() => setOpen((o) => !o)}
        className={`${inputClassName} flex items-center justify-between text-right`}
      >
        <span className={label ? "" : "text-landing-v2-copy/70"}>{label || "اختر المدينة"}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-12 z-30 overflow-hidden rounded-xl border border-landing-v2-border bg-card shadow-lg">
          <div className="flex items-center gap-2 border-b border-landing-v2-border px-3">
            <Search size={15} className="text-landing-v2-copy" aria-hidden="true" />
            <input
              autoFocus
              aria-label="ابحث باسم المدينة"
              placeholder="ابحث باسم المدينة"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
                if (e.key === "Enter") {
                  e.preventDefault();
                  const first = results[0];
                  if (first) pick(first);
                }
              }}
              className="h-10 w-full bg-transparent text-sm text-landing-v2-navy outline-none placeholder:text-landing-v2-copy/70"
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
            {results.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  role="option"
                  aria-selected={c === value}
                  onClick={() => pick(c)}
                  className="w-full px-4 py-2 text-right text-sm text-landing-v2-navy hover:bg-landing-v2-canvas"
                >
                  {c}
                </button>
              </li>
            ))}
            {results.length === 0 ? (
              <li className="px-4 py-2 text-sm text-landing-v2-copy">لا توجد نتائج</li>
            ) : null}
            <li className="border-t border-landing-v2-border">
              <button
                type="button"
                role="option"
                aria-selected={isOther}
                onClick={() => pick(OTHER_CITY)}
                className="w-full px-4 py-2 text-right text-sm text-brand hover:bg-landing-v2-canvas"
              >
                {OTHER_CITY}
              </button>
            </li>
          </ul>
        </div>
      ) : null}

      {isOther ? (
        <input
          aria-label="اكتب اسم المدينة"
          aria-invalid={invalid}
          placeholder="اكتب اسم المدينة"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClassName}
        />
      ) : null}
    </div>
  );
}
