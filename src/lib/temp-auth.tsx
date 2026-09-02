/**
 * Temporary development gate.
 * Replace `verifyCredentials` + storage calls with a real auth provider later;
 * the rest of the app only depends on `useTempAuth()` / `<RequireAuth>`.
 */
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";

const STORAGE_KEY = "mukafaty:temp-auth";
const EVENT = "mukafaty:temp-auth-change";

const EXPECTED_USER = "333";
const EXPECTED_PASS = "333";

export function verifyCredentials(username: string, password: string) {
  return username.trim() === EXPECTED_USER && password === EXPECTED_PASS;
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function signIn() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function signOut() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useTempAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const sync = () => setAuthed(isAuthenticated());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
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
    return <div className="min-h-screen bg-background" aria-hidden />;
  }

  return <>{children}</>;
}
