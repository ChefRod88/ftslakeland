import { createRequestHandler, RouterContextProvider } from "react-router";
import { cloudflare } from "../app/context";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

/** Permanent redirects from the old static-mockup URLs. */
const REDIRECTS: Record<string, string> = {
  "/screens/1a-programs": "/programs",
  "/screens/1a-programs.html": "/programs",
  "/screens/programs.html": "/programs",
  "/screens/1b-admissions": "/admissions",
  "/screens/1b-admissions.html": "/admissions",
  "/screens/admissions.html": "/admissions",
  "/screens/1c-history": "/history",
  "/screens/1c-history.html": "/history",
  "/screens/history.html": "/history",
  "/screens/1d-accreditation": "/accreditation",
  "/screens/1d-accreditation.html": "/accreditation",
  "/screens/accreditation.html": "/accreditation",
  "/screens/1h-give": "/give",
  "/screens/give.html": "/give",
  "/screens/1g-student-portal": "/portal",
  "/screens/portal.html": "/portal",
  "/index.html": "/",
  "/mockups.html": "/",
  "/all-screens.html": "/",
};

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "img-src 'self' data: https://static.wixstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "connect-src 'self' https://challenges.cloudflare.com",
  "form-action 'self' https://secure.anedot.com",
].join("; ");

function securityHeaders(res: Response): Response {
  const h = new Headers(res.headers);
  h.set("X-Content-Type-Options", "nosniff");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("X-Frame-Options", "SAMEORIGIN");
  h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if ((res.headers.get("content-type") || "").includes("text/html")) {
    h.set("Content-Security-Policy", CSP);
  }
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const to = REDIRECTS[url.pathname];
    if (to) return Response.redirect(new URL(to, url).toString(), 301);

    const context = new RouterContextProvider();
    context.set(cloudflare, { env, ctx });
    const res = await requestHandler(request, context);
    return securityHeaders(res);
  },
} satisfies ExportedHandler<Env>;
