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

/** Account (dashboard) session: in-memory only, reset on every page load. */
let sessionAuthed = false;

/**
 * Site protection session: kept per browser tab (sessionStorage) and independent
 * of the account session, so signing out of a dashboard keeps the site browsable.
 * A new visitor / Incognito window has no marker and is sent to /protect.
 */
const SITE_ACCESS_KEY = "mukafaty:site-access:v1";

export function hasSiteAccess() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SITE_ACCESS_KEY) === "granted";
  } catch {
    return false;
  }
}

function grantSiteAccess() {
  try {
    window.sessionStorage.setItem(SITE_ACCESS_KEY, "granted");
  } catch {
    /* ignore */
  }
}

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

/** Temporary admin gate credentials (development only). */
export function verifyAdminCredentials(username: string, password: string) {
  const u = username.trim();
  return (u === "666" && password === "666") || (u === "admin" && password === "admin321");
}

export function isAuthenticated() {
  return sessionAuthed;
}

export function signIn() {
  sessionAuthed = true;
  if (typeof window !== "undefined") grantSiteAccess();
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

/** Ends the account session only; the site protection session is kept. */
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
    if (authed === false) navigate({ to: "/protect", replace: true });
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
