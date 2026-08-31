/**
 * Verify a Cloudflare Turnstile token server-side.
 * Returns true when the token is valid (or when no secret is configured, so
 * local dev without keys still works).
 */
export async function verifyTurnstile(
  token: FormDataEntryValue | null,
  secret: string | undefined,
  ip: string | null,
): Promise<boolean> {
  if (!secret) return true; // not configured — do not block
  if (typeof token !== "string" || token.length === 0) return false;

  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
