import { createContext } from "react-router";

/** Cloudflare runtime handle, available in every loader/action via `context.get(cloudflare)`. */
export const cloudflare = createContext<{
  env: Env;
  ctx: ExecutionContext;
}>();
