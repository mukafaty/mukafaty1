import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
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
  ExternalLink,
  X as CloseIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import avatarAsset from "@/assets/user-avatar.jpg.asset.json";
import {
  InstagramColorIcon,
  XColorIcon,
  FacebookColorIcon,
  SnapchatColorIcon,
  TiktokColorIcon,
  YoutubeColorIcon,
  LinkedinColorIcon,
  WebsiteColorIcon,
} from "@/components/dashboard/SocialIcons";
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
  "gap-2 rounded-xl bg-navy-deep px-5 text-primary-foreground hover:bg-[#2789F2]";
const REQUIRED_MSG = "الرجاء تعبئة هذا الحقل.";
const errorRing = "border-destructive focus:border-destructive";

function Req() {
  return <span className="text-destructive"> *</span>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-semibold text-destructive">{message}</p>;
}


const STORAGE_KEY = "mukafaty:settings";

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
  { key: "instagram", label: "Instagram", icon: InstagramColorIcon, prefix: "https://instagram.com/" },
  { key: "x", label: "X (Twitter)", icon: XColorIcon, prefix: "https://x.com/" },
  { key: "facebook", label: "Facebook", icon: FacebookColorIcon, prefix: "https://facebook.com/" },
  { key: "snapchat", label: "Snapchat", icon: SnapchatColorIcon, prefix: "https://snapchat.com/" },
  { key: "tiktok", label: "TikTok", icon: TiktokColorIcon, prefix: "https://tiktok.com/" },
  { key: "youtube", label: "YouTube", icon: YoutubeColorIcon, prefix: "https://youtube.com/" },
  { key: "linkedin", label: "LinkedIn", icon: LinkedinColorIcon, prefix: "https://linkedin.com/in/" },
  { key: "website", label: "الموقع الشخصي (اختياري)", icon: WebsiteColorIcon, prefix: "https://" },
] as const;


const sectionLinks = [
  { id: "personal-data", label: "البيانات الشخصية" },
  { id: "login-data", label: "بيانات الدخول" },
  { id: "financial-data", label: "البيانات المالية" },
  { id: "social-links", label: "الروابط الشخصية" },
];

type Stored = {
  personal?: Record<string, string>;
  avatar?: string;
  loginEmail?: string;
  payoutMethod?: "bank" | "cash";
  financial?: Record<string, string>;
  socials?: Record<string, string>;
};

function readStored(): Stored {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Stored;
  } catch {
    return {};
  }
}

function persist(patch: Stored) {
  if (typeof window === "undefined") return;
  const next = { ...readStored(), ...patch };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className={sectionIconClass}>
        <Icon size={20} />
      </span>
      <h2 className="text-lg font-extrabold text-navy">{title}</h2>
    </div>
  );
}

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

  const [avatar, setAvatar] = useState<string>(avatarAsset.url);
  const fileRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  const [loginEmail, setLoginEmail] = useState("ahmed.alsobai@example.com");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ next: "", confirm: "" });

  const [payoutMethod, setPayoutMethod] = useState<"bank" | "cash">("bank");
  const [financial, setFinancial] = useState({
    beneficiary: "",
    bank: "",
    iban: "",
    ibanConfirm: "",
  });

  const [socials, setSocials] = useState<Record<string, string>>({});

  const [errors, setErrors] = useState<Record<string, string>>({});
  const clearError = (key: string) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  const collectRequired = (fields: Record<string, string>) => {
    const found: Record<string, string> = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (!String(value ?? "").trim()) found[key] = REQUIRED_MSG;
    });
    return found;
  };


  // استرجاع البيانات المحفوظة محليًا
  useEffect(() => {
    const stored = readStored();
    if (stored.personal) setPersonal((p) => ({ ...p, ...stored.personal }));
    if (stored.avatar) setAvatar(stored.avatar);
    if (stored.loginEmail) setLoginEmail(stored.loginEmail);
    if (stored.payoutMethod) setPayoutMethod(stored.payoutMethod);
    if (stored.financial) setFinancial((f) => ({ ...f, ...stored.financial }));
    if (stored.socials) setSocials(stored.socials);
  }, []);

  const setPersonalField = (key: keyof typeof personal, value: string) => {
    clearError(key);
    setPersonal((prev) => ({ ...prev, [key]: value }));
  };


  const handleAvatarFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار ملف صورة صالح.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setAvatar(url);
      persist({ avatar: url });
      toast.success("تم تغيير الصورة الشخصية بنجاح.");
    };
    reader.readAsDataURL(file);
  };

  const savePersonal = () => {
    const found = collectRequired({
      firstName: personal.firstName,
      lastName: personal.lastName,
      gender: personal.gender,
      birthDate: personal.birthDate,
      nationality: personal.nationality,
      phone: personal.phone,
      city: personal.city,
      email: personal.email,
    });
    if (Object.keys(found).length) {
      setErrors((prev) => ({ ...prev, ...found }));
      return;
    }
    if (personal.email && !/^\S+@\S+\.\S+$/.test(personal.email)) {
      toast.error("صيغة البريد الإلكتروني غير صحيحة.");
      return;
    }
    if (personal.phone && !/^05\d{8}$/.test(personal.phone.replace(/\s/g, ""))) {
      toast.error("رقم الجوال يجب أن يبدأ بـ 05 ويكون 10 أرقام.");
      return;
    }
    persist({ personal });
    toast.success("تم حفظ البيانات الشخصية بنجاح.");
  };

  const confirmEmailChange = () => {
    const found = collectRequired({
      newEmail: emailForm.next,
      confirmEmail: emailForm.confirm,
    });
    if (Object.keys(found).length) {
      setErrors((prev) => ({ ...prev, ...found }));
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(emailForm.next)) {
      toast.error("صيغة البريد الإلكتروني الجديد غير صحيحة.");
      return;
    }
    if (emailForm.next !== emailForm.confirm) {
      toast.error("البريد الإلكتروني الجديد وتأكيده غير متطابقين.");
      return;
    }
    setLoginEmail(emailForm.next);
    persist({ loginEmail: emailForm.next });
    setEmailForm({ next: "", confirm: "" });
    setEmailDialogOpen(false);
    toast.success("تم تغيير البريد الإلكتروني بنجاح.");
  };

  const changePassword = () => {
    const found = collectRequired({
      "pwd-current": passwords.current,
      "pwd-next": passwords.next,
      "pwd-confirm": passwords.confirm,
    });
    if (Object.keys(found).length) {
      setErrors((prev) => ({ ...prev, ...found }));
      return;
    }
    if (passwords.next.length < 8) {
      toast.error("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error("كلمة المرور الجديدة وتأكيدها غير متطابقين.");
      return;
    }
    setPasswords({ current: "", next: "", confirm: "" });
    toast.success("تم تغيير كلمة المرور بنجاح.");
  };

  const saveFinancial = () => {
    if (payoutMethod === "bank") {
      const found = collectRequired({
        beneficiary: financial.beneficiary,
        bank: financial.bank,
        iban: financial.iban,
        ibanConfirm: financial.ibanConfirm,
      });
      if (Object.keys(found).length) {
        setErrors((prev) => ({ ...prev, ...found }));
        return;
      }
      const iban = financial.iban.replace(/\s/g, "").toUpperCase();
      if (!/^SA\d{22}$/.test(iban)) {
        toast.error("رقم الآيبان غير صحيح (يبدأ بـ SA ويتكون من 24 خانة).");
        return;
      }
      if (iban !== financial.ibanConfirm.replace(/\s/g, "").toUpperCase()) {
        toast.error("رقم الآيبان وتأكيده غير متطابقين.");
        return;
      }
    }
    persist({ payoutMethod, financial });
    toast.success("تم حفظ البيانات المالية بنجاح.");
  };


  const saveSocials = () => {
    persist({ socials });
    toast.success("تم حفظ الروابط الشخصية بنجاح.");
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-3">
          <span className={sectionIconClass}>
            <Settings size={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">إعدادات الحساب</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">بيانات حسابك وتفضيلاتك.</p>
        <nav className="mt-3 flex flex-wrap items-center gap-2">
          {sectionLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className="rounded-xl border border-border px-3 py-1.5 text-sm font-bold text-navy transition-colors hover:border-brand hover:text-brand"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      {/* البيانات الشخصية */}
      <section id="personal-data" className={cardClass}>
        <SectionHeading icon={User} title="البيانات الشخصية" />

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label className={labelClass} htmlFor="firstName">الاسم الأول<Req /></Label>
                <Input
                  id="firstName"
                  value={personal.firstName}
                  onChange={(e) => setPersonalField("firstName", e.target.value)}
                  className={`h-11 rounded-xl ${errors.firstName ? errorRing : ""}`}
                />
                <FieldError message={errors.firstName} />
              </div>
              <div>
                <Label className={labelClass} htmlFor="lastName">اسم العائلة<Req /></Label>
                <Input
                  id="lastName"
                  value={personal.lastName}
                  onChange={(e) => setPersonalField("lastName", e.target.value)}
                  className={`h-11 rounded-xl ${errors.lastName ? errorRing : ""}`}
                />
                <FieldError message={errors.lastName} />
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
                <Label className={labelClass} htmlFor="gender">الجنس<Req /></Label>
                <select
                  id="gender"
                  className={`${selectClass} ${errors.gender ? errorRing : ""}`}
                  value={personal.gender}
                  onChange={(e) => setPersonalField("gender", e.target.value)}
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
                <FieldError message={errors.gender} />
              </div>
              <div>
                <Label className={labelClass} htmlFor="birthDate">تاريخ الميلاد<Req /></Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={personal.birthDate}
                  onChange={(e) => setPersonalField("birthDate", e.target.value)}
                  className={`h-11 rounded-xl ${errors.birthDate ? errorRing : ""}`}
                />
                <FieldError message={errors.birthDate} />
              </div>
              <div>
                <Label className={labelClass} htmlFor="nationality">الجنسية<Req /></Label>
                <select
                  id="nationality"
                  className={`${selectClass} ${errors.nationality ? errorRing : ""}`}
                  value={personal.nationality}
                  onChange={(e) => setPersonalField("nationality", e.target.value)}
                >
                  <option value="">اختر الجنسية</option>
                  {nationalities.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <FieldError message={errors.nationality} />
              </div>

              <div>
                <Label className={labelClass} htmlFor="phone">رقم الجوال<Req /></Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  placeholder="05XXXXXXXX"
                  value={personal.phone}
                  onChange={(e) => setPersonalField("phone", e.target.value)}
                  className={`h-11 rounded-xl ${errors.phone ? errorRing : ""}`}
                />
                <FieldError message={errors.phone} />
              </div>
              <div>
                <Label className={labelClass} htmlFor="city">المدينة<Req /></Label>
                <select
                  id="city"
                  className={`${selectClass} ${errors.city ? errorRing : ""}`}
                  value={personal.city}
                  onChange={(e) => setPersonalField("city", e.target.value)}
                >
                  <option value="">اختر المدينة</option>
                  {cities.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <FieldError message={errors.city} />
              </div>
              <div>
                <Label className={labelClass} htmlFor="email">البريد الإلكتروني<Req /></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ahmed.alsobai@example.com"
                  value={personal.email}
                  onChange={(e) => setPersonalField("email", e.target.value)}
                  className={`h-11 rounded-xl ${errors.email ? errorRing : ""}`}
                />
                <FieldError message={errors.email} />
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
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleAvatarFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="تغيير الصورة الشخصية"
              className="rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand"
            >
              <img
                src={avatar}
                alt="الصورة الشخصية"
                width={160}
                height={160}
                className="h-32 w-32 cursor-pointer rounded-full border border-border object-cover"
              />
            </button>
            <Button
              type="button"
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => fileRef.current?.click()}
            >
              <Camera size={16} />
              تغيير الصورة
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button type="button" className={saveBtnClass} onClick={savePersonal}>
            <Save size={16} />
            حفظ التغييرات
          </Button>
        </div>
      </section>

      {/* بيانات الدخول */}
      <section id="login-data" className={cardClass}>
        <SectionHeading icon={Lock} title="بيانات الدخول" />

        <div className="space-y-2">
          <Label className={labelClass} htmlFor="loginEmail">البريد الإلكتروني لتسجيل الدخول</Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              id="loginEmail"
              type="email"
              value={loginEmail}
              readOnly
              className="h-11 flex-1 rounded-xl"
            />
            <Button
              type="button"
              className={saveBtnClass}
              onClick={() => setEmailDialogOpen(true)}
            >
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
                  value={passwords[field.key]}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
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
          <Button type="button" className={saveBtnClass} onClick={changePassword}>
            <Lock size={16} />
            تغيير كلمة المرور
          </Button>
        </div>
      </section>

      {/* البيانات المالية */}
      <section id="financial-data" className={cardClass}>
        <SectionHeading icon={CreditCard} title="البيانات المالية" />

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
                className="h-4 w-4 shrink-0 accent-[var(--brand)]"
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
          <Button type="button" className={saveBtnClass} onClick={saveFinancial}>
            <Save size={16} />
            حفظ التغييرات
          </Button>
        </div>
      </section>

      {/* الروابط الشخصية */}
      <section id="social-links" className={cardClass}>
        <div className="mb-1 flex items-center gap-3">
          <span className={sectionIconClass}>
            <LinkIcon size={20} />
          </span>
          <h2 className="text-lg font-extrabold text-navy">الروابط الشخصية</h2>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">أضف روابط حساباتك الشخصية.</p>

        <div className="space-y-3">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            const value = (socials[platform.key] ?? "").trim();
            const fullUrl = value ? `${platform.prefix}${value.replace(/^\/+/, "")}` : "";
            return (
              <div key={platform.key} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* أيقونة واسم المنصة — أقصى اليمين */}
                <div className="flex w-full items-center gap-2 sm:w-[180px]">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center">
                    <Icon size={22} />
                  </span>
                  <span className="text-sm font-bold text-navy">{platform.label}</span>
                </div>

                {/* حقل اسم المستخدم */}
                <input
                  dir="rtl"
                  value={socials[platform.key] ?? ""}
                  onChange={(e) =>
                    setSocials((prev) => ({ ...prev, [platform.key]: e.target.value }))
                  }
                  placeholder={platform.key === "website" ? "أدخل رابط الموقع" : "أدخل اسم المستخدم"}
                  aria-label={`اسم المستخدم في ${platform.label}`}
                  className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-4 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                />

                {/* رابط المنصة الثابت */}
                <div className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-input bg-background px-4">
                  <span dir="ltr" className="truncate text-sm font-semibold text-navy-deep">
                    {platform.prefix}
                  </span>
                </div>

                {/* زر فتح الرابط — أقصى اليسار */}
                {fullUrl ? (
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-navy transition-colors hover:border-brand hover:text-brand sm:w-[130px]"
                  >
                    <ExternalLink size={16} />
                    فتح الرابط
                  </a>
                ) : (
                  <span
                    aria-disabled
                    className="inline-flex h-11 shrink-0 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-muted-foreground opacity-60 sm:w-[130px]"
                  >
                    <ExternalLink size={16} />
                    فتح الرابط
                  </span>
                )}
              </div>
            );
          })}
        </div>


        <div className="mt-6">
          <Button type="button" className={saveBtnClass} onClick={saveSocials}>
            <Save size={16} />
            حفظ التغييرات
          </Button>
        </div>
      </section>

      {/* نموذج تغيير البريد الإلكتروني */}
      {emailDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setEmailDialogOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-border/60 bg-background p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-extrabold text-navy">تغيير البريد الإلكتروني</h3>
              <button
                type="button"
                onClick={() => setEmailDialogOpen(false)}
                aria-label="إغلاق"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-brand"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className={labelClass} htmlFor="currentEmail">البريد الحالي</Label>
                <Input id="currentEmail" value={loginEmail} readOnly disabled className="h-11 rounded-xl bg-muted" />
              </div>
              <div>
                <Label className={labelClass} htmlFor="newEmail">البريد الإلكتروني الجديد</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={emailForm.next}
                  onChange={(e) => setEmailForm((p) => ({ ...p, next: e.target.value }))}
                  placeholder="name@example.com"
                  className="h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className={labelClass} htmlFor="confirmEmail">تأكيد البريد الإلكتروني الجديد</Label>
                <Input
                  id="confirmEmail"
                  type="email"
                  value={emailForm.confirm}
                  onChange={(e) => setEmailForm((p) => ({ ...p, confirm: e.target.value }))}
                  placeholder="name@example.com"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button type="button" className={saveBtnClass} onClick={confirmEmailChange}>
                <Mail size={16} />
                تأكيد التغيير
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setEmailDialogOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
