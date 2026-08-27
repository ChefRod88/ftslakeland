import type { Route } from "./+types/sitemap";
import { cloudflare } from "~/context";

const PATHS = [
  "/",
  "/programs",
  "/admissions",
  "/admissions/apply",
  "/history",
  "/accreditation",
  "/give",
  "/portal",
  "/contact",
  "/privacy",
];

export function loader({ context }: Route.LoaderArgs) {
  const { env } = context.get(cloudflare);
  const base = env.SITE_URL.replace(/\/$/, "");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PATHS.map((p) => `  <url><loc>${base}${p}</loc></url>`).join("\n")}
</urlset>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
