import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { supportCredentialsSchema } from "./support-auth.schema";
import { credentialsMatch, hasSupportAccess, supportSession } from "./support-auth.server";

export const getSupportAccess = createServerFn({ method: "GET" }).handler(async () => {
  const session = await supportSession();
  return hasSupportAccess(session.data);
});

export const loginSupport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => supportCredentialsSchema.parse(input))
  .handler(async ({ data }) => {
    const username = process.env["SUPPORT_USERNAME"];
    const password = process.env["SUPPORT_PASSWORD"];
    if (!username || !password) throw new Error("Support credentials are not configured");
    const session = await supportSession();
    // Uniform server-side delay also applies to successful logins.
    await new Promise((resolve) => setTimeout(resolve, 750));
    if (!credentialsMatch(data.username, data.password, username, password)) return { ok: false };
    await session.clear();
    await session.update({ support: true, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
    return { ok: true };
  });

export const getSupportPage = createServerFn({ method: "GET" }).handler(async () => {
  const session = await supportSession();
  if (!hasSupportAccess(session.data)) throw redirect({ to: "/support-login" });
  return {
    name: "الدعم",
    description: "إدارة الإعدادات التقنية والتكاملات والتحكم المتقدم في منصة مكافآتي",
  };
});

export const logoutSupport = createServerFn({ method: "POST" }).handler(async () => {
  const session = await supportSession();
  await session.clear();
  return { ok: true };
});