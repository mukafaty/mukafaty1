import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import workspaceImage from "@/assets/register-workspace.jpg";
import { supabase } from "@/integrations/supabase/client";

const EMPTY_MESSAGE = "الرجاء تعبئة هذا الحقل.";
const RULE_MESSAGE = "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل وتحتوي على حرف ورقم.";
const MISMATCH_MESSAGE = "كلمتا المرور غير متطابقتين.";
const INVALID_LINK_MESSAGE = "رابط استعادة كلمة المرور غير صالح أو انتهت صلاحيته.";
const FAILED_MESSAGE = "تعذر تغيير كلمة المرور، يرجى المحاولة مرة أخرى.";
const SUCCESS_MESSAGE = "تم تغيير كلمة المرور بنجاح.";

const FIELD_BASE =
  "h-[54px] w-full rounded-[10px] border bg-background pr-11 pl-12 text-right text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-register-primary/10";
const FIELD_IDLE = `${FIELD_BASE} border-register-input focus:border-register-primary`;
const FIELD_ERROR = `${FIELD_BASE} border-destructive focus:border-destructive`;

function validatePassword(v: string): string | null {
  if (v.length === 0) return EMPTY_MESSAGE;
  if (v.length < 6 || !/\p{L}/u.test(v) || !/\d/.test(v)) return RULE_MESSAGE;
  return null;
}

type Status = "checking" | "ready" | "invalid" | "success";

export function ResetPasswordPageContent() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    if (hash.get("error") || hash.get("error_code") || query.get("error") || query.get("error_code")) {
      setStatus("invalid");
      return;
    }
    const isRecoveryLink =
      hash.get("type") === "recovery" || query.get("type") === "recovery" || query.has("code") || query.has("token_hash");
    if (!isRecoveryLink) {
      setStatus("invalid");
      return;
    }

    let settled = false;
    const markReady = () => {
      if (settled) return;
      settled = true;
      setStatus("ready");
    };
    const markInvalid = () => {
      if (settled) return;
      settled = true;
      setStatus("invalid");
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) markReady();
    });

    (async () => {
      try {
        const tokenHash = query.get("token_hash");
        const code = query.get("code");
        if (tokenHash) {
          const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
          if (error || !data.session) return markInvalid();
          return markReady();
        }
        if (code) {
          const { data: existing } = await supabase.auth.getSession();
          if (!existing.session) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (error || !data.session) return markInvalid();
          }
          return markReady();
        }
        const { data } = await supabase.auth.getSession();
        if (data.session) markReady();
      } catch {
        markInvalid();
      }
    })();

    const timer = window.setTimeout(markInvalid, 6000);
    return () => {
      sub.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || status !== "ready") return;
    const pErr = validatePassword(password);
    const cErr = confirm.length === 0 ? EMPTY_MESSAGE : confirm !== password ? MISMATCH_MESSAGE : null;
    setPasswordError(pErr);
    setConfirmError(cErr);
    setFormError(null);
    if (pErr || cErr) return;

    setSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setStatus("invalid");
        return;
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setFormError(FAILED_MESSAGE);
        return;
      }
      await supabase.auth.signOut().catch(() => undefined);
      window.history.replaceState(null, "", window.location.pathname);
      setStatus("success");
      window.setTimeout(() => navigate({ to: "/login", replace: true }), 2000);
    } catch {
      setFormError(FAILED_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main dir="rtl" lang="ar" className="grid min-h-screen w-full overflow-x-hidden bg-brand-soft/50 md:grid-cols-[56fr_44fr] md:[direction:ltr]">
      <section dir="rtl" className="flex min-w-0 items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:order-2 lg:px-10 xl:px-14">
        <div className="w-full max-w-[520px] rounded-3xl border border-border/70 bg-background px-6 py-7 shadow-[0_22px_60px_-42px_var(--navy)] sm:px-10 sm:py-9">
          <div className="flex justify-center">
            <img src={logoAsset.url} alt="شعار منصة مكافآتي" width={190} height={60} className="h-12 w-auto sm:h-14" />
          </div>

          <div className="mt-8 text-right">
            <h1 className="text-3xl font-black text-navy sm:text-4xl">تعيين كلمة مرور جديدة</h1>
            <p className="mt-2 text-base leading-7 text-muted-foreground sm:text-lg">أدخل كلمة المرور الجديدة لحسابك.</p>
          </div>

          {status === "checking" && <div className="mt-7 min-h-24" aria-busy="true" />}

          {status === "invalid" && (
            <div className="mt-7">
              <p role="alert" className="rounded-[10px] border border-destructive/40 bg-muted/40 px-4 py-4 text-center text-sm font-bold leading-7 text-destructive">
                {INVALID_LINK_MESSAGE}
              </p>
              <Button asChild className="mt-5 h-14 w-full rounded-[10px] bg-register-primary text-base font-bold text-primary-foreground shadow-none hover:bg-register-primary-hover">
                <Link to="/forgot-password">
                  طلب رابط جديد
                  <ArrowLeft size={18} />
                </Link>
              </Button>
            </div>
          )}

          {status === "success" && (
            <p role="status" className="mt-7 rounded-[10px] border border-register-input bg-muted/40 px-4 py-4 text-center text-sm font-bold leading-7 text-navy">
              {SUCCESS_MESSAGE}
            </p>
          )}

          {status === "ready" && (
            <form className="mt-7" noValidate onSubmit={handleSubmit}>
              <label htmlFor="reset-password" className="mb-2 block text-sm font-bold text-navy">كلمة المرور الجديدة</label>
              <div className="relative">
                <Lock size={19} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  aria-invalid={passwordError !== null}
                  placeholder="أدخل كلمة المرور الجديدة"
                  onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(null); }}
                  className={passwordError ? FIELD_ERROR : FIELD_IDLE}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors lg:hover:text-navy">
                  {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </div>
              <div className="min-h-6 pt-1">
                {passwordError && <p role="alert" className="text-sm font-medium text-destructive">{passwordError}</p>}
              </div>

              <label htmlFor="reset-confirm" className="mb-2 mt-2 block text-sm font-bold text-navy">تأكيد كلمة المرور الجديدة</label>
              <div className="relative">
                <Lock size={19} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="reset-confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  aria-invalid={confirmError !== null}
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  onChange={(e) => { setConfirm(e.target.value); if (confirmError) setConfirmError(null); }}
                  className={confirmError ? FIELD_ERROR : FIELD_IDLE}
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors lg:hover:text-navy">
                  {showConfirm ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </div>
              <div className="min-h-6 pt-1">
                {confirmError && <p role="alert" className="text-sm font-medium text-destructive">{confirmError}</p>}
              </div>

              {formError && <p role="alert" className="pb-3 text-center text-sm font-medium text-destructive">{formError}</p>}

              <Button type="submit" disabled={submitting} aria-busy={submitting} className="mt-2 h-14 w-full rounded-[10px] bg-register-primary text-base font-bold text-primary-foreground shadow-none hover:bg-register-primary-hover">
                حفظ كلمة المرور الجديدة
                <ArrowLeft size={18} />
              </Button>
            </form>
          )}
        </div>
      </section>

      <section dir="rtl" className="relative min-h-[440px] min-w-0 overflow-hidden sm:min-h-[520px] md:order-1 md:min-h-screen" aria-label="مكافآتي للتسويق الرقمي">
        <img src={workspaceImage} alt="مكتب حديث مع حاسب محمول يعرض لوحة أداء رقمية" width={1200} height={1400} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-background/20" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-background/60 via-background/20 to-transparent" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-start px-6 pt-12 text-right sm:px-8 sm:pt-14 lg:px-14 lg:pt-[14vh] xl:px-20">
          <h2 className="max-w-2xl text-3xl font-black leading-[1.3] text-navy sm:text-4xl lg:text-5xl">حوّل تأثيرك إلى مكافآت</h2>
          <p className="mt-3 max-w-xl text-base font-medium leading-8 text-navy/75 sm:text-xl">انشر .. تابع إنجازاتك .. تزيد أرباحك</p>
        </div>
        <img src={logoAsset.url} alt="" aria-hidden="true" width={190} height={60} className="absolute bottom-[25%] right-[13%] hidden h-5 w-auto opacity-90 md:block xl:h-6" />
      </section>
    </main>
  );
}
