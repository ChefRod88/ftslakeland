import type { Route } from "./+types/file";
import { cloudflare } from "~/context";
import { requireStaff } from "~/lib/staff";

export async function loader({ request, params, context }: Route.LoaderArgs) {
  requireStaff(request);
  const { env } = context.get(cloudflare);
  const meta = await env.DB.prepare(
    `SELECT r2_key, filename, content_type FROM application_files WHERE id = ?`,
  )
    .bind(params.id)
    .first<{ r2_key: string; filename: string; content_type: string | null }>();
  if (!meta) throw new Response("Not found", { status: 404 });

  const uploads = (env as Env & { UPLOADS?: R2Bucket }).UPLOADS;
  if (!uploads) throw new Response("File storage is not configured", { status: 503 });

  const obj = await uploads.get(meta.r2_key);
  if (!obj) throw new Response("File missing from storage", { status: 404 });

  return new Response(obj.body, {
    headers: {
      "Content-Type": meta.content_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${meta.filename.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
