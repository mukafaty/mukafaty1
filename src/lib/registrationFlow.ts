export interface RegistrationFlowData {
  email: string;
  full_name: string;
  phone: string;
}

const STORAGE_KEY = "mukafaty-registration-flow";

const EMPTY_DATA: RegistrationFlowData = {
  email: "",
  full_name: "",
  phone: "",
};

/** Reads the in-progress registration data (email from /register, then name/phone from /profile). */
export function loadRegistrationFlow(): RegistrationFlowData {
  if (typeof window === "undefined") return { ...EMPTY_DATA };
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_DATA };
    const parsed = JSON.parse(raw) as Partial<RegistrationFlowData>;
    return {
      email: typeof parsed.email === "string" ? parsed.email : "",
      full_name: typeof parsed.full_name === "string" ? parsed.full_name : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
    };
  } catch {
    return { ...EMPTY_DATA };
  }
}

/** Merges the given step's data without losing previously stored fields (e.g. the email). */
export function saveRegistrationFlow(update: Partial<RegistrationFlowData>): RegistrationFlowData {
  const merged: RegistrationFlowData = { ...loadRegistrationFlow(), ...update };
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Storage unavailable (private mode) — the flow continues in memory only.
  }
  return merged;
}

export function clearRegistrationFlow(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}
