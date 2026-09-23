import { FormEvent, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import workspaceImage from "@/assets/register-workspace.jpg";
import { supabase } from "@/integrations/supabase/client";
import { loadLoginEmail } from "@/lib/loginFlow";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_MESSAGE = "الرجاء تعبئة هذا الحقل.";
const FORMAT_MESSAGE = "الرجاء إدخال بريد إلكتروني صحيح.";
const FAILED_MESSAGE = "تعذر إرسال رابط الاستعادة حاليًا، يرجى المحاولة لاحقًا.";
const SUCCESS_MESSAGE = "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من بريدك.";

export function ForgotPasswordPageContent() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = loadLoginEmail();
    if (stored) setEmail(stored);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const normalized = email.trim().toLowerCase();
    if (normalized.length === 0) {
      setError(EMPTY_MESSAGE);
      setSuccess(false);
      return;
    }
    if (!EMAIL_PATTERN.test(normalized)) {
      setError(FORMAT_MESSAGE);
      setSuccess(false);
      return;
    }
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalized, {
        redirectTo: "https://mukafaty.com/reset-password",
      });
      if (resetError) {
        setError(FAILED_MESSAGE);
        return;
      }
      setSuccess(true);
    } catch {
      setError(FAILED_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      dir="rtl"
      lang="ar"
      className="grid min-h-screen w-full overflow-x-hidden bg-brand-soft/50 md:grid-cols-[56fr_44fr] md:[direction:ltr]"
    >
      <section
        dir="rtl"
        className="flex min-w-0 items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:order-2 lg:px-10 xl:px-14"
      >
        <div className="w-full max-w-[520px] rounded-3xl border border-border/70 bg-background px-6 py-7 shadow-[0_22px_60px_-42px_var(--navy)] sm:px-10 sm:py-9">
          <div className="flex justify-center">
            <img src={logoAsset.url} alt="شعار منصة مكافآتي" width={190} height={60} className="h-12 w-auto sm:h-14" />
          </div>

          <div className="mt-8 text-right">
            <h1 className="text-3xl font-black text-navy sm:text-4xl">استعادة كلمة المرور</h1>
            <p className="mt-2 text-base leading-7 text-muted-foreground sm:text-lg">
              أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.
            </p>
          </div>

          {success ? (
            <div className="mt-7">
              <p role="status" className="rounded-[10px] border border-register-input bg-muted/40 px-4 py-4 text-center text-sm font-bold leading-7 text-navy">
                {SUCCESS_MESSAGE}
              </p>
              <div className="pt-5 text-center">
                <Link to="/login" className="text-sm font-bold text-register-primary transition-colors">
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-7" noValidate onSubmit={handleSubmit}>
              <label htmlFor="forgot-email" className="mb-2 block text-sm font-bold text-navy">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail size={19} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  aria-invalid={error !== null}
                  aria-describedby={error ? "forgot-email-error" : undefined}
                  placeholder="مثال: example@gmail.com"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError(null);
                  }}
                  className={`h-[54px] w-full rounded-[10px] border bg-background pr-11 pl-4 text-right text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-register-primary/10 ${error ? "border-destructive focus:border-destructive" : "border-register-input focus:border-register-primary"}`}
                />
              </div>
              <div className="min-h-6 pt-1">
                {error && (
                  <p id="forgot-email-error" role="alert" className="text-sm font-medium text-destructive">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="h-14 w-full rounded-[10px] bg-register-primary text-base font-bold text-primary-foreground shadow-none hover:bg-register-primary-hover"
              >
                إرسال رابط الاستعادة
                <ArrowLeft size={18} />
              </Button>

              <div className="pt-4 text-center">
                <Link to="/login" className="text-sm font-bold text-register-primary transition-colors">
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>

      <section
        dir="rtl"
        className="relative min-h-[440px] min-w-0 overflow-hidden sm:min-h-[520px] md:order-1 md:min-h-screen"
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
            انشر .. تابع إنجازاتك .. تزيد أرباحك
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
