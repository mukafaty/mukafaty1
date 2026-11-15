import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, User } from "lucide-react";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { getSupportAccess, loginSupport } from "@/lib/support-auth.functions";
import { supportCredentialsSchema } from "@/lib/support-auth.schema";
import { redirect } from "@tanstack/react-router";


export const Route = createFileRoute("/support-login")({
  beforeLoad: async () => {
    if (await getSupportAccess()) throw redirect({ to: "/support" });
  },
  head: () => ({
    meta: [
      { title: "دخول الدعم | مكافآتي" },
      { name: "description", content: "تسجيل الدخول الآمن إلى لوحة الدعم في منصة مكافآتي." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "دخول الدعم | مكافآتي" },
      { property: "og:description", content: "تسجيل الدخول الآمن إلى لوحة الدعم في منصة مكافآتي." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const login = useServerFn(loginSupport);
  const [pending, setPending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const parsed = supportCredentialsSchema.safeParse({ username, password });
    if (!parsed.success) { setError(true); return; }
    setPending(true);
    setError(false);
    setUnavailable(false);
    try {
      const result = await login({ data: parsed.data });
      setPassword("");
      if (result.ok) await navigate({ to: "/support", replace: true });
      else setError(true);
    } catch {
      setUnavailable(true);
    } finally {
      setPending(false);
    }
  }


  return (
    <div
      dir="rtl"
      lang="ar"
      className="flex min-h-screen items-center justify-center bg-brand-soft/50 px-4 py-10"
    >
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-7 sm:p-9">
        <div className="flex flex-col items-center text-center">
          <img
            src={logoAsset.url}
            alt="شعار منصة مكافآتي"
            width={190}
            height={60}
            className="h-11 w-auto"
          />
          <h1 className="mt-6 text-2xl font-bold text-navy">تسجيل الدخول</h1>
        </div>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-bold text-navy">
              اسم المستخدم
            </label>
            <div className="relative">
              <User
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                maxLength={100}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                className="h-12 w-full rounded-xl border border-border bg-background pr-10 pl-3 text-sm text-navy outline-none transition-colors focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-navy">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                maxLength={256}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="h-12 w-full rounded-xl border border-border bg-background pr-10 pl-3 text-sm text-navy outline-none transition-colors focus:border-brand"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm font-semibold text-destructive">
              اسم المستخدم أو كلمة المرور غير صحيحة
            </p>
          )}

          {unavailable && <p role="alert" className="text-sm font-semibold text-destructive">تعذر تسجيل الدخول، حاول مرة أخرى.</p>}

          <Button
            disabled={pending}
            type="submit"
            className="h-12 w-full rounded-xl bg-brand text-sm font-bold text-primary-foreground shadow-none transition-colors hover:bg-brand/90"
          >
            تسجيل الدخول
          </Button>
        </form>
      </div>
    </div>
  );
}
