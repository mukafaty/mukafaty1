// Client-safe helper for Google OAuth via the existing Supabase integration.
import { supabase } from "@/integrations/supabase/client";

/**
 * Redirect target after a successful Google sign-in.
 * - Production (mukafaty.com / www.mukafaty.com): https://mukafaty.com/dashboard
 * - Preview / localhost: the current origin's /dashboard so the flow also works
 *   outside the published domain (Supabase must allowlist both).
 */
export function getGoogleRedirectUrl(): string {
  if (typeof window === "undefined") return "https://mukafaty.com/dashboard";
  const { hostname, origin } = window.location;
  const isProduction = hostname === "mukafaty.com" || hostname === "www.mukafaty.com";
  return isProduction ? "https://mukafaty.com/dashboard" : `${origin}/dashboard`;
}

/**
 * Starts the Supabase Google OAuth flow. Throws on failure; on success the
 * browser is redirected to the provider, so nothing to return.
 */
export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getGoogleRedirectUrl(),
    },
  });

  if (error) throw error;
}
