import { useState, type ReactNode } from "react";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import avatarAsset from "@/assets/user-avatar.jpg.asset.json";
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
              <img
                src={avatarAsset.url}
                alt="صورة أحمد السبيعي"
                width={80}
                height={80}
                loading="lazy"
                className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
              />
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

      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-sm lg:px-8">
          <p>منصة مكافآتي للتسويق بالعمولة | جميع الحقوق محفوظة 2026</p>
          <a
            href="https://www.mkafaati.com"
            dir="ltr"
            className="font-bold text-navy transition-colors duration-200 hover:text-brand"
          >
            www.mkafaati.com
          </a>
        </div>
      </footer>
    </div>
  );
}
