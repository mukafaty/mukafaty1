/**
 * Temporary development gate — IN-MEMORY ONLY.
 * No localStorage / sessionStorage / cookies / cache. The session lives only
 * in this module's memory, so any full page load starts unauthenticated.
 * Replace `verifyCredentials` + the memory store with Supabase Auth later;
 * the rest of the app only depends on `useTempAuth()` / `<RequireAuth>`.
 */
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";

const EVENT = "mukafaty:temp-auth-change";
const LEGACY_KEYS = ["mukafaty:temp-auth"];

const EXPECTED_USER = "555";
const EXPECTED_PASS = "555";

/** In-memory session flag. Reset on every page load / reload. */
let sessionAuthed = false;

/** Remove any auth state persisted by earlier versions. */
function purgeLegacyPersistence() {
  if (typeof window === "undefined") return;
  for (const key of LEGACY_KEYS) {
    try {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

purgeLegacyPersistence();

export function verifyCredentials(username: string, password: string) {
  return username.trim() === EXPECTED_USER && password === EXPECTED_PASS;
}

export function isAuthenticated() {
  return sessionAuthed;
}

export function signIn() {
  sessionAuthed = true;
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

export function signOut() {
  sessionAuthed = false;
  purgeLegacyPersistence();
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

export function useTempAuth() {
  // Always start unauthenticated (null = still resolving on the client).
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const sync = () => setAuthed(isAuthenticated());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  return { authed, signIn, signOut };
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { authed } = useTempAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authed === false) navigate({ to: "/login", replace: true });
  }, [authed, navigate]);

  if (authed !== true) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand"
          role="status"
          aria-label="جارٍ التحقق"
        />
      </div>
    );
  }

  return <>{children}</>;
}
