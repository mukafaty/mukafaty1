import { createServerFn } from "@tanstack/react-start";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Securely checks whether an email is already registered in Supabase Auth.
 * Runs server-side with the service role and only ever returns a boolean —
 * no user data is exposed to the client.
 */
export const checkEmailRegistered = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) => {
    const email = String(input?.email ?? "").trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) throw new Error("invalid_email");
    return { email };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: exists, error } = await supabaseAdmin.rpc("email_is_registered", {
      _email: data.email,
    });
    if (error) throw new Error("check_failed");
    return { registered: exists === true };
  });
