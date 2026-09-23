const KEY = "mukafaty-login-flow";

export function saveLoginEmail(email: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify({ email }));
}

export function loadLoginEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const email = raw ? (JSON.parse(raw) as { email?: unknown }).email : null;
    return typeof email === "string" && email.length > 0 ? email : null;
  } catch {
    return null;
  }
}

export function clearLoginEmail() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
}
