import { FormEvent, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import workspaceImage from "@/assets/register-workspace.jpg";
import { saveRegistrationFlow } from "@/lib/registrationFlow";

const NAME_EMPTY_MESSAGE = "الرجاء تعبئة هذا الحقل.";
const NAME_INVALID_MESSAGE = "الرجاء إدخال اسم صحيح.";
const PHONE_EMPTY_MESSAGE = "الرجاء تعبئة هذا الحقل.";
const PHONE_INVALID_MESSAGE = "الرجاء إدخال رقم جوال صحيح.";

const PHONE_PATTERN = /^05\d{8}$/;
// Accepts Arabic and English letters; rejects names made of digits only.
const HAS_LETTER_PATTERN = /\p{L}/u;

const FIELD_BASE_CLASS =
  "h-[54px] w-full rounded-[10px] border bg-background pr-11 pl-4 text-right text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-register-primary/10";

const FIELD_IDLE_CLASS = `${FIELD_BASE_CLASS} border-register-input focus:border-register-primary`;
const FIELD_ERROR_CLASS = `${FIELD_BASE_CLASS} border-destructive focus:border-destructive`;

export function ProfilePageContent() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setFullName(value);
    if (nameError) setNameError(null);
  }

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    if (phoneError) setPhoneError(null);
  }

  function handleNameBlur() {
    if (fullName.length === 0) return;
    const trimmed = fullName.trim();
    if (trimmed.length === 0) {
      setNameError(NAME_EMPTY_MESSAGE);
    } else if (!HAS_LETTER_PATTERN.test(trimmed)) {
      setNameError(NAME_INVALID_MESSAGE);
    }
  }

  function handlePhoneBlur() {
    if (phone.length === 0) return;
    if (!PHONE_PATTERN.test(phone)) setPhoneError(PHONE_INVALID_MESSAGE);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = fullName.trim();
    let nextNameError: string | null = null;
    if (trimmedName.length === 0) {
      nextNameError = NAME_EMPTY_MESSAGE;
    } else if (!HAS_LETTER_PATTERN.test(trimmedName)) {
      nextNameError = NAME_INVALID_MESSAGE;
    }

    let nextPhoneError: string | null = null;
    if (phone.length === 0) {
      nextPhoneError = PHONE_EMPTY_MESSAGE;
    } else if (!PHONE_PATTERN.test(phone)) {
      nextPhoneError = PHONE_INVALID_MESSAGE;
    }

    setNameError(nextNameError);
    setPhoneError(nextPhoneError);
    if (nextNameError || nextPhoneError) return;

    // Keep the email captured in /register and add this step's data.
    saveRegistrationFlow({ full_name: trimmedName, phone });
    // /password is the next step of the registration journey.
    navigate({ href: "/password" });
  }

  return (
    <main
      dir="rtl"
      lang="ar"
      className="grid min-h-screen w-full overflow-x-hidden bg-brand-soft/50 md:grid-cols-[44fr_56fr] md:[direction:ltr]"
    >
      <section
        dir="rtl"
        className="flex min-w-0 items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-14"
      >
        <div className="w-full max-w-[520px] rounded-3xl border border-border/70 bg-background px-6 py-7 shadow-[0_22px_60px_-42px_var(--navy)] sm:px-10 sm:py-9">
          <div className="flex justify-center">
            <img
              src={logoAsset.url}
              alt="شعار منصة مكافآتي"
              width={190}
              height={60}
              className="h-12 w-auto sm:h-14"
            />
          </div>

          <form className="mt-8" noValidate onSubmit={handleSubmit}>
            <label htmlFor="profile-full-name" className="mb-2 block text-sm font-bold text-navy">
              الاسم الكامل *
            </label>
            <div className="relative">
              <User
                size={19}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="profile-full-name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                aria-invalid={nameError !== null}
                aria-describedby={nameError ? "profile-full-name-error" : undefined}
                placeholder="أدخل الاسم الكامل"
                onChange={(event) => handleNameChange(event.target.value)}
                onBlur={handleNameBlur}
                className={nameError ? FIELD_ERROR_CLASS : FIELD_IDLE_CLASS}
              />
            </div>
            <div className="min-h-6 pt-1">
              {nameError && (
                <p id="profile-full-name-error" role="alert" className="text-sm font-medium text-destructive">
                  {nameError}
                </p>
              )}
            </div>

            <label htmlFor="profile-phone" className="mb-2 block text-sm font-bold text-navy">
              رقم الجوال *
            </label>
            <div className="relative">
              <Phone
                size={19}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="profile-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                required
                maxLength={10}
                value={phone}
                aria-invalid={phoneError !== null}
                aria-describedby={phoneError ? "profile-phone-error" : undefined}
                placeholder="05xxxxxxxx"
                onChange={(event) => handlePhoneChange(event.target.value)}
                onBlur={handlePhoneBlur}
                className={phoneError ? FIELD_ERROR_CLASS : FIELD_IDLE_CLASS}
              />
            </div>
            <div className="min-h-6 pt-1">
              {phoneError && (
                <p id="profile-phone-error" role="alert" className="text-sm font-medium text-destructive">
                  {phoneError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="h-14 w-full rounded-[10px] bg-register-primary text-base font-bold text-primary-foreground shadow-none hover:bg-register-primary-hover"
            >
              متابعة
              <ArrowLeft size={18} />
            </Button>
          </form>
        </div>
      </section>

      <section
        dir="rtl"
        className="relative min-h-[440px] min-w-0 overflow-hidden sm:min-h-[520px] md:min-h-screen"
        aria-label="مكافآتي للتسويق الرقمي"
      >
        <img
          src={workspaceImage}
          alt="مكتب حديث مع حاسب محمول يعرض لوحة أداء رقمية"
          width={1200}
          height={1400}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-background/20" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-background/60 via-background/20 to-transparent" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-start px-6 pt-12 text-right sm:px-8 sm:pt-14 lg:px-14 lg:pt-[14vh] xl:px-20">
          <h2 className="max-w-2xl text-3xl font-black leading-[1.3] text-navy sm:text-4xl lg:text-5xl">
            حوّل تأثيرك إلى مكافآت
          </h2>
          <p className="mt-3 max-w-xl text-base font-medium leading-8 text-navy/75 sm:text-xl">
            انضم الآن .. وقدم تجربة احترافية لجمهورك
          </p>
        </div>

        <img
          src={logoAsset.url}
          alt=""
          aria-hidden="true"
          width={190}
          height={60}
          className="absolute bottom-[25%] right-[13%] hidden h-5 w-auto opacity-90 md:block xl:h-6"
        />
      </section>
    </main>
  );
}
