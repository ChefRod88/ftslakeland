/**
 * Transactional email via Resend (https://resend.com). If RESEND_API_KEY is
 * unset the message is logged and treated as sent, so local dev works without
 * an account.
 */
interface SendArgs {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
}

/** Send, swallowing errors: a stored submission must not be lost to an email hiccup. */
export async function sendEmailSafe(env: Env, args: SendArgs): Promise<boolean> {
  try {
    await sendEmail(env, args);
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

export async function sendEmail(env: Env, args: SendArgs): Promise<void> {
  const key = (env as unknown as { RESEND_API_KEY?: string }).RESEND_API_KEY;
  const from = env.FROM_EMAIL;

  if (!key) {
    console.log("[email:dev]", JSON.stringify({ from, ...args }, null, 2));
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Florida Theological Seminary <${from}>`,
      to: Array.isArray(args.to) ? args.to : [args.to],
      subject: args.subject,
      text: args.text,
      reply_to: args.replyTo,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

export function kvLines(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join("\n");
}
