import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, UserRound, UserCog, ClipboardList, GraduationCap, MonitorPlay, Megaphone,
  MapPin, CircleDollarSign, Star, FileText, Users, Settings, LogOut, Search, Bell,
  MessageSquareText, ChevronDown, Menu, X,
} from "lucide-react";
import logo from "@/assets/admin/mukafaty-logo-white.png.asset.json";
import avatar from "@/assets/user-avatar.jpg.asset.json";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { title: "الرئيسية", icon: Home, to: "/admin" },
  { title: "المسوقون (خارجي)", icon: UserRound },
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
  { title: "الإعدادات", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col bg-admin-sidebar">
      <div className="flex h-[66px] shrink-0 items-center justify-center bg-admin-navy px-4">
        <img src={logo.url} alt="مكافآتي Mukafaty" className="h-11 w-auto object-contain" />
      </div>
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {nav.map((item) => {
          const active = item.to ? pathname === item.to || pathname === item.to + "/" : false;
          const cls = `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-bold transition-colors ${
            active ? "bg-card text-admin-blue shadow-sm" : "text-admin-navy hover:bg-card/70"
          }`;
          const inner = (
            <>
              <item.icon size={21} className={active ? "text-admin-blue" : "text-admin-navy/80"} />
              <span className="text-start">{item.title}</span>
            </>
          );
          return item.to ? (
            <Link key={item.title} to="/admin" onClick={onNavigate} className={cls}>{inner}</Link>
          ) : (
            <button key={item.title} type="button" className={cls}>{inner}</button>
          );
        })}
      </nav>
      <div className="border-t border-admin-navy/10 px-2 py-4">
        <Link to="/protect" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-bold text-admin-navy hover:bg-card/70">
          <LogOut size={21} className="rotate-180" />
          <span>تسجيل الخروج</span>
        </Link>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div dir="rtl" className="min-h-screen w-full overflow-x-clip bg-admin-canvas font-sans text-admin-navy">
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-[240px] lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-admin-navy/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[260px] shadow-xl">
            <button onClick={() => setOpen(false)} aria-label="إغلاق القائمة" className="absolute left-2 top-4 z-10 rounded-lg p-1.5 text-primary-foreground">
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0 lg:mr-[240px]">
        <header className="sticky top-0 z-20 flex h-[66px] items-center gap-3 bg-admin-navy px-4 text-primary-foreground md:px-6">
          <button onClick={() => setOpen(true)} aria-label="فتح القائمة" className="shrink-0 rounded-lg p-2 lg:hidden hover:bg-admin-navy-soft">
            <Menu size={22} />
          </button>
          <div className="relative hidden w-full max-w-[390px] sm:block">
            <input
              type="search"
              placeholder="ابحث في النظام..."
              className="h-10 w-full rounded-xl border border-primary-foreground/10 bg-admin-navy-soft ps-10 pe-4 text-sm text-primary-foreground placeholder:text-primary-foreground/60 outline-none focus:border-primary-foreground/30"
            />
            <Search size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/70" />
          </div>
          <div className="ms-auto flex items-center gap-2 md:gap-4">
            <button aria-label="الرسائل" className="rounded-lg p-2 hover:bg-admin-navy-soft">
              <MessageSquareText size={21} />
            </button>
            <button aria-label="التنبيهات" className="relative rounded-lg p-2 hover:bg-admin-navy-soft">
              <Bell size={21} />
              <span className="absolute right-1 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-admin-red px-1 text-[10px] font-bold">5</span>
            </button>
            <DropdownMenu modal={false} dir="rtl">
              <DropdownMenuTrigger className="flex items-center gap-3 rounded-xl px-2 py-1 outline-none hover:bg-admin-navy-soft">
                <img src={avatar.url} alt="أحمد المدير" className="h-10 w-10 rounded-full border-2 border-primary-foreground/80 object-cover" />
                <div className="hidden text-start leading-tight md:block">
                  <div className="text-sm font-bold">أحمد المدير</div>
                </div>
                <ChevronDown size={16} className="hidden md:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="z-50 text-right">
                <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
                <DropdownMenuItem>الإعدادات</DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/protect">تسجيل الخروج</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="w-full min-w-0 max-w-full p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
