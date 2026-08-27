/**
 * /admin/* is meant to sit behind a Cloudflare Access policy, which
 * authenticates the request at the edge before it reaches the Worker and adds
 * the `Cf-Access-Authenticated-User-Email` header.
 *
 * This is a defence-in-depth check: on a real hostname we refuse the request
 * (404, so the path isn't even advertised) unless that header is present.
 * localhost is allowed through for development.
 */
export function requireStaff(request: Request): { email: string } {
  const url = new URL(request.url);
  const isLocal =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname.endsWith(".local");

  const email =
    request.headers.get("Cf-Access-Authenticated-User-Email") || "";

  if (!isLocal && !email) {
    throw new Response("Not found", { status: 404 });
  }
  return { email: email || "dev@localhost" };
}
