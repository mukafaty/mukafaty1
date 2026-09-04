import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Info,
  Megaphone,
  Share2,
  Users,
  Wallet,
  Trophy,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";

export const dashboardNav = [
  { title: "الرئيسية", to: "/dashboard", icon: Home },
  { title: "عن البرنامج", to: "/dashboard/about", icon: Info },
  { title: "تسويق الإعلانات", to: "/dashboard/ads", icon: Megaphone },
  { title: "عملائي", to: "/dashboard/clients", icon: Users },
  { title: "رصيدي المالي", to: "/dashboard/balance", icon: Wallet },
  { title: "المتميزون", to: "/dashboard/top", icon: Trophy },
  { title: "تواصل معنا", to: "/dashboard/contact", icon: Mail },
  { title: "إعدادات الحساب", to: "/dashboard/settings", icon: Settings },
] as const;

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl bg-navy-deep p-4 text-primary-foreground">
      <nav className="flex flex-col gap-1.5">
        {dashboardNav.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-[15px] font-bold transition-colors duration-200 ${
                active
                  ? "bg-brand text-primary-foreground"
                  : "text-primary-foreground/80 hover:bg-white hover:text-destructive"
              }`}
            >
              <span>{item.title}</span>
              <item.icon
                size={20}
                className={`shrink-0 transition-colors duration-200 ${
                  active ? "" : "group-hover:text-brand"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      <Link
        to="/"
        onClick={onNavigate}
        className="group mt-6 flex items-center justify-between gap-3 rounded-2xl border border-primary-foreground/25 px-4 py-3 text-[15px] font-bold text-primary-foreground/90 transition-colors duration-200 hover:bg-white hover:text-destructive"
      >
        <span>تسجيل الخروج</span>
        <LogOut size={20} className="shrink-0 transition-colors duration-200 group-hover:text-brand" />
      </Link>
    </div>
  );
}
