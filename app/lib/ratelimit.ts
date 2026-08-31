/**
 * Fixed-window rate limiter backed by KV. Best-effort: KV is eventually
 * consistent, which is fine for slowing down form spam.
 */
export async function rateLimit(
  kv: KVNamespace,
  key: string,
  { limit = 5, windowSeconds = 600 }: { limit?: number; windowSeconds?: number } = {},
): Promise<{ ok: boolean; remaining: number }> {
  const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
  const k = `rl:${key}:${bucket}`;
  const current = Number((await kv.get(k)) ?? "0");
  if (current >= limit) return { ok: false, remaining: 0 };
  await kv.put(k, String(current + 1), { expirationTtl: windowSeconds + 60 });
  return { ok: true, remaining: limit - current - 1 };
}

export function clientIp(request: Request): string | null {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null
  );
}
