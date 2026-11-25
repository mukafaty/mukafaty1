import { createFileRoute } from "@tanstack/react-router";
import { ProgramLandingV2 } from "@/components/landing/ProgramLandingV2";
import { SITE_ORIGIN, toAbsoluteUrl } from "@/data/adReferral";
import { getLandingProgram, hrDiplomaLanding } from "@/data/landingV2";

export const Route = createFileRoute("/ad/$slug")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? (search["ref"] as string) : undefined,
    platform: typeof search["platform"] === "string" ? (search["platform"] as string) : undefined,
  }),
  loaderDeps: ({ search }) => ({ ref: search.ref, platform: search.platform }),
  loader: ({ params, deps }) => {
    const program = getLandingProgram(params.slug);
    const canonical = `${SITE_ORIGIN}/ad/${program.slug}`;
    const query = new URLSearchParams();
    if (deps.ref) query.set("ref", deps.ref);
    if (deps.platform) query.set("platform", deps.platform);
    const queryString = query.toString();
    return {
      title: program.title,
      description: program.subtitle,
      ogImage: toAbsoluteUrl(program.adImage),
      ogUrl: `${canonical}${queryString ? `?${queryString}` : ""}`,
      canonical,
    };
  },
  head: ({ loaderData }) => {
    const data = loaderData ?? {
      title: hrDiplomaLanding.title,
      description: hrDiplomaLanding.subtitle,
      ogImage: toAbsoluteUrl(hrDiplomaLanding.adImage),
      ogUrl: `${SITE_ORIGIN}/ad/${hrDiplomaLanding.slug}`,
      canonical: `${SITE_ORIGIN}/ad/${hrDiplomaLanding.slug}`,
    };
    return {
      meta: [
        { title: data.title },
        { name: "description", content: data.description },
        { property: "og:site_name", content: "مكافآتي" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: data.title },
        { property: "og:description", content: data.description },
        { property: "og:image", content: data.ogImage },
        { property: "og:image:secure_url", content: data.ogImage },
        { property: "og:url", content: data.ogUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: data.title },
        { name: "twitter:description", content: data.description },
        { name: "twitter:image", content: data.ogImage },
      ],
      links: [{ rel: "canonical", href: data.canonical }],
    };
  },
  component: AdLandingPage,
});

function AdLandingPage() {
  const { slug } = Route.useParams();
  const { ref, platform } = Route.useSearch();
  const program = getLandingProgram(slug);
  return <ProgramLandingV2 program={program} referralCode={ref} platform={platform} />;
}
