import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Settings,
  User,
  Lock,
  CreditCard,
  Link as LinkIcon,
  Camera,
  Save,
  Mail,
  Eye,
  EyeOff,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import avatarAsset from "@/assets/user-avatar.jpg.asset.json";
import { SnapchatIcon, TiktokIcon, XIcon } from "@/components/dashboard/SocialIcons";
import {
  fetchBanks,
  fetchCities,
  fetchNationalities,
  fetchReferralSources,
  type LookupItem,
} from "@/lib/lookups";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "إعدادات الحساب | لوحة تحكم مكافآتي" },
      { name: "description", content: "بيانات حسابك وتفضيلاتك." },
      { property: "og:title", content: "إعدادات الحساب | لوحة تحكم مكافآتي" },
      { property: "og:description", content: "بيانات حسابك وتفضيلاتك." },
    ],
  }),
  component: SettingsPage,
});

const cardClass = "rounded-3xl border border-border/60 bg-background p-5 sm:p-6";
const sectionIconClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand";
const labelClass = "mb-1.5 block text-sm font-bold text-navy";
const selectClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-navy outline-none transition-colors focus:border-brand";
const saveBtnClass =
  "gap-2 rounded-xl bg-navy-deep px-5 text-primary-foreground hover:bg-navy";

/** يستخدم دالة جلب من طبقة الـ lookups (قابلة للاستبدال بقاعدة البيانات). */
function useLookup(loader: () => Promise<LookupItem[]>) {
  const [items, setItems] = useState<LookupItem[]>([]);
  useEffect(() => {
    let alive = true;
    loader().then((data) => {
      if (alive) setItems(data.filter((i) => i.isActive));
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return items;
}

const socialPlatforms = [
  { key: "instagram", label: "Instagram", icon: Instagram, prefix: "https://instagram.com/", placeholder: "ahmed_alsobai" },
  { key: "x", label: "X (Twitter)", icon: XIcon, prefix: "https://x.com/", placeholder: "ahmed_alsobai" },
  { key: "facebook", label: "Facebook", icon: Facebook, prefix: "https://facebook.com/", placeholder: "ahmed_alsobai" },
  { key: "snapchat", label: "Snapchat", icon: SnapchatIcon, prefix: "https://snapchat.com/add/", placeholder: "ahmed_alsobai" },
  { key: "tiktok", label: "TikTok", icon: TiktokIcon, prefix: "https://tiktok.com/@", placeholder: "ahmed_alsobai" },
  { key: "youtube", label: "YouTube", icon: Youtube, prefix: "https://youtube.com/@", placeholder: "ahmed_alsobai" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, prefix: "https://linkedin.com/in/", placeholder: "ahmed_alsobai" },
  { key: "website", label: "الموقع الشخصي", icon: Globe, prefix: "https://", placeholder: "ahmedalsobai.com" },
] as const;

function SettingsPage() {
  const nationalities = useLookup(fetchNationalities);
  const cities = useLookup(fetchCities);
  const referralSources = useLookup(fetchReferralSources);
  const banks = useLookup(fetchBanks);

  const [personal, setPersonal] = useState({
    firstName: "أحمد",
    lastName: "السبيعي",
    gender: "male",
    birthDate: "1992-05-15",
    nationality: "SA",
    phone: "",
    city: "",
    email: "",
    referralSource: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const [payoutMethod, setPayoutMethod] = useState<"bank" | "cash">("bank");
  const [financial, setFinancial] = useState({
    beneficiary: "",
    bank: "",
    iban: "",
    ibanConfirm: "",
  });

  const [socials, setSocials] = useState<Record<string, string>>({});

  const setPersonalField = (key: keyof typeof personal, value: string) =>
    setPersonal((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">إعدادات الحساب</h1>
        </div>
        <span className={sectionIconClass}>
          <Settings size={20} />
        </span>
      </div>

      {/* البيانات الشخصية */}
      <section className={cardClass}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-navy">البيانات الشخصية</h2>
          <span className={sectionIconClass}>
            <User size={20} />
          </span>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row-reverse">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label className={labelClass} htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  value={personal.firstName}
                  onChange={(e) => setPersonalField("firstName", e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className={labelClass} htmlFor="lastName">اسم العائلة</Label>
                <Input
                  id="lastName"
                  value={personal.lastName}
                  onChange={(e) => setPersonalField("lastName", e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className={labelClass} htmlFor="membership">رقم العضوية</Label>
                <Input
                  id="membership"
                  value="MK-MAR-0001"
                  readOnly
                  disabled
                  className="h-11 rounded-xl bg-muted text-muted-foreground"
                />
              </div>

              <div>
                <Label className={labelClass} htmlFor="gender">الجنس</Label>
                <select
                  id="gender"
                  className={selectClass}
                  value={personal.gender}
                  onChange={(e) => setPersonalField("gender", e.target.value)}
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <div>
                <Label className={labelClass} htmlFor="birthDate">تاريخ الميلاد</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={personal.birthDate}
                  onChange={(e) => setPersonalField("birthDate", e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className={labelClass} htmlFor="nationality">الجنسية</Label>
                <select
                  id="nationality"
                  className={selectClass}
                  value={personal.nationality}
                  onChange={(e) => setPersonalField("nationality", e.target.value)}
                >
                  <option value="">اختر الجنسية</option>
                  {nationalities.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className={labelClass} htmlFor="phone">رقم الجوال</Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  placeholder="05XXXXXXXX"
                  value={personal.phone}
                  onChange={(e) => setPersonalField("phone", e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className={labelClass} htmlFor="city">المدينة</Label>
                <select
                  id="city"
                  className={selectClass}
                  value={personal.city}
                  onChange={(e) => setPersonalField("city", e.target.value)}
                >
                  <option value="">اختر المدينة</option>
                  {cities.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className={labelClass} htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ahmed.alsobai@example.com"
                  value={personal.email}
                  onChange={(e) => setPersonalField("email", e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className={labelClass} htmlFor="referralSource">وسيلة المعرفة</Label>
              <select
                id="referralSource"
                className={selectClass}
                value={personal.referralSource}
                onChange={(e) => setPersonalField("referralSource", e.target.value)}
              >
                <option value="">اختر وسيلة المعرفة</option>
                {referralSources.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-3 lg:w-[190px]">
            <img
              src={avatarAsset.url}
              alt="الصورة الشخصية"
              width={160}
              height={160}
              className="h-32 w-32 rounded-full border border-border object-cover"
            />
            <Button type="button" variant="outline" className="gap-2 rounded-xl">
              <Camera size={16} />
              تغيير الصورة
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button type="button" className={saveBtnClass}>
            <Save size={16} />
            حفظ التغييرات
          </Button>
        </div>
      </section>

      {/* بيانات الدخول */}
      <section className={cardClass}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-navy">بيانات الدخول</h2>
          <span className={sectionIconClass}>
            <Lock size={20} />
          </span>
        </div>

        <div className="space-y-2">
          <Label className={labelClass} htmlFor="loginEmail">البريد الإلكتروني لتسجيل الدخول</Label>
          <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
            <Input
              id="loginEmail"
              type="email"
              defaultValue="ahmed.alsobai@example.com"
              className="h-11 flex-1 rounded-xl"
            />
            <Button type="button" variant="outline" className="gap-2 rounded-xl">
              <Mail size={16} />
              تغيير البريد الإلكتروني
            </Button>
          </div>
        </div>

        <h3 className="mb-3 mt-6 text-base font-extrabold text-navy">كلمة المرور</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { key: "current" as const, label: "كلمة المرور الحالية", placeholder: "أدخل كلمة المرور الحالية" },
            { key: "next" as const, label: "كلمة المرور الجديدة", placeholder: "أدخل كلمة المرور الجديدة" },
            { key: "confirm" as const, label: "تأكيد كلمة المرور الجديدة", placeholder: "أعد إدخال كلمة المرور الجديدة" },
          ].map((field) => (
            <div key={field.key}>
              <Label className={labelClass} htmlFor={`pwd-${field.key}`}>{field.label}</Label>
              <div className="relative">
                <Input
                  id={`pwd-${field.key}`}
                  type={showPassword[field.key] ? "text" : "password"}
                  placeholder={field.placeholder}
                  className="h-11 rounded-xl pl-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({ ...prev, [field.key]: !prev[field.key] }))
                  }
                  aria-label={showPassword[field.key] ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-brand"
                >
                  {showPassword[field.key] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button type="button" className={saveBtnClass}>
            <Lock size={16} />
            تغيير كلمة المرور
          </Button>
        </div>
      </section>

      {/* البيانات المالية */}
      <section className={cardClass}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-navy">البيانات المالية</h2>
          <span className={sectionIconClass}>
            <CreditCard size={20} />
          </span>
        </div>

        <p className={labelClass}>طريقة استلام المكافأة المالية</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { value: "bank" as const, label: "تحويل بنكي لحسابك الشخصي" },
            { value: "cash" as const, label: "استلامها كاش من أحد فروع شركة مهارات للتقنية وتنمية الموارد البشرية" },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold text-navy transition-colors ${
                payoutMethod === option.value ? "border-brand bg-brand-soft/40" : "border-border"
              }`}
            >
              <input
                type="radio"
                name="payoutMethod"
                value={option.value}
                checked={payoutMethod === option.value}
                onChange={() => setPayoutMethod(option.value)}
                className="h-4 w-4 shrink-0 accent-[hsl(var(--brand))]"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        {payoutMethod === "bank" && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label className={labelClass} htmlFor="beneficiary">اسم المستفيد الثلاثي</Label>
              <Input
                id="beneficiary"
                value={financial.beneficiary}
                onChange={(e) => setFinancial((p) => ({ ...p, beneficiary: e.target.value }))}
                placeholder="أحمد بن علي بن محمد السبيعي"
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <Label className={labelClass} htmlFor="bank">اسم البنك</Label>
              <select
                id="bank"
                className={selectClass}
                value={financial.bank}
                onChange={(e) => setFinancial((p) => ({ ...p, bank: e.target.value }))}
              >
                <option value="">اختر البنك</option>
                {banks.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className={labelClass} htmlFor="iban">رقم الآيبان (IBAN)</Label>
              <Input
                id="iban"
                dir="ltr"
                placeholder="SA12 8000 0000 6080 1012 3456"
                value={financial.iban}
                onChange={(e) => setFinancial((p) => ({ ...p, iban: e.target.value }))}
                className="h-11 rounded-xl text-right"
              />
            </div>
            <div>
              <Label className={labelClass} htmlFor="ibanConfirm">تأكيد رقم الآيبان (IBAN)</Label>
              <Input
                id="ibanConfirm"
                dir="ltr"
                placeholder="SA12 8000 0000 6080 1012 3456"
                value={financial.ibanConfirm}
                onChange={(e) => setFinancial((p) => ({ ...p, ibanConfirm: e.target.value }))}
                className="h-11 rounded-xl text-right"
              />
            </div>
          </div>
        )}

        <div className="mt-6">
          <Button type="button" className={saveBtnClass}>
            <Save size={16} />
            حفظ التغييرات
          </Button>
        </div>
      </section>

      {/* الروابط الشخصية */}
      <section className={cardClass}>
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-navy">الروابط الشخصية</h2>
          <span className={sectionIconClass}>
            <LinkIcon size={20} />
          </span>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">أضف روابط حساباتك الشخصية.</p>

        <div className="space-y-3">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            const value = (socials[platform.key] ?? "").trim();
            const fullUrl = value ? `${platform.prefix}${value.replace(/^\/+/, "")}` : "";
            return (
              <div key={platform.key} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex w-full items-center gap-2 sm:w-[190px]">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-bold text-navy">{platform.label}</span>
                </div>

                <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-xl border border-input bg-background focus-within:border-brand">
                  <span dir="ltr" className="shrink-0 border-l border-border/60 px-3 py-2.5 text-xs text-muted-foreground">
                    {platform.prefix}
                  </span>
                  <input
                    dir="ltr"
                    value={socials[platform.key] ?? ""}
                    onChange={(e) =>
                      setSocials((prev) => ({ ...prev, [platform.key]: e.target.value }))
                    }
                    placeholder={platform.placeholder}
                    aria-label={`رابط ${platform.label}`}
                    className="h-11 min-w-0 flex-1 bg-transparent px-3 text-right text-sm text-navy outline-none"
                  />
                </div>

                {fullUrl ? (
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm font-bold text-navy transition-colors hover:border-brand hover:text-brand"
                  >
                    <ExternalLink size={16} />
                    فتح الصفحة
                  </a>
                ) : (
                  <span
                    aria-disabled
                    className="inline-flex h-11 shrink-0 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm font-bold text-muted-foreground opacity-60"
                  >
                    <ExternalLink size={16} />
                    فتح الصفحة
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <Button type="button" className={saveBtnClass}>
            <Save size={16} />
            حفظ التغييرات
          </Button>
        </div>
      </section>
    </div>
  );
}
