import { useState, type ReactNode } from "react";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div dir="rtl" lang="ar" className="min-h-screen overflow-x-hidden bg-brand-soft/50">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={logoAsset.url}
              alt="شعار منصة مكافآتي"
              width={190}
              height={60}
              className="h-9 w-auto shrink-0 md:h-11"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-navy transition-colors hover:bg-brand-soft"
              aria-label="الإشعارات"
            >
              <Bell size={22} />
              <span className="absolute right-1.5 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                3
              </span>
            </button>

            <div className="hidden h-8 w-px bg-border sm:block" />

            <button className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-soft text-sm font-bold text-navy">
                أ
              </span>
              <span className="hidden min-w-0 text-right leading-tight sm:block">
                <span className="block truncate text-sm font-bold text-navy">أحمد السبيعي</span>
                <span className="block truncate text-xs text-muted-foreground">مسوق خارجي</span>
              </span>
              <ChevronDown size={18} className="hidden shrink-0 text-muted-foreground sm:block" />
            </button>

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-navy lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="القائمة"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 right-0 w-[80%] max-w-xs p-3">
            <DashboardSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[1600px] gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <aside className="hidden w-[250px] shrink-0 lg:block">
          <div className="sticky top-[88px] h-[calc(100vh-108px)]">
            <DashboardSidebar />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
