import { createFileRoute } from "@tanstack/react-router";
import {
  Share2,
  CheckCircle2,
  Globe,
  User,
  Users,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import adAsset from "@/assets/quick-share-ad.jpg.asset.json";
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

      {/* معلومات البرنامج */}
      <div className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-black text-emerald-700">
          <CheckCircle2 size={18} />
          متاح للنشر
        </div>

        <h2 className="text-lg font-black text-navy">
          دبلوم إدارة الموارد البشرية عن بُعد
        </h2>

        <div className="flex flex-wrap items-center gap-y-2 text-sm font-bold text-navy">
          <span className="inline-flex items-center gap-2">
            <Globe size={18} className="text-brand" />
            عن بُعد - جميع مدن المملكة
          </span>
          <span className="mx-3 hidden h-4 w-px bg-border sm:block" />
          <span className="inline-flex items-center gap-2">
            <User size={18} className="text-brand" />
            الفئة المستهدفة رجال
          </span>
          <span className="mx-3 hidden h-4 w-px bg-border sm:block" />
          <span className="inline-flex items-center gap-2">
            <Users size={18} className="text-brand" />
            الفئة العمرية 18 إلى 40 عام
          </span>
        </div>
      </div>

      {/* بطاقة الإعلان */}
      <div className="w-fit max-w-full overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto] md:gap-8">
          {/* قسم مشاركة الإعلان (يسار في RTL بعد الصورة) */}
          <div className="order-2 md:order-2">
            <h3 className="mb-4 text-center text-base font-black text-navy md:text-right">
              شارك الإعلان
            </h3>
            <div className="grid grid-cols-4 gap-3 md:flex md:flex-col md:gap-2.5">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.label}
                    type="button"
                    onClick={() => toast.info(`مشاركة عبر ${platform.label}`)}
                    className="group flex items-center gap-3 rounded-full border border-border px-2 py-1.5 transition-all duration-200 hover:border-brand/40 hover:bg-muted/40 md:px-2.5 md:py-1.5 flex-col md:flex-row max-md:rounded-2xl max-md:justify-center max-md:gap-1.5"
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
                    <span className="text-xs font-bold text-navy md:text-sm">
                      {platform.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* صورة الإعلان (يمين في RTL) */}
          <div className="order-1 flex items-center justify-center md:order-1">
            <img
              src={adAsset.url}
              alt="إعلان دبلوم إدارة الموارد البشرية عن بُعد"
              width={619}
              height={1100}
              className="h-auto max-h-[640px] w-auto max-w-full rounded-xl object-contain"
              style={{ aspectRatio: "619 / 1100" }}
            />
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
