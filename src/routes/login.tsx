import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * /login محجوز لصفحة تسجيل دخول المسوّق القادمة.
 * مؤقتًا يحوّل إلى /register حتى لا تنكسر الروابط الحالية.
 */
export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ to: "/register" });
  },
});
