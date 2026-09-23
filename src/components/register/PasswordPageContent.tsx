import { FormEvent, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import workspaceImage from "@/assets/register-workspace.jpg";
import { clearRegistrationFlow, loadRegistrationFlow } from "@/lib/registrationFlow";
import { supabase } from "@/integrations/supabase/client";

const EMPTY_MESSAGE = "الرجاء تعبئة هذا الحقل.";
const PASSWORD_RULE_MESSAGE = "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل وتحتوي على حرف ورقم.";
const MISMATCH_MESSAGE = "كلمتا المرور غير متطابقتين.";
const MISSING_STEPS_MESSAGE = "بيانات التسجيل غير مكتملة. الرجاء البدء من صفحة إنشاء الحساب.";
const GENERIC_ERROR_MESSAGE = "تعذّر إنشاء الحساب. حاول مرة أخرى.";

const HAS_LETTER = /\p{L}/u;
const HAS_DIGIT = /\d/;

const FIELD_BASE_CLASS =
  "h-[54px] w-full rounded-[10px] border bg-background pr-11 pl-12 text-right text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-register-primary/10";

const FIELD_IDLE_CLASS = `${FIELD_BASE_CLASS} border-register-input focus:border-register-primary`;
const FIELD_ERROR_CLASS = `${FIELD_BASE_CLASS} border-destructive focus:border-destructive`;

function validatePassword(value: string): string | null {
  if (value.length === 0) return EMPTY_MESSAGE;
  if (value.length < 6 || !HAS_LETTER.test(value) || !HAS_DIGIT.test(value)) {
    return PASSWORD_RULE_MESSAGE;
  }
  return null;
}

export function PasswordPageContent() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextPasswordError = validatePassword(password);
    const nextConfirmError =
      confirmPassword.length === 0
        ? EMPTY_MESSAGE
        : confirmPassword !== password
          ? MISMATCH_MESSAGE
          : null;

    setPasswordError(nextPasswordError);
    setConfirmError(nextConfirmError);
    setFormError(null);
    if (nextPasswordError || nextConfirmError) return;

    const flow = loadRegistrationFlow();
    if (!flow.email || !flow.full_name || !flow.phone) {
      setFormError(MISSING_STEPS_MESSAGE);
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: flow.email,
        password,
        options: {
          data: { full_name: flow.full_name, phone: flow.phone },
        },
      });

      if (error || !data.user) {
        setFormError(error?.message ?? GENERIC_ERROR_MESSAGE);
        setSubmitting(false);
        return;
      }

      // The member number and the profile row are generated in the database.
      if (data.session) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, member_number, full_name, phone, membership_status")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileError || !profile?.member_number || !profile.full_name || !profile.phone) {
          setFormError(GENERIC_ERROR_MESSAGE);
          setSubmitting(false);
          return;
        }
      }

      clearRegistrationFlow();
      navigate({ href: "/dashboard", replace: true });
    } catch {
      setFormError(GENERIC_ERROR_MESSAGE);
      setSubmitting(false);
    }
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
            <label htmlFor="password" className="mb-2 block text-sm font-bold text-navy">
              كلمة المرور *
            </label>
            <div className="relative">
              <Lock
                size={19}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                aria-invalid={passwordError !== null}
                aria-describedby={passwordError ? "password-error" : undefined}
                placeholder="أدخل كلمة المرور"
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                className={passwordError ? FIELD_ERROR_CLASS : FIELD_IDLE_CLASS}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors lg:hover:text-navy"
              >
                {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
              </button>
            </div>
            <div className="min-h-6 pt-1">
              {passwordError && (
                <p id="password-error" role="alert" className="text-sm font-medium text-destructive">
                  {passwordError}
                </p>
              )}
            </div>

            <label htmlFor="confirm-password" className="mb-2 block text-sm font-bold text-navy">
              تأكيد كلمة المرور *
            </label>
            <div className="relative">
              <Lock
                size={19}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="confirm-password"
                name="confirm_password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                aria-invalid={confirmError !== null}
                aria-describedby={confirmError ? "confirm-password-error" : undefined}
                placeholder="أعد إدخال كلمة المرور"
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (confirmError) setConfirmError(null);
                }}
                className={confirmError ? FIELD_ERROR_CLASS : FIELD_IDLE_CLASS}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((value) => !value)}
                aria-label={showConfirm ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors lg:hover:text-navy"
              >
                {showConfirm ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
              </button>
            </div>
            <div className="min-h-6 pt-1">
              {confirmError && (
                <p id="confirm-password-error" role="alert" className="text-sm font-medium text-destructive">
                  {confirmError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="h-14 w-full rounded-[10px] bg-register-primary text-base font-bold text-primary-foreground shadow-none hover:bg-register-primary-hover"
            >
              {submitting ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
              <ArrowLeft size={18} />
            </Button>

            {formError && (
              <p role="alert" className="pt-3 text-center text-sm font-medium text-destructive">
                {formError}
              </p>
            )}

            <div className="pt-4 text-center">
              <Link to="/profile" className="text-sm font-bold text-register-primary transition-colors">
                رجوع
              </Link>
            </div>
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
