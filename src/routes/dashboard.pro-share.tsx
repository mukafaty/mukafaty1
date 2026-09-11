import { createFileRoute } from "@tanstack/react-router";
import {
  Share2,
  CheckCircle2,
  MapPin,
  User,
  Users,
  Banknote,
  Gift,
  Link2,
  Image as ImageIcon,
  Video,
  FileText,
  ChevronLeft,
  Globe,
} from "lucide-react";
import { professionalShareData } from "@/data/proShareAd";
import whatsappIcon from "@/assets/social/whatsapp.jpg.asset.json";
import telegramIcon from "@/assets/social/telegram.jpg.asset.json";
import xIcon from "@/assets/social/x.jpg.asset.json";
import instagramIcon from "@/assets/social/instagram.jpg.asset.json";
import facebookIcon from "@/assets/social/facebook.jpg.asset.json";
import snapchatIcon from "@/assets/social/snapchat.jpg.asset.json";
import emailIcon from "@/assets/social/email.png.asset.json";
import linkedinIcon from "@/assets/social/linkedin.png.asset.json";
import { TiktokColorIcon } from "@/components/dashboard/SocialIcons";

export const Route = createFileRoute("/dashboard/pro-share")({
  head: () => ({
    meta: [
      { title: "النشر الاحترافي | لوحة تحكم مكافآتي" },
      {
        name: "description",
        content: "شارك الإعلان بسهولة عبر مختلف منصات التواصل الاجتماعي.",
      },
      { property: "og:title", content: "النشر الاحترافي | لوحة تحكم مكافآتي" },
      {
        property: "og:description",
        content: "شارك الإعلان بسهولة عبر مختلف منصات التواصل الاجتماعي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProSharePage,
});

const socialIcons = [
  { src: whatsappIcon.url, alt: "واتساب" },
  { src: telegramIcon.url, alt: "تيليجرام" },
  { src: xIcon.url, alt: "منصة X" },
  { src: instagramIcon.url, alt: "إنستغرام" },
  { src: facebookIcon.url, alt: "فيسبوك" },
  { icon: TiktokColorIcon, alt: "تيك توك" },
  { src: snapchatIcon.url, alt: "سناب شات" },
  { src: linkedinIcon.url, alt: "لينكد إن" },
  { src: emailIcon.url, alt: "البريد الإلكتروني" },
];

function ActionCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 p-4 transition-colors hover:border-brand/30 hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon size={20} />
        </span>
        <div>
          <h4 className="text-sm font-black text-navy">{title}</h4>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <ChevronLeft
        size={18}
        className="shrink-0 text-muted-foreground transition-colors group-hover:text-brand"
      />
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold text-navy">
      <Icon size={18} className="shrink-0 text-brand" />
      <span className="text-muted-foreground">{label}</span>
      <span className="mr-1">{value}</span>
    </div>
  );
}

function ProSharePage() {
  const ad = professionalShareData;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500">
      {/* العنوان والوصف */}
      <header className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Share2 size={24} />
        </span>
        <div className="min-w-0 text-right">
          <h1 className="truncate text-2xl font-black text-navy sm:text-3xl">
            النشر الاحترافي
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            شارك الإعلان بسهولة عبر مختلف منصات التواصل الاجتماعي
          </p>
        </div>
      </header>

      {/* البطاقة الرئيسية — 3 أعمدة */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-card sm:p-5 lg:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* العمود الأول — معلومات الإعلان (يمين في RTL) */}
          <div className="order-1 flex flex-col gap-5 lg:order-3 lg:border-l lg:border-border lg:pl-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-black text-emerald-700">
                <CheckCircle2 size={18} />
                متاح للنشر
              </div>

              <h2 className="text-lg font-black leading-snug text-navy">
                {ad.programName}
              </h2>

              <div className="space-y-3">
                <InfoRow icon={MapPin} label="المدينة" value={ad.location} />
                <InfoRow
                  icon={User}
                  label="الفئة المستهدفة"
                  value={ad.targetAudience}
                />
                <InfoRow
                  icon={Users}
                  label="الفئة العمرية"
                  value={ad.ageRange}
                />
              </div>
            </div>

            {/* بطاقات الرسوم والمكافأة */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/40 p-4 text-center">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                  <Banknote size={14} className="text-brand" />
                  الرسوم كاش
                </div>
                <p className="text-base font-black text-navy sm:text-lg">
                  {ad.cashFee}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/40 p-4 text-center">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                  <Gift size={14} className="text-brand" />
                  المكافأة لكل تسجيل
                </div>
                <p className="text-base font-black text-red-600 sm:text-lg">
                  {ad.commission}
                </p>
              </div>
            </div>

            {/* بطاقات الإجراءات الثلاث */}
            <div id="referral-section" className="space-y-3">
              <ActionCard
                icon={Link2}
                title="رابط الإحالة وكود الخصم"
                description="نسخ رابط الإحالة أو كود الخصم"
              />
              <ActionCard
                icon={ImageIcon}
                title="تحميل الإعلان"
                description="اختر حجم الإعلان المناسب للمنصة التي ترغب بالنشر عليها"
              />
              <ActionCard
                icon={Video}
                title="تحميل فيديو"
                description="حمّل فيديو الإعلان واستخدمه في منصات التواصل الاجتماعي"
              />
            </div>
          </div>

          {/* العمود الثاني — النصوص التسويقية (الوسط) */}
          <div className="order-2 flex flex-col gap-5 lg:order-2 lg:border-l lg:border-border lg:pl-6">
            <div className="flex items-center gap-2 text-lg font-black text-navy">
              <FileText size={22} className="text-brand" />
              النصوص التسويقية
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-navy">نص الإعلان</label>
              <div className="min-h-[220px] overflow-auto rounded-2xl border border-border bg-muted/30 p-4 text-sm leading-7 text-navy">
                {ad.marketingText.split("\n").map((line, i) => (
                  <p key={i} className={line.startsWith("✓") ? "font-bold" : ""}>
                    {line}
                  </p>
                ))}
              </div>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-black text-primary-foreground transition-colors hover:bg-[#FF0000] hover:text-white"
              >
                نسخ النص
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-navy">
                نص خاص بمنصة X
              </label>
              <div className="min-h-[120px] overflow-auto rounded-2xl border border-border bg-muted/30 p-4 text-sm leading-7 text-navy">
                {ad.xText.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-black text-primary-foreground transition-colors hover:bg-[#FF0000] hover:text-white"
                >
                  نسخ نص X
                </button>
                <span className="shrink-0 text-xs font-bold text-muted-foreground">
                  124 / 280
                </span>
              </div>
            </div>
          </div>

          {/* العمود الثالث — صورة الإعلان (يسار في RTL) */}
          <div className="order-3 flex flex-col gap-5 lg:order-1">
            <div className="overflow-hidden rounded-2xl border border-border bg-muted/20 p-3">
              <img
                src={ad.mainAdImage}
                alt="إعلان دبلوم إدارة الموارد البشرية"
                width={619}
                height={1100}
                className="h-auto max-h-[520px] w-full rounded-xl object-contain sm:max-h-[640px] lg:max-h-[480px]"
              />
            </div>

            <p className="text-center text-sm font-medium text-muted-foreground lg:text-right">
              حمّل المحتوى المناسب لكل منصة ثم اضغط على المنصة المناسبة أسفل
              الصفحة.
            </p>

            {/* أيقونات التواصل كعنصر بصري فقط */}
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {socialIcons.map((item, idx) =>
                item.src ? (
                  <img
                    key={idx}
                    src={item.src}
                    alt={item.alt}
                    className="size-10 rounded-full border border-border object-cover shadow-sm"
                  />
                ) : item.icon ? (
                  <span
                    key={idx}
                    className="grid size-10 place-items-center rounded-full border border-border bg-white shadow-sm"
                  >
                    <item.icon size={1} className="h-7 w-7" />
                  </span>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
