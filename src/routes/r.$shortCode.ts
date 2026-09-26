import { createFileRoute } from "@tanstack/react-router";

const ALLOWED_PREFIX = "https://mukafaty.com/ad/";

export const Route = createFileRoute("/r/$shortCode")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const code = params.shortCode;
        const notFound = () => Response.redirect(new URL("/", "https://mukafaty.com"), 302);
        if (!/^[A-Za-z0-9]{5,12}$/.test(code)) {
          return new Response(null, { status: 302, headers: { Location: "/" } });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.rpc("resolve_short_link", { _code: code });
        if (error || typeof data !== "string" || !data.startsWith(ALLOWED_PREFIX)) {
          void notFound;
          return new Response(null, { status: 302, headers: { Location: "/" } });
        }
        // Redirect to the same-site path so it works on any domain of the app
        const u = new URL(data);
        return new Response(null, {
          status: 302,
          headers: { Location: u.pathname + u.search, "Cache-Control": "no-store" },
        });
      },
    },
  },
});
