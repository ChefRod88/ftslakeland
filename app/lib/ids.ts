/** Opaque row id. */
export function newId(): string {
  return crypto.randomUUID();
}

/** URL-safe resume token for saved application drafts. */
export function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Human-facing application reference, e.g. FTS-7Q4K2M. */
export function newReferenceCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let out = "";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `FTS-${out}`;
}
