import { useState, useRef, useEffect, type ReactNode } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  Menu,
  X,
  User,
  Settings,
  Link as LinkIcon,
  LogOut,
  UserPlus,
  CircleDollarSign,
  UserCheck,
  Megaphone,
} from "lucide-react";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import avatarAsset from "@/assets/user-avatar.jpg.asset.json";
import { DashboardSidebar } from "./DashboardSidebar";
import { signOut } from "@/lib/temp-auth";

interface NotificationItem {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  time: string;
  unread: boolean;
  to: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    icon: UserPlus,
    title: "تم تسجيل عميل جديد",
    subtitle: "من خلال رابط الإحالة الخاص بك",
    time: "منذ 5 دقائق",
    unread: true,
    to: "/dashboard/clients",
  },
  {
    id: "2",
    icon: CircleDollarSign,
    title: "تمت إضافة مكافأة بقيمة 475 ريال",
    subtitle: "تمت إضافة المكافأة إلى رصيدك المالي",
    time: "منذ 15 دقيقة",
    unread: true,
    to: "/dashboard/balance",
  },
  {
    id: "3",
    icon: UserCheck,
    title: "تم تحديث حالة العميل محمد الحربي",
    subtitle: "تم تغيير الحالة إلى «تم التسجيل»",
    time: "منذ 25 دقيقة",
    unread: true,
    to: "/dashboard/clients",
  },
  {
    id: "4",
    icon: Megaphone,
    title: "برنامج جديد متاح للتسويق",
    subtitle: "دبلوم إدارة الأعمال متاح الآن",
    time: "منذ ساعة",
    unread: true,
    to: "/dashboard/ads",
  },
];

const accountLinks = [
  { icon: User, label: "الملف الشخصي", to: "/dashboard/settings" },
  { icon: Settings, label: "إعدادات الحساب", to: "/dashboard/settings" },
  { icon: LinkIcon, label: "رابط الإحالة الخاص بي", to: "/dashboard" },
  { icon: Bell, label: "إعدادات التنبيهات", to: "/dashboard/settings" },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setAccountOpen(false);
      }
    }

    if (notificationsOpen || accountOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notificationsOpen, accountOpen]);

  const openNotifications = () => {
    setNotificationsOpen(true);
    setAccountOpen(false);
  };

  const openAccount = () => {
    setAccountOpen(true);
    setNotificationsOpen(false);
  };

  const handleNotificationClick = (id: string, to: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    setNotificationsOpen(false);
    navigate({ to });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setNotificationsOpen(false);
  };

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
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={openNotifications}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-navy transition-colors hover:bg-brand-soft"
                aria-label="الإشعارات"
                aria-expanded={notificationsOpen}
                aria-haspopup="true"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-background shadow-card animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                    <h3 className="text-base font-bold text-navy">التنبيهات</h3>
                    <button
                      onClick={markAllAsRead}
                      className="text-sm font-semibold text-brand transition-colors hover:text-navy"
                    >
                      عرض كل التنبيهات
                    </button>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <button
                          key={notification.id}
                          onClick={() =>
                            handleNotificationClick(notification.id, notification.to)
                          }
                          className="relative flex w-full items-start gap-3 border-b border-border/60 px-4 py-3 text-right transition-colors last:border-b-0 hover:bg-brand-soft/40"
                        >
                          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                            <Icon size={18} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-navy">
                              {notification.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {notification.subtitle}
                            </p>
                            <p className="mt-1 text-[11px] text-muted-foreground/80">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-border/60 px-4 py-2.5">
                    <button
                      onClick={markAllAsRead}
                      className="w-full text-center text-sm font-semibold text-brand transition-colors hover:text-navy"
                    >
                      عرض كل التنبيهات
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden h-8 w-px bg-border sm:block" />

            {/* Account */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={openAccount}
                className="flex min-w-0 items-center gap-3"
                aria-label="حساب أحمد السبيعي"
                aria-expanded={accountOpen}
                aria-haspopup="true"
              >
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
                <ChevronDown
                  size={18}
                  className={`hidden shrink-0 text-muted-foreground transition-transform duration-200 sm:block ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-60 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-background shadow-card animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    {accountLinks.map((link, index) => {
                      const Icon = link.icon;
                      const isLast = index === accountLinks.length - 1;
                      return (
                        <Link
                          key={link.label}
                          to={link.to}
                          onClick={() => setAccountOpen(false)}
                          className={`flex items-center justify-between gap-3 px-4 py-2.5 text-right transition-colors hover:bg-brand-soft/40 ${
                            isLast ? "" : ""
                          }`}
                        >
                          <span className="text-sm font-bold text-navy">
                            {link.label}
                          </span>
                          <Icon size={18} className="shrink-0 text-brand" />
                        </Link>
                      );
                    })}

                    <div className="my-2 border-t border-border/60" />

                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        signOut();
                        navigate({ to: "/login", replace: true });
                      }}
                      className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-right transition-colors hover:bg-destructive/5"
                    >
                      <span className="text-sm font-bold text-destructive">
                        تسجيل الخروج
                      </span>
                      <LogOut size={18} className="shrink-0 text-destructive" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-navy lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="القائمة"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 right-0 w-[80%] max-w-xs p-3">
            <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
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
