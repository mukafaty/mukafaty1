import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Home, UserCog, ClipboardList, GraduationCap, MonitorPlay, Megaphone,
  MapPin, CircleDollarSign, Star, FileText, Users, LogOut, Search, Bell,
  MessageSquareText, ChevronDown, Menu, X,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { logoutSupport } from "@/lib/support-auth.functions";
import { Button } from "@/components/ui/button";
import logo from "@/assets/admin/mukafaty-logo-white.png.asset.json";
import avatar from "@/assets/user-avatar.jpg.asset.json";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { title: "المسوقون (داخلي)", icon: UserCog },
  { title: "تسجيلات الاهتمام", icon: ClipboardList },
  { title: "المتدربون", icon: GraduationCap },
  { title: "البرامج التدريبية", icon: MonitorPlay },
  { title: "إدارة الإعلانات", icon: Megaphone },
  { title: "الفروع والمدن", icon: MapPin },
  { title: "المكافآت والمالية", icon: CircleDollarSign },
  { title: "المتميزون والجوائز", icon: Star },
  { title: "التقارير", icon: FileText },
  { title: "المستخدمون والصلاحيات", icon: Users },
];

function SidebarContent({ onNavigate, onLogout, pending }: { onNavigate?: () => void; onLogout: () => void; pending: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === "/support" || pathname === "/support/";
  return (
    <div className="flex h-full flex-col bg-admin-sidebar">
      <div className="flex h-[66px] shrink-0 items-center justify-center bg-admin-navy px-4">
        <img src={logo.url} alt="مكافآتي Mukafaty" className="h-11 w-auto object-contain" />
      </div>
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-4">
        <Button asChild variant="ghost" className={`flex h-auto w-full justify-start gap-3 rounded-xl px-4 py-3 text-[15px] font-bold ${active ? "bg-card text-admin-blue shadow-sm" : "text-admin-navy"} hover:bg-card/70`}>
          <Link to="/support" onClick={onNavigate}><Home size={21} /><span>الرئيسية</span></Link>
        </Button>
        {nav.map((item) => (
          <Button key={item.title} type="button" variant="ghost" className="flex h-auto w-full justify-start gap-3 whitespace-normal rounded-xl px-4 py-3 text-[15px] font-bold text-admin-navy transition-colors hover:bg-card/70 [&_svg]:size-[21px]">
            <item.icon size={21} className="text-admin-navy/80" />
            <span className="text-start">{item.title}</span>
          </Button>
        ))}
      </nav>
      <div className="border-t border-admin-navy/10 px-2 py-4">
        <Button variant="ghost" disabled={pending} onClick={onLogout} className="flex h-auto w-full justify-start gap-3 rounded-xl px-4 py-3 text-[15px] font-bold text-admin-navy hover:bg-card/70">
          <LogOut size={21} className="rotate-180" />
          <span>تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  );
}

export function SupportLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const logout = useServerFn(logoutSupport);
  const navigate = useNavigate();
  async function onLogout() {
    if (pending) return;
    setPending(true);
    setError(false);
    try {
      await logout();
      await navigate({ to: "/support-login", replace: true });
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }
  return (
    <div dir="rtl" className="min-h-screen w-full overflow-x-clip bg-admin-canvas font-sans text-admin-navy">
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-[240px] lg:block">
        <SidebarContent onLogout={onLogout} pending={pending} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-admin-navy/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[260px] shadow-xl">
            <Button variant="ghost" onClick={() => setOpen(false)} aria-label="إغلاق القائمة" className="absolute left-2 top-4 z-10 rounded-lg p-1.5 text-primary-foreground">
              <X size={20} />
            </Button>
            <SidebarContent onNavigate={() => setOpen(false)} onLogout={onLogout} pending={pending} />
          </div>
        </div>
      )}

      <div className="min-w-0 lg:mr-[240px]">
        <header className="sticky top-0 z-20 flex h-[66px] items-center gap-3 bg-admin-navy px-4 text-primary-foreground md:px-6">
          <Button variant="ghost" onClick={() => setOpen(true)} aria-label="فتح القائمة" className="shrink-0 rounded-lg p-2 lg:hidden hover:bg-admin-navy-soft">
            <Menu size={22} />
          </Button>
          <div className="relative hidden w-full max-w-[390px] sm:block">
            <input
              type="search"
              placeholder="ابحث في النظام..."
              className="h-10 w-full rounded-xl border border-primary-foreground/10 bg-admin-navy-soft ps-10 pe-4 text-sm text-primary-foreground placeholder:text-primary-foreground/60 outline-none focus:border-primary-foreground/30"
            />
            <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/70" />
          </div>
          <div className="ms-auto flex items-center gap-2 md:gap-4">
            <Button variant="ghost" aria-label="الرسائل" className="rounded-lg p-2 hover:bg-admin-navy-soft">
              <MessageSquareText size={21} />
            </Button>
            <Button variant="ghost" aria-label="التنبيهات" className="relative rounded-lg p-2 hover:bg-admin-navy-soft">
              <Bell size={21} />
              <span className="absolute right-1 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-admin-red px-1 text-[10px] font-bold">5</span>
            </Button>
            <DropdownMenu modal={false} dir="rtl">
              <DropdownMenuTrigger className="flex items-center gap-3 rounded-xl px-2 py-1 outline-none hover:bg-admin-navy-soft">
                <img src={avatar.url} alt="الدعم" className="h-10 w-10 rounded-full border-2 border-primary-foreground/80 object-cover" />
                <div className="hidden text-start leading-tight md:block">
                  <div className="text-sm font-bold">الدعم</div>
                </div>
                <ChevronDown size={16} className="hidden md:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="z-50 text-right">
                <DropdownMenuItem disabled={pending} onSelect={onLogout}>تسجيل الخروج</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="w-full min-w-0 max-w-full p-4 md:p-6">{error && <p role="alert" className="mb-4 text-sm text-destructive">تعذر تسجيل الخروج، حاول مرة أخرى.</p>}{children}</main>
      </div>
    </div>
  );
}
