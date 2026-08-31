import type { Route } from "./+types/robots";
import { cloudflare } from "~/context";

export function loader({ context }: Route.LoaderArgs) {
  const { env } = context.get(cloudflare);
  const base = env.SITE_URL.replace(/\/$/, "");
  const body = `User-agent: *
Disallow: /admin/
Allow: /

Sitemap: ${base}/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
