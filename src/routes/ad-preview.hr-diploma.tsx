import { createFileRoute } from "@tanstack/react-router";
import { ProgramLandingV2 } from "@/components/landing/ProgramLandingV2";
import { hrDiplomaLanding } from "@/data/landingV2";
import { SITE_ORIGIN, toAbsoluteUrl } from "@/data/adReferral";

const title = hrDiplomaLanding.title;
const description = hrDiplomaLanding.subtitle;
const ogImage = toAbsoluteUrl(hrDiplomaLanding.adImage);
const canonical = `${SITE_ORIGIN}/ad-preview/hr-diploma`;

export const Route = createFileRoute("/ad-preview/hr-diploma")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? (search["ref"] as string) : undefined,
    platform: typeof search["platform"] === "string" ? (search["platform"] as string) : undefined,
  }),
  loaderDeps: ({ search }) => ({ ref: search.ref, platform: search.platform }),
  loader: ({ deps }) => {
    const query = new URLSearchParams();
    if (deps.ref) query.set("ref", deps.ref);
    if (deps.platform) query.set("platform", deps.platform);
    const queryString = query.toString();
    return { ogUrl: `${canonical}${queryString ? `?${queryString}` : ""}` };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:site_name", content: "مكافآتي" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:image:secure_url", content: ogImage },
      { property: "og:url", content: loaderData?.ogUrl ?? canonical },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
  component: HrDiplomaLandingPreview,
});

function HrDiplomaLandingPreview() {
  const { ref, platform } = Route.useSearch();
  return <ProgramLandingV2 program={hrDiplomaLanding} referralCode={ref} platform={platform} />;
}
