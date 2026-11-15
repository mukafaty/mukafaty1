import { createHash, timingSafeEqual } from "node:crypto";
import { useSession, setResponseHeader } from "@tanstack/react-start/server";

export function credentialsMatch(username: string, password: string, expectedUser: string, expectedPassword: string) {
  const digest = (value: string) => createHash("sha256").update(value, "utf8").digest();
  const userMatches = timingSafeEqual(digest(username.trim()), digest(expectedUser.trim()));
  const passwordMatches = timingSafeEqual(digest(password), digest(expectedPassword));
  return userMatches && passwordMatches;
}

export function hasSupportAccess(data: { support?: boolean; expiresAt?: number }, now = Date.now()) {
  return data.support === true && typeof data.expiresAt === "number" && data.expiresAt > now;
}

export async function supportSession() {
  const password = process.env["SUPPORT_SESSION_SECRET"];
  if (!password) throw new Error("Support session is not configured");
  setResponseHeader("Cache-Control", "no-store");
  return useSession<{ support: boolean; expiresAt: number }>({
    password,
    name: "mukafaty-support",
    maxAge: 8 * 60 * 60,
    sessionHeader: false,
    cookie: { httpOnly: true, secure: true, sameSite: "strict", path: "/" },
  });
}