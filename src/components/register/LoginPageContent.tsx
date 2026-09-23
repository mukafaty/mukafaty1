import { FormEvent, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { checkEmailRegistered } from "@/lib/emailAvailability.functions";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/googleAuth";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import workspaceImage from "@/assets/register-workspace.jpg";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.62A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.86A6 6 0 0 1 6.08 12c0-.65.11-1.28.31-1.86V7.52H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.48l3.34-2.62Z" />
      <path fill="#EA4335" d="M12 6.01c1.47 0 2.78.5 3.82 1.49l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.95 5.52l3.34 2.62C7.18 7.77 9.39 6.01 12 6.01Z" />
    </svg>
  );
}

export function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [checkError, setCheckError] = useState<null | "missing" | "failed">(null);
  const [checking, setChecking] = useState(false);
  const checkEmail = useServerFn(checkEmailRegistered);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    if (googleLoading) return;
    setGoogleError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setGoogleLoading(false);
      setGoogleError("تعذّر بدء تسجيل الدخول بحساب جوجل. حاول مرة أخرى.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checking) return;
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized)) {
      setEmailError(true);
      setCheckError(null);
      return;
    }
    setEmailError(false);
    setCheckError(null);
    setChecking(true);
    try {
      const { registered } = await checkEmail({ data: { email: normalized } });
      if (!registered) {
        setCheckError("missing");
        return;
      }
      // Registered email: ready for the password sign-in step (next phase).
    } catch {
      setCheckError("failed");
    } finally {
      setChecking(false);
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
            <img
              src={logoAsset.url}
              alt="شعار منصة مكافآتي"
              width={190}
              height={60}
              className="h-12 w-auto sm:h-14"
            />
          </div>

          <div className="mt-6 grid h-11 grid-cols-2 rounded-xl border border-border bg-muted/60 p-1">
            <span className="flex items-center justify-center rounded-lg bg-register-primary text-sm font-bold text-primary-foreground">
              تسجيل الدخول
            </span>
            <Button asChild variant="ghost" className="h-full rounded-lg font-medium text-navy transition-colors duration-200 hover:bg-background hover:text-register-danger">
              <Link to="/register">إنشاء حساب</Link>
            </Button>
          </div>

          <div className="mt-8 text-right">
            <h1 className="text-3xl font-black text-navy sm:text-4xl">حياك الله من جديد</h1>
            <p className="mt-2 text-base leading-7 text-muted-foreground sm:text-lg">
              تابع إنجازاتك ونمّي أرباحك
            </p>
          </div>

          <form className="mt-7" noValidate onSubmit={handleSubmit}>
            <label htmlFor="login-email" className="mb-2 block text-sm font-bold text-navy">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail
                size={19}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="login-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                aria-invalid={emailError || checkError !== null}
                aria-describedby={emailError || checkError ? "login-email-error" : undefined}
                placeholder="مثال: example@gmail.com"
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (emailError) setEmailError(false);
                  if (checkError) setCheckError(null);
                }}
                onBlur={() => {
                  if (email.length > 0) setEmailError(!EMAIL_PATTERN.test(email.trim()));
                }}
                className={`h-[54px] w-full rounded-[10px] border bg-background pr-11 pl-4 text-right text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-register-primary/10 ${emailError || checkError ? "border-destructive focus:border-destructive" : "border-register-input focus:border-register-primary"}`}
              />
            </div>
            <div className="min-h-6 pt-1">
              {emailError ? (
                <p id="login-email-error" role="alert" className="text-sm font-medium text-destructive">
                  الرجاء إدخال بريد إلكتروني صحيح.
                </p>
              ) : checkError === "missing" ? (
                <p id="login-email-error" role="alert" className="text-sm font-medium text-destructive">
                  البريد الإلكتروني غير مسجل،{" "}
                  <Link to="/register" className="font-bold underline underline-offset-2">
                    أنشئ حسابًا جديدًا
                  </Link>
                  .
                </p>
              ) : checkError === "failed" ? (
                <p id="login-email-error" role="alert" className="text-sm font-medium text-destructive">
                  تعذر التحقق من البريد الإلكتروني، حاول مرة أخرى.
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={checking}
              aria-busy={checking}
              className="h-14 w-full rounded-[10px] bg-register-primary text-base font-bold text-primary-foreground shadow-none hover:bg-register-primary-hover"
            >
              متابعة
              <ArrowLeft size={18} />
            </Button>
          </form>

          <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-sm text-muted-foreground">
            <span className="h-px bg-border" aria-hidden="true" />
            <span>أو</span>
            <span className="h-px bg-border" aria-hidden="true" />
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={googleLoading}
            aria-busy={googleLoading}
            onClick={handleGoogleSignIn}
            className="h-14 w-full rounded-[10px] border-register-input bg-background text-base font-bold text-navy shadow-none transition-colors duration-200 hover:border-register-danger hover:bg-background hover:text-register-danger"
          >
            <GoogleMark />
            سجل بحساب جوجل
          </Button>

          <div className="min-h-6 pt-2">
            {googleError && (
              <p role="alert" className="text-center text-sm font-medium text-destructive">
                {googleError}
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="font-bold text-register-primary hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>

          <p className="mt-8 text-center text-xs leading-6 text-muted-foreground">
            بالمتابعة، فإنك توافق على{" "}
            <span className="font-medium text-navy underline underline-offset-2">الشروط</span>{" "}
            و{" "}
            <span className="font-medium text-navy underline underline-offset-2">سياسة الخصوصية</span>.
          </p>
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
