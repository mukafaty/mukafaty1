import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, User } from "lucide-react";
import logoAsset from "@/assets/mukafaty-logo.png.asset.json";
import { isAuthenticated, signIn, verifyCredentials } from "@/lib/temp-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | مكافآتي" },
      { name: "description", content: "صفحة تسجيل الدخول إلى منصة مكافآتي للتسويق بالعمولة." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "تسجيل الدخول | مكافآتي" },
      { property: "og:description", content: "صفحة تسجيل الدخول إلى منصة مكافآتي للتسويق بالعمولة." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (verifyCredentials(username, password)) {
      signIn();
      navigate({ to: "/dashboard", replace: true });
    } else {
      setError(true);
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
              اسم المستخدم أو كلمة المرور غير صحيحة.
            </p>
          )}

          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-brand text-sm font-bold text-white transition-colors hover:bg-[#2789F2]"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}
