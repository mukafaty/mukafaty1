import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import workspaceImage from "@/assets/register-workspace.jpg";
import { supabase } from "@/integrations/supabase/client";
import { clearLoginEmail, loadLoginEmail } from "@/lib/loginFlow";

const EMPTY_MESSAGE = "الرجاء تعبئة هذا الحقل.";
const WRONG_MESSAGE = "كلمة المرور غير صحيحة.";
const FAILED_MESSAGE = "تعذر تسجيل الدخول، حاول مرة أخرى.";

const FIELD_BASE_CLASS =
  "h-[54px] w-full rounded-[10px] border bg-background pr-11 pl-12 text-right text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-register-primary/10";

export function LoginPasswordPageContent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = loadLoginEmail();
    if (!stored) {
      navigate({ to: "/login", replace: true });
      return;
    }
    setEmail(stored);
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !email) return;
    if (password.length === 0) {
      setError(EMPTY_MESSAGE);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError || !data.session) {
        const code = (authError as { code?: string } | null)?.code;
        const status = (authError as { status?: number } | null)?.status;
        const invalid =
          code === "invalid_credentials" ||
          (status === 400 && /invalid login credentials/i.test(authError?.message ?? ""));
        setError(invalid ? WRONG_MESSAGE : FAILED_MESSAGE);
        setSubmitting(false);
        return;
      }
      clearLoginEmail();
      navigate({ href: "/dashboard", replace: true });
    } catch {
      setError(FAILED_MESSAGE);
      setSubmitting(false);
    }
  }

  if (!email) return <main className="min-h-screen bg-brand-soft/50" />;

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

          <div className="mt-8 flex items-center gap-3 rounded-[10px] border border-register-input bg-muted/40 px-4 py-3">
            <Mail size={19} aria-hidden="true" className="shrink-0 text-muted-foreground" />
            <span dir="ltr" className="min-w-0 flex-1 truncate text-right text-sm font-bold text-navy">
              {email}
            </span>
          </div>

          <form className="mt-6" noValidate onSubmit={handleSubmit}>
            <label htmlFor="login-password" className="mb-2 block text-sm font-bold text-navy">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock size={19} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="login-password"
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                aria-invalid={error !== null}
                aria-describedby={error ? "login-password-error" : undefined}
                placeholder="أدخل كلمة المرور"
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) setError(null);
                }}
                className={`${FIELD_BASE_CLASS} ${error ? "border-destructive focus:border-destructive" : "border-register-input focus:border-register-primary"}`}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors lg:hover:text-navy"
              >
                {show ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
              </button>
            </div>
            <div className="min-h-6 pt-1">
              {error && (
                <p id="login-password-error" role="alert" className="text-sm font-medium text-destructive">
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
              تسجيل الدخول
              <ArrowLeft size={18} />
            </Button>

            <div className="pt-4 text-center">
              <Link to="/login" className="text-sm font-bold text-register-primary transition-colors">
                رجوع
              </Link>
            </div>
          </form>
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
