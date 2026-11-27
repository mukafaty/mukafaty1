/** Public demonstration identity only; never a Supabase user or access token. */
export const DEMO_ACCOUNT = Object.freeze({
  name: "أحمد السبيعي",
  email: "demo@gmail.com",
  memberNumber: "MK0001",
  accountType: "مسوق خارجي",
});
export const DEMO_SESSION_KEY = "mukafaty:external-demo-session:v1";
export const DEMO_AUTH_EVENT = "mukafaty:external-demo-auth";

export function isDemoEmail(email: string) {
  return email.trim().toLowerCase() === DEMO_ACCOUNT.email;
}

export function verifyDemoCredentials(email: string, password: string) {
  return isDemoEmail(email) && password === "demo2026";
}

export function readDemoSession(storage: Pick<Storage, "getItem">) {
  try {
    const raw = storage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null || !("kind" in value) || !("memberNumber" in value)) return null;
    return value.kind === "external-demo" && value.memberNumber === "MK0001" ? DEMO_ACCOUNT : null;
  } catch { return null; }
}

export function getDemoSession() {
  if (typeof window === "undefined") return null;
  try { return readDemoSession(window.localStorage); } catch { return null; }
}

export function startDemoSession(email: string, password: string) {
  if (!verifyDemoCredentials(email, password)) return false;
  window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ kind: "external-demo", memberNumber: "MK0001" }));
  window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
  return true;
}

export function clearDemoSession() {
  window.localStorage.removeItem(DEMO_SESSION_KEY);
  window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
}