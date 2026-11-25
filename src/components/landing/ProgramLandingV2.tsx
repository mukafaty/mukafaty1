import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Monitor,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CityCombobox } from "@/components/landing/CityCombobox";
import topBgAsset from "@/assets/landing/top-bg.jpg.asset.json";
import {
  findActiveDiscountForMarketer,
  findMarketerByReferralCode,
  getAdProgram,
  type AttributionState,
} from "@/data/adReferral";
import {
  normalizeLandingV2Phone,
  validateLandingV2Form,
  type LandingProgramConfig,
  type LandingV2FormErrors,
} from "@/data/landingV2";

const PHONE_REGEX = /^(\+?\d[\d\s-]{7,14})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "h-11 w-full rounded-xl border border-landing-v2-border bg-card px-4 text-sm text-landing-v2-navy outline-none transition-colors placeholder:text-landing-v2-copy/70 focus:border-brand focus:ring-2 focus:ring-brand/15";
const inputErrorClass = "border-destructive focus:border-destructive focus:ring-destructive/15";

interface ProgramLandingV2Props {
  program: LandingProgramConfig;
  referralCode?: string | undefined;
  platform?: string | undefined;
}

function FieldLabel({
  children,
  htmlFor,
  required = false,
}: {
  children: ReactNode;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-xs font-bold text-landing-v2-navy">
      {children}
      {required ? <span className="mr-1 text-destructive">*</span> : null}
    </label>
  );
}

function HeroDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Monitor;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-2.5 sm:gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-landing-v2-sky text-primary-foreground shadow-sm sm:size-12 lg:size-[52px]">
        <Icon className="size-5 sm:size-6" strokeWidth={1.9} aria-hidden="true" />
      </span>
      <div className="min-w-0 text-right">
        <p className="landing-v2-light text-[10px] leading-4 text-landing-v2-detail sm:text-xs lg:text-sm">
          {label}
        </p>
        <p className="mt-0.5 text-[11px] font-bold leading-4 text-landing-v2-detail sm:text-xs lg:text-[15px]">
          {value}
        </p>
      </div>
    </div>
  );
}

export function ProgramLandingV2({ program, referralCode, platform }: ProgramLandingV2Props) {
  const adProgram = useMemo(() => getAdProgram(program.slug), [program.slug]);
  const refMarketer = useMemo(() => findMarketerByReferralCode(referralCode), [referralCode]);

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<LandingV2FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const attribution: AttributionState = useMemo(() => {
    if (refMarketer) {
      const autoDiscount = findActiveDiscountForMarketer(refMarketer.id, adProgram.slug);
      return {
        marketerId: refMarketer.id,
        referralCode: refMarketer.referralCode,
        discountCode: autoDiscount?.code ?? null,
        discountPercentage: autoDiscount?.discountPercentage ?? null,
        campaignName: autoDiscount?.campaignName ?? null,
        platform: platform ?? null,
      };
    }
    return {
      marketerId: null,
      referralCode: null,
      discountCode: null,
      discountPercentage: null,
      campaignName: null,
      platform: platform ?? null,
    };
  }, [refMarketer, platform, adProgram.slug]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateLandingV2Form({ fullName, city, phone, email });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const payload = {
      adSlug: adProgram.slug,
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
    // نفس الإرسال التجريبي الحالي إلى أن تُربط الصفحة الأصلية بقاعدة البيانات.
    console.log("Mock submit payload:", payload);

    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const clearError = (field: keyof LandingV2FormErrors) => {
    setErrors((previous) => (previous[field] ? { ...previous, [field]: undefined } : previous));
  };

  return (
    <div dir="rtl" className="landing-v2-font min-h-screen overflow-x-hidden bg-landing-v2-canvas text-foreground">
      <main>
        <section
          style={{ ["--landing-v2-hero-image" as string]: `url("${topBgAsset.url}")` }}
          className="landing-v2-hero px-5 py-12 text-center sm:px-8 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-[clamp(1.65rem,3.25vw,3.35rem)] font-black leading-[1.35] tracking-tight text-landing-v2-navy">
              {program.title}
            </h1>
            <p className="mx-auto mt-5 w-fit max-w-full rounded-full border border-card/80 bg-card/45 px-5 py-2.5 text-[clamp(0.95rem,1.85vw,1.85rem)] font-medium leading-relaxed text-landing-v2-subtitle shadow-sm sm:px-8">
              {program.subtitle}
            </p>

            <div className="mx-auto mt-9 grid max-w-4xl grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-6 lg:mt-10">
              <HeroDetail icon={Monitor} label="نمط التدريب" value={program.details.mode} />
              <HeroDetail icon={BadgeCheck} label="عدد الوحدات" value={program.details.units} />
              <HeroDetail icon={CalendarDays} label="الفئة المستهدفة" value={program.details.audience} />
              <HeroDetail icon={UsersRound} label="مدة التدريب" value={program.details.duration} />
            </div>
          </div>
        </section>

        <section aria-label="الاعتمادات" className="bg-card px-5 py-4 sm:px-8">
          <img
            src={program.accreditationLogos}
            alt={program.accreditationLogosAlt}
            width={906}
            height={86}
            className="mx-auto block h-auto w-full max-w-[906px] object-contain"
          />
        </section>

        <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="mx-auto grid w-full max-w-[1000px] overflow-hidden rounded-[28px] border border-landing-v2-border bg-card shadow-[0_10px_35px_-28px_var(--landing-v2-navy)] lg:min-h-[815px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section
              aria-labelledby="registration-v2-title"
              className="flex min-w-0 flex-col justify-center border-b border-landing-v2-border px-5 py-8 sm:px-9 sm:py-10 lg:border-b-0 lg:px-12"
            >
              <img
                src={program.providerLogo}
                alt={program.providerLogoAlt}
                width={371}
                height={114}
                className="mx-auto block h-auto w-full max-w-[340px] object-contain"
              />

              {submitted ? (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                  <span className="grid size-16 place-items-center rounded-full bg-brand-soft text-brand">
                    <CheckCircle2 size={38} aria-hidden="true" />
                  </span>
                  <h2 id="registration-v2-title" className="mt-5 text-2xl font-black text-landing-v2-navy sm:text-3xl">
                    تم إرسال طلب التسجيل بنجاح 🎉
                  </h2>
                  <p className="mt-3 max-w-sm text-sm font-medium leading-7 text-landing-v2-copy">
                    شكرًا لاهتمامك بالبرنامج. تم استلام بياناتك بنجاح وسيتم التواصل معك لاستكمال إجراءات التسجيل.
                  </p>
                </div>
              ) : (
                <div className="mt-10 lg:mt-16">
                  <div className="text-right">
                    <div className="flex items-center justify-start gap-2.5">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-landing-v2-detail/10 text-landing-v2-detail lg:size-11">
                        <Award className="size-6 lg:size-7" strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <h2 id="registration-v2-title" className="text-3xl font-black text-landing-v2-navy lg:text-4xl">
                        سجّل الآن
                      </h2>
                    </div>
                    <p className="mt-2 text-[11px] font-medium leading-6 text-landing-v2-copy sm:text-xs lg:whitespace-nowrap">
                      أدخل بياناتك وسوف يتم التواصل معك لاستكمال إجراءات التسجيل.
                    </p>
                  </div>

                  <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
                    <div>
                      <FieldLabel htmlFor="landing-v2-full-name" required>
                        الاسم الكامل
                      </FieldLabel>
                      <input
                        id="landing-v2-full-name"
                        name="fullName"
                        autoComplete="name"
                        className={`${inputClass} ${errors.fullName ? inputErrorClass : ""}`}
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={fullName}
                        aria-invalid={Boolean(errors.fullName)}
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
                      <FieldLabel htmlFor="landing-v2-city" required>
                        المدينة
                      </FieldLabel>
                      <CityCombobox
                        id="landing-v2-city"
                        value={city}
                        invalid={Boolean(errors.city)}
                        inputClassName={`${inputClass} ${errors.city ? inputErrorClass : ""}`}
                        onChange={(value) => {
                          setCity(value);
                          if (value.trim()) clearError("city");
                        }}
                      />
                      {errors.city ? (
                        <p className="mt-2 text-xs font-bold text-destructive">{errors.city}</p>
                      ) : null}
                    </div>

                    <div>
                      <FieldLabel htmlFor="landing-v2-phone" required>
                        رقم الجوال
                      </FieldLabel>
                      <input
                        id="landing-v2-phone"
                        name="phone"
                        lang="en"
                        autoComplete="tel"
                        className={`${inputClass} landing-v2-arial-field text-left ${errors.phone ? inputErrorClass : ""}`}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        dir="ltr"
                        placeholder="05XXXXXXXX"
                        value={phone}
                        aria-invalid={Boolean(errors.phone)}
                        onChange={(event) => {
                          const value = normalizeLandingV2Phone(event.target.value);
                          setPhone(value);
                          if (PHONE_REGEX.test(value)) clearError("phone");
                        }}
                      />
                      {errors.phone ? (
                        <p className="mt-2 text-xs font-bold text-destructive">{errors.phone}</p>
                      ) : null}
                    </div>

                    <div>
                      <FieldLabel htmlFor="landing-v2-email">البريد الإلكتروني</FieldLabel>
                      <input
                        id="landing-v2-email"
                        name="email"
                        autoComplete="email"
                        className={`${inputClass} text-right ${errors.email ? inputErrorClass : ""}`}
                        type="email"
                        dir="ltr"
                        placeholder="example@domain.com"
                        value={email}
                        aria-invalid={Boolean(errors.email)}
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

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="h-12 w-full rounded-full bg-brand text-base font-bold text-primary-foreground hover:bg-brand/90 disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          جاري الإرسال...
                          <Loader2 size={19} className="animate-spin" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          إرسال
                          <ArrowLeft size={17} aria-hidden="true" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </section>

            <div className="flex min-w-0 items-center justify-center p-5 sm:p-8 lg:px-0 lg:py-10">
              <div className="relative flex w-full justify-center lg:px-12">
                <span aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-px bg-landing-v2-sky/60 lg:block" />
                <div className="w-full max-w-[410px] lg:max-w-[450px]">
                <img
                  src={program.adImage}
                  alt={program.adImageAlt}
                  width={1080}
                  height={1920}
                  className="block h-auto max-h-[730px] w-full border border-landing-v2-border object-contain"
                />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="الجهات المشاركة" className="bg-card px-5 py-4 sm:px-8">
          <img
            src={program.partnerLogos}
            alt={program.partnerLogosAlt}
            width={1049}
            height={82}
            className="mx-auto block aspect-[906/86] h-auto w-full max-w-[906px] object-contain"
          />
        </section>
      </main>

      <footer id="contact" className="bg-landing-v2-navy text-primary-foreground">
        <div className="mx-auto flex min-h-28 w-full max-w-[1000px] flex-col items-center justify-center gap-5 px-5 py-7 text-center text-sm sm:flex-row sm:justify-between sm:px-8 sm:text-right">
          <p id="privacy" className="font-medium">
            جميع الحقوق محفوظة ©{" "}
            <span dir="ltr" lang="en" className="landing-v2-year inline-block">
              2026
            </span>
          </p>
          <nav aria-label="روابط قانونية" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <a href="#privacy" className="transition-opacity hover:opacity-75">
              سياسة الخصوصية
            </a>
            <span aria-hidden="true" className="h-4 w-px bg-primary-foreground/40" />
            <a id="terms" href="#terms" className="transition-opacity hover:opacity-75">
              الشروط والأحكام
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
