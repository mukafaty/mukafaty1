import { createFileRoute } from "@tanstack/react-router";
import {
  Share2,
  CheckCircle2,
  Globe,
  User,
  Users,
  Copy,
  Banknote,
  Gift,
} from "lucide-react";
import { toast } from "sonner";
import { quickShareAd, type SharePlatform } from "@/data/quickShareAd";
import { shareAd } from "@/lib/shareAd";
import whatsappIcon from "@/assets/social/whatsapp.jpg.asset.json";
import telegramIcon from "@/assets/social/telegram.jpg.asset.json";
import xIcon from "@/assets/social/x.jpg.asset.json";
import instagramIcon from "@/assets/social/instagram.jpg.asset.json";
import facebookIcon from "@/assets/social/facebook.jpg.asset.json";
import snapchatIcon from "@/assets/social/snapchat.jpg.asset.json";
import emailIcon from "@/assets/social/email.png.asset.json";
import { TiktokColorIcon } from "@/components/dashboard/SocialIcons";

export const Route = createFileRoute("/dashboard/quick-share")({
  head: () => ({
    meta: [
      { title: "نشر الإعلانات السريع | لوحة تحكم مكافآتي" },
      {
        name: "description",
        content:
          "شارك الإعلان عبر مواقع التواصل الاجتماعي واحصل على مكافأة مالية عند كل عملية تسجيل.",
      },
      { property: "og:title", content: "نشر الإعلانات السريع | لوحة تحكم مكافآتي" },
      {
        property: "og:description",
        content:
          "شارك الإعلان عبر مواقع التواصل الاجتماعي واحصل على مكافأة مالية عند كل عملية تسجيل.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuickSharePage,
});

type Platform = {
  label: string;
  image?: string;
  icon?: typeof TiktokColorIcon;
};

const platforms: Platform[] = [
  { label: "واتساب", image: whatsappIcon.url },
  { label: "تيليجرام", image: telegramIcon.url },
  { label: "منصة X", image: xIcon.url },
  { label: "إنستغرام", image: instagramIcon.url },
  { label: "فيسبوك", image: facebookIcon.url },
  { label: "تيك توك", icon: TiktokColorIcon },
  { label: "سناب شات", image: snapchatIcon.url },
  { label: "البريد الإلكتروني", image: emailIcon.url },
];

const REFERRAL_URL = "https://mukafaty.com/ref/ahmed2487";
const DISCOUNT_CODE = "AHMED15";

function CopyField({ value, label }: { value: string; label: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`تم نسخ ${label}`);
    } catch {
      toast.error("تعذر النسخ");
    }
  };

  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-bold text-navy">{label}</h3>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-border bg-muted/50 px-4 py-3">
          <p dir="ltr" className="truncate text-sm font-bold text-navy">
            {value}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-black text-primary-foreground transition-colors hover:bg-navy"
        >
          <Copy size={18} />
          نسخ
        </button>
      </div>
    </div>
  );
}

function QuickSharePage() {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500">
      {/* العنوان والوصف */}
      <header className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Share2 size={24} />
        </span>
        <div className="min-w-0 text-right">
          <h1 className="truncate text-2xl font-black text-navy sm:text-3xl">
            نشر الإعلانات السريع
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            شارك الإعلان عبر مواقع التواصل الاجتماعي واحصل على مكافأة مالية عند كل عملية تسجيل.
          </p>
        </div>
      </header>

      {/* البطاقة الكبيرة الرئيسية — 3 أعمدة */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-card sm:p-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr_200px] lg:gap-4 xl:grid-cols-[280px_1fr_220px]">
          {/* العمود الأول — معلومات البرنامج (يمين في RTL) */}
          <div className="order-2 flex flex-col justify-between gap-5 lg:order-1 lg:border-l lg:border-border lg:pl-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-black text-emerald-700">
                <CheckCircle2 size={18} />
                متاح للنشر
              </div>

              <h2 className="text-lg font-black leading-snug text-navy">
                دبلوم إدارة الموارد البشرية عن بُعد
              </h2>

              <div className="space-y-3 text-sm font-bold text-navy">
                <span className="flex items-center gap-2">
                  <Globe size={18} className="shrink-0 text-brand" />
                  عن بُعد - جميع أرجاء المملكة
                </span>
                <span className="flex items-center gap-2">
                  <User size={18} className="shrink-0 text-brand" />
                  الفئة المستهدفة رجال
                </span>
                <span className="flex items-center gap-2">
                  <Users size={18} className="shrink-0 text-brand" />
                  الفئة العمرية 18 إلى 40 عام
                </span>
              </div>
            </div>

            {/* بطاقات الأسعار */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-muted/40 p-3 text-center">
                <div className="mb-1 flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground">
                  <Banknote size={14} className="text-brand" />
                  الرسوم كاش
                </div>
                <p className="text-base font-black text-navy sm:text-lg">
                  9,500 ريال
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-3 text-center">
                <div className="mb-1 flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground">
                  <Gift size={14} className="text-brand" />
                  المكافأة لكل تسجيل
                </div>
                <p className="text-base font-black text-red-600 sm:text-lg">
                  475 ريال
                </p>
              </div>
            </div>
          </div>

          {/* العمود الثاني — صورة الإعلان (وسط) */}
          <div className="order-1 flex items-center justify-center lg:order-2">
            <img
              src={adAsset.url}
              alt="إعلان دبلوم إدارة الموارد البشرية عن بُعد"
              width={619}
              height={1100}
              className="h-auto max-h-[520px] w-auto max-w-full rounded-xl object-contain sm:max-h-[640px] lg:max-h-[560px]"
              style={{ aspectRatio: "619 / 1100" }}
            />
          </div>

          {/* العمود الثالث — مشاركة الإعلان (يسار في RTL) */}
          <div className="order-3 lg:border-r lg:border-border lg:pr-4">
            <h3 className="mb-4 text-center text-base font-black text-navy lg:text-right">
              شارك الإعلان
            </h3>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8 lg:flex lg:flex-col lg:gap-2.5">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.label}
                    type="button"
                    onClick={() => toast.info(`مشاركة عبر ${platform.label}`)}
                    className="group flex flex-col items-center gap-1.5 rounded-2xl border border-border p-2 transition-all duration-200 hover:border-brand/40 hover:bg-muted/40 lg:flex-row lg:rounded-full lg:p-1.5"
                  >
                    {platform.image ? (
                      <img
                        src={platform.image}
                        alt={platform.label}
                        className="size-10 shrink-0 rounded-full object-cover shadow-sm transition-transform duration-200 group-hover:scale-110"
                      />
                    ) : Icon ? (
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white shadow-sm transition-transform duration-200 group-hover:scale-110">
                        <Icon size={38} />
                      </span>
                    ) : null}
                    <span className="text-center text-xs font-bold text-navy lg:text-right">
                      {platform.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* رابط الإحالة وكود الخصم */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <CopyField value={REFERRAL_URL} label="رابط الإحالة" />
        <CopyField value={DISCOUNT_CODE} label="كود الخصم" />
      </div>
    </section>
  );
}
