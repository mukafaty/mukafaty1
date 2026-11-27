/** Change only this setting to restore the original Supabase authentication. */
export const AUTH_MODE: "demo" | "live" = "demo";
export const isDemoMode = () => AUTH_MODE === "demo";
export const UNAVAILABLE_MESSAGE = "هذه الخدمة غير متاحة الآن";