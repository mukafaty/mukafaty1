import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  GraduationCap,
  Laptop,
  Loader2,
  TrendingUp,
} from "lucide-react";
import bannerAsset from "@/assets/landing/banner.jpg.asset.json";
import diplomaAdAsset from "@/assets/landing/HR-diploma-ad.jpg.asset.json";
import diplomaOgAsset from "@/assets/landing/HR-diploma-1to1.png.asset.json";
import { Button } from "@/components/ui/button";
import {
  calculateFinalPrice,
  findActiveDiscountForMarketer,
  findDiscountCode,
  findMarketerByReferralCode,
  getAdProgram,
  isDiscountValid,
  SITE_ORIGIN,
  toAbsoluteUrl,
  type AttributionState,
} from "@/data/adReferral";

export const Route = createFileRoute("/ad/$slug")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? (search["ref"] as string) : undefined,
    platform: typeof search["platform"] === "string" ? (search["platform"] as string) : undefined,
  }),
  loaderDeps: ({ search }) => ({ ref: search.ref, platform: search.platform }),
  loader: ({ params, deps }) => {
    const ad = getAdProgram(params.slug);
    const query = new URLSearchParams();
    if (deps.ref) query.set("ref", deps.ref);
    if (deps.platform) query.set("platform", deps.platform);
    const qs = query.toString();
    return {
      ogTitle: ad.ogTitle,
      ogDescription: ad.ogDescription,
      ogImage: toAbsoluteUrl(ad.ogImage),
      ogUrl: `${SITE_ORIGIN}/ad/${ad.slug}${qs ? `?${qs}` : ""}`,
      canonical: `${SITE_ORIGIN}/ad/${ad.slug}`,
    };
  },
  head: ({ loaderData }) => {
    const data = loaderData ?? {
      ogTitle: "دبلوم إدارة الموارد البشرية - عن بُعد",
      ogDescription: "انتقل بمستواك المهني إلى مستويات جديدة من الإدارة والتميز",
      ogImage: toAbsoluteUrl(diplomaAdAsset.url),
      ogUrl: `${SITE_ORIGIN}/ad/hr-diploma`,
      canonical: `${SITE_ORIGIN}/ad/hr-diploma`,
    };
    return {
      meta: [
        { title: data.ogTitle },
        { name: "description", content: data.ogDescription },
        { property: "og:site_name", content: "مكافآتي" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: data.ogTitle },
        { property: "og:description", content: data.ogDescription },
        { property: "og:image", content: data.ogImage },
        { property: "og:image:secure_url", content: data.ogImage },
        { property: "og:url", content: data.ogUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: data.ogTitle },
        { name: "twitter:description", content: data.ogDescription },
        { name: "twitter:image", content: data.ogImage },
      ],
      links: [{ rel: "canonical", href: data.canonical }],
    };
  },
  component: AdLandingPage,
});


const features = [
  {
    label: "شهادة جامعية متوسطة معتمدة",
    icon: GraduationCap,
    color: "bg-brand-soft text-brand",
  },
  { label: "79 وحدة تدريبية", icon: BookOpen, color: "bg-emerald-50 text-emerald-700" },
  { label: "مدة البرنامج عامين ونصف", icon: Clock3, color: "bg-brand-soft text-brand" },
  { label: "التدريب عن بُعد", icon: Laptop, color: "bg-sky-50 text-sky-700" },
  {
    label: "معتمد في القطاعات الحكومية والعسكرية",
    icon: Building2,
    color: "bg-emerald-50 text-emerald-700",
  },
  { label: "إمكانية التجسير للبكالوريوس", icon: TrendingUp, color: "bg-emerald-50 text-emerald-700" },
  { label: "إمكانية التقسيط", icon: CreditCard, color: "bg-brand-soft text-brand" },
] as const;

const inputClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/15";

const inputErrorClass = "border-destructive focus:border-destructive focus:ring-destructive/15";

function FieldLabel({ children, required = false }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-xs font-bold text-navy">
      {children}
      {required ? <span className="mr-1 text-destructive">*</span> : null}
    </label>
  );
}

const PHONE_REGEX = /^(\+?\d[\d\s-]{7,14})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  fullName?: string;
  city?: string;
  phone?: string;
  email?: string;
}

function AdLandingPage() {
  const { slug } = Route.useParams();
  const { ref, platform } = Route.useSearch();

  const program = useMemo(() => getAdProgram(slug), [slug]);
  const refMarketer = useMemo(() => findMarketerByReferralCode(ref), [ref]);

  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [manualAttribution, setManualAttribution] = useState<AttributionState | null>(null);

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const attribution: AttributionState = useMemo(() => {
    if (refMarketer) {
      const autoDiscount = findActiveDiscountForMarketer(refMarketer.id, program.slug);
      return {
        marketerId: refMarketer.id,
        referralCode: refMarketer.referralCode,
        discountCode: autoDiscount?.code ?? null,
        discountPercentage: autoDiscount?.discountPercentage ?? null,
        campaignName: autoDiscount?.campaignName ?? null,
        platform: platform ?? null,
      };
    }
    if (manualAttribution) return { ...manualAttribution, platform: platform ?? null };
    return {
      marketerId: null,
      referralCode: null,
      discountCode: null,
      discountPercentage: null,
      campaignName: null,
      platform: platform ?? null,
    };
  }, [refMarketer, manualAttribution, platform, program.slug]);

  const discountPercentage = attribution.discountPercentage;
  const finalPrice =
    discountPercentage != null ? calculateFinalPrice(program.cashFee, discountPercentage) : null;
  const formatPrice = (value: number) => new Intl.NumberFormat("en-US").format(value);

  const applyCode = () => {
    const value = codeInput.trim();
    if (!value) {
      setCodeError(null);
      setManualAttribution(null);
      return;
    }

    const discount = findDiscountCode(value);
    if (discount && isDiscountValid(discount, program.slug)) {
      setCodeError(null);
      setManualAttribution({
        marketerId: discount.marketerId,
        referralCode: null,
        discountCode: discount.code,
        discountPercentage: discount.discountPercentage,
        campaignName: discount.campaignName,
        platform: platform ?? null,
      });
      return;
    }

    const marketer = findMarketerByReferralCode(value);
    if (marketer) {
      setCodeError(null);
      setManualAttribution({
        marketerId: marketer.id,
        referralCode: marketer.referralCode,
        discountCode: null,
        discountPercentage: null,
        campaignName: null,
        platform: platform ?? null,
      });
      return;
    }

    setManualAttribution(null);
    setCodeError("كود الإحالة أو الخصم غير صحيح.");
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!fullName.trim()) next.fullName = "الرجاء تعبئة هذا الحقل.";
    if (!city.trim()) next.city = "الرجاء تعبئة هذا الحقل.";
    if (!phone.trim()) next.phone = "الرجاء تعبئة هذا الحقل.";
    else if (!PHONE_REGEX.test(phone.trim())) next.phone = "يرجى إدخال رقم جوال صحيح.";
    if (email.trim() && !EMAIL_REGEX.test(email.trim()))
      next.email = "يرجى إدخال بريد إلكتروني صحيح.";
    return next;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (codeError) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const payload = {
      adSlug: program.slug,
      marketerId: attribution.marketerId,
      referralCode: attribution.referralCode,
      discountCode: attribution.discountCode,
      discountPercentage: attribution.discountPercentage ?? 0,
      campaignName: attribution.campaignName,
      platform: attribution.platform,
      customerData: {
        fullName: fullName.trim(),
        city: city.trim(),
        phone: phone.trim(),
        email: email.trim(),
      },
    };
    // Mock Submit — سيتم الربط بقاعدة البيانات لاحقًا
    console.log("Mock submit payload:", payload);

    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  return (

    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-brand-soft/35 text-foreground">
      <header className="border-b border-border/70 bg-brand-soft/55">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-5 sm:h-16 sm:px-8 lg:px-12">
          <a href="#contact" className="text-sm font-bold text-navy transition-colors hover:text-brand">
            تواصل معنا
          </a>
        </div>
      </header>

      <main>
        <section aria-label="الجهات المعتمدة" className="bg-[#f6fbfe]">
          <img
            src={bannerAsset.url}
            alt="شعارات الجهات والمعاهد المعتمدة لبرنامج الدبلوم"
            width={1920}
            height={480}
            className="mx-auto block h-auto w-full max-w-[1200px] object-contain"
          />
        </section>

        <section className="bg-navy px-5 py-8 text-center sm:py-10 lg:py-11">
          <h1 className="text-2xl font-black leading-tight text-primary-foreground sm:text-3xl lg:text-4xl">
            دبلوم إدارة الموارد البشرية - عن بُعد
          </h1>
          <p className="mt-3 text-sm font-bold text-primary-foreground/90 sm:text-base lg:text-lg">
            انتقل بمستواك المهني إلى مستويات جديدة من الإدارة والتميز
          </p>
        </section>

        <section aria-label="مميزات البرنامج" className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-7">
            {features.map(({ label, icon: Icon, color }) => (
              <article
                key={label}
                className="flex min-h-32 flex-col items-center justify-start rounded-lg border border-border/80 bg-card px-2 py-4 text-center shadow-sm sm:min-h-36 sm:px-3 sm:py-5"
              >
                <span className={`grid size-11 shrink-0 place-items-center rounded-full sm:size-12 ${color}`}>
                  <Icon size={23} strokeWidth={2.1} aria-hidden="true" />
                </span>
                <p className="mt-3 text-xs font-bold leading-5 text-navy sm:text-sm">{label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 pt-1 sm:px-6 sm:pb-16 lg:px-10">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] lg:gap-7" dir="ltr">
            <div className="min-w-0 lg:col-start-1" dir="rtl">
              <img
                src={diplomaAdAsset.url}
                alt="إعلان دبلوم إدارة الموارد البشرية بنمط التدريب عن بُعد"
                width={619}
                height={1100}
                className="mx-auto block h-auto w-full max-w-[619px] border border-navy/30 object-contain lg:max-h-[800px] lg:w-auto"
              />
            </div>

            <section
              aria-labelledby="registration-title"
              className="min-w-0 rounded-3xl border border-brand/35 bg-card px-5 py-7 shadow-sm sm:px-8 sm:py-9 lg:col-start-2"
              dir="rtl"
            >
              {submitted ? (
                <div className="flex min-h-72 flex-col items-center justify-center py-6 text-center">
                  <span className="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={38} aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-xl font-black text-navy sm:text-2xl">
                    تم إرسال طلب التسجيل بنجاح 🎉
                  </h2>
                  <p className="mt-3 max-w-sm text-sm font-medium leading-7 text-muted-foreground">
                    شكرًا لاهتمامك بالبرنامج. تم استلام بياناتك بنجاح وسيتم التواصل معك لاستكمال إجراءات التسجيل.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center sm:text-right">
                    <span className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-brand-soft text-brand sm:mx-0">
                      <Award size={25} aria-hidden="true" />
                    </span>
                    <h2 id="registration-title" className="text-2xl font-black text-navy sm:text-3xl">
                      سجّل الآن
                    </h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                      أدخل بياناتك وسوف يتم التواصل معك لاستكمال إجراءات التسجيل.
                    </p>
                  </div>


                  <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
                    <div>
                      <FieldLabel required>الاسم الكامل</FieldLabel>
                      <input
                        className={`${inputClass} ${errors.fullName ? inputErrorClass : ""}`}
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={fullName}
                        onChange={(event) => {
                          setFullName(event.target.value);
                          if (event.target.value.trim()) clearError("fullName");
                        }}
                      />
                      {errors.fullName ? (
                        <p className="mt-2 text-xs font-bold text-destructive">{errors.fullName}</p>
                      ) : null}
                    </div>
                    <div>
                      <FieldLabel required>المدينة</FieldLabel>
                      <select
                        className={`${inputClass} ${errors.city ? inputErrorClass : ""}`}
                        value={city}
                        onChange={(event) => {
                          setCity(event.target.value);
                          if (event.target.value) clearError("city");
                        }}
                      >
                        <option value="" disabled>اختر المدينة</option>
                        <option>الرياض</option>
                        <option>جدة</option>
                        <option>مكة المكرمة</option>
                        <option>المدينة المنورة</option>
                        <option>مدينة أخرى</option>
                      </select>
                      {errors.city ? (
                        <p className="mt-2 text-xs font-bold text-destructive">{errors.city}</p>
                      ) : null}
                    </div>
                    <div>
                      <FieldLabel required>رقم الجوال</FieldLabel>
                      <input
                        className={`${inputClass} ${errors.phone ? inputErrorClass : ""}`}
                        type="tel"
                        inputMode="tel"
                        dir="ltr"
                        placeholder="05xxxxxxxx"
                        value={phone}
                        onChange={(event) => {
                          setPhone(event.target.value);
                          if (PHONE_REGEX.test(event.target.value.trim())) clearError("phone");
                        }}
                      />
                      {errors.phone ? (
                        <p className="mt-2 text-xs font-bold text-destructive">{errors.phone}</p>
                      ) : null}
                    </div>
                    <div>
                      <FieldLabel>البريد الإلكتروني</FieldLabel>
                      <input
                        className={`${inputClass} ${errors.email ? inputErrorClass : ""}`}
                        type="email"
                        dir="ltr"
                        placeholder="example@domain.com"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          const value = event.target.value.trim();
                          if (!value || EMAIL_REGEX.test(value)) clearError("email");
                        }}
                      />
                      {errors.email ? (
                        <p className="mt-2 text-xs font-bold text-destructive">{errors.email}</p>
                      ) : null}
                    </div>

                    {!refMarketer ? (
                      <div>
                        <FieldLabel>لديك كود إحالة أو خصم؟</FieldLabel>
                        <div className="flex gap-2">
                          <input
                            className={inputClass}
                            type="text"
                            value={codeInput}
                            onChange={(event) => {
                              setCodeInput(event.target.value);
                              if (!event.target.value.trim()) {
                                setCodeError(null);
                                setManualAttribution(null);
                              }
                            }}
                            placeholder="أدخل الكود"
                          />
                          <Button
                            type="button"
                            onClick={applyCode}
                            className="h-11 shrink-0 rounded-md bg-navy px-4 text-sm font-bold hover:bg-brand"
                          >
                            تطبيق
                          </Button>
                        </div>
                        {codeError ? (
                          <p className="mt-2 text-xs font-bold text-destructive">{codeError}</p>
                        ) : null}
                      </div>
                    ) : null}

                    {discountPercentage != null && finalPrice != null ? (
                      <div className="rounded-lg bg-emerald-50 px-4 py-3 text-center">
                        <p className="text-sm font-black text-emerald-700">
                          🎁 تم تطبيق خصم {discountPercentage}%
                        </p>
                        <p className="mt-1 text-xs font-bold text-navy">
                          <span className="text-muted-foreground line-through">
                            {formatPrice(program.cashFee)} ريال
                          </span>
                          <span className="mr-2">{formatPrice(finalPrice)} ريال</span>
                        </p>
                      </div>
                    ) : null}



                    <Button
                      type="submit"
                      disabled={submitting}
                      className="h-12 w-full rounded-lg bg-brand text-base font-black hover:bg-navy disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          جاري الإرسال...
                          <Loader2 size={19} className="animate-spin" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          إرسال
                          <ArrowLeft size={19} aria-hidden="true" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}

              <a href="#privacy" className="mt-4 block text-center text-xs font-bold text-navy underline underline-offset-4 hover:text-brand">
                للاطلاع على سياسة الخصوصية - اضغط هنا
              </a>
            </section>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-navy text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 py-7 text-center text-xs sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-8 sm:text-right lg:px-12">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-start">
            <a href="#terms" className="transition-opacity hover:opacity-75">الشروط والأحكام</a>
            <a id="privacy" href="#privacy" className="transition-opacity hover:opacity-75">سياسة الخصوصية</a>
            <a href="#contact" className="transition-opacity hover:opacity-75">تواصل معنا</a>
          </nav>
          <p className="font-medium">جميع الحقوق محفوظة © 2026</p>
        </div>
      </footer>
    </div>
  );
}
