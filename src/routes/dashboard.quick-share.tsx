import { createFileRoute } from "@tanstack/react-router";
import {
  Share2,
  CheckCircle2,
  Globe,
  User,
  Users,
  Copy,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import adAsset from "@/assets/quick-share-ad.jpg.asset.json";
import {
  InstagramColorIcon,
  XColorIcon,
  FacebookColorIcon,
  SnapchatColorIcon,
  TiktokColorIcon,
} from "@/components/dashboard/SocialIcons";

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

function WhatsAppIcon({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.014 4.074h-.002C7.065 18.447 3.78 15.169 3.78 11.15c0-2.214 1.803-4.014 4.014-4.014 1.073 0 2.083.418 2.843 1.175l.76.758.758-.758a3.99 3.99 0 0 1 2.843-1.175c2.21 0 4.014 1.8 4.014 4.014 0 4.019-3.285 7.297-7.304 7.297M12 2C6.486 2 2 6.486 2 12c0 2.217.805 4.248 2.146 5.827L2 22l4.237-1.122A9.936 9.936 0 0 0 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2z"
      />
    </svg>
  );
}

function TelegramIcon({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M21.9 3.5L2.1 10.7c-.9.3-.9 1.5 0 1.8l4.8 1.5 1.9 5.9c.2.7 1.1.9 1.6.4l2.5-2.3 5 3.6c.6.4 1.5.1 1.6-.7l2.6-12.5c.2-1-.8-1.9-1.8-1.5zM8.5 13.5l9.5-5.9-7.1 7.9-.8 3.1-1.6-5.1z"
      />
    </svg>
  );
}

const platforms = [
  { label: "واتساب", icon: WhatsAppIcon, bg: "bg-[#25D366]", hover: "hover:bg-[#1DA851]" },
  { label: "تيليجرام", icon: TelegramIcon, bg: "bg-[#0088CC]", hover: "hover:bg-[#0077B3]" },
  { label: "منصة X", icon: XColorIcon, bg: "bg-white", hover: "hover:bg-gray-100", iconClass: "text-black" },
  { label: "إنستغرام", icon: InstagramColorIcon, bg: "bg-white", hover: "hover:bg-gray-100" },
  { label: "فيسبوك", icon: FacebookColorIcon, bg: "bg-white", hover: "hover:bg-gray-100" },
  { label: "تيك توك", icon: TiktokColorIcon, bg: "bg-white", hover: "hover:bg-gray-100" },
  { label: "سناب شات", icon: SnapchatColorIcon, bg: "bg-white", hover: "hover:bg-gray-100" },
  { label: "البريد الإلكتروني", icon: Mail, bg: "bg-navy", hover: "hover:bg-navy-deep" },
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
    <div className="space-y-2">
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
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[140px_1fr]">
          {/* عمود المشاركة */}
          <div className="order-2 md:order-1">
            <h3 className="mb-4 text-center text-base font-black text-navy md:text-right">
              شارك الإعلان
            </h3>
            <div className="flex flex-row flex-wrap justify-center gap-4 md:flex-col md:items-center md:gap-5">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.label}
                    type="button"
                    onClick={() => toast.info(`مشاركة عبر ${platform.label}`)}
                    className="group flex flex-col items-center gap-2"
                  >
                    <span
                      className={`grid size-12 place-items-center rounded-full shadow-sm transition-transform duration-200 group-hover:scale-110 ${platform.bg} ${platform.hover}`}
                    >
                      <Icon
                        size={22}
                        className={platform.iconClass || "text-white"}
                      />
                    </span>
                    <span className="max-w-[72px] text-center text-xs font-bold text-navy">
                      {platform.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* صورة الإعلان */}
          <div className="order-1 flex items-center justify-center rounded-2xl bg-muted/30 p-2 md:order-2">
            <img
              src={adAsset.url}
              alt="إعلان دبلوم إدارة الموارد البشرية عن بُعد"
              width={619}
              height={1100}
              className="h-auto max-h-[520px] w-auto max-w-full rounded-xl object-contain"
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
