import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const linkClass =
  "text-sm font-medium text-navy transition-colors duration-200 hover:text-brand";

export function Header() {
  const [open, setOpen] = useState(false);

  const nav = (
    <>
      <button
        className={linkClass}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setOpen(false);
        }}
      >
        الرئيسية
      </button>
      <button
        className={linkClass}
        onClick={() => {
          scrollTo("steps");
          setOpen(false);
        }}
      >
        عن البرنامج
      </button>
      <a href="/register" className={linkClass} onClick={() => setOpen(false)}>
        انضم الآن
      </a>
      <a href="/login" className={linkClass} onClick={() => setOpen(false)}>
        دخول
      </a>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-[80px] lg:px-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="shrink-0"
          aria-label="مكافآتي"
        >
          <img
            src={logoAsset.url}
            alt="شعار منصة مكافآتي"
            width={190}
            height={60}
            className="h-9 w-auto md:h-11"
          />
        </button>

        <nav className="hidden items-center gap-8 md:flex">{nav}</nav>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-navy md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col items-start gap-4 border-t border-border/60 bg-background px-6 py-5 md:hidden">
          {nav}
        </nav>
      )}
    </header>
  );
}
