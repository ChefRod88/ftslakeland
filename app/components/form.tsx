import { useEffect, useRef } from "react";

export function Field({
  label,
  name,
  error,
  hint,
  children,
  required,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children?: React.ReactNode;
}) {
  const id = `f-${name}`;
  const describedBy =
    [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {children ?? (
        <input
          id={id}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
        />
      )}
      {error && (
        <p className="field-err" id={`${id}-err`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Renders the Turnstile widget when a site key is provided; otherwise nothing. */
export function Turnstile({ siteKey }: { siteKey?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!siteKey || !ref.current) return;
    const w = window as unknown as {
      turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => void };
    };
    let cancelled = false;
    const render = () => {
      if (cancelled || !ref.current || !w.turnstile) return;
      w.turnstile.render(ref.current, { sitekey: siteKey });
    };
    if (w.turnstile) {
      render();
    } else if (!document.getElementById("cf-turnstile-script")) {
      const s = document.createElement("script");
      s.id = "cf-turnstile-script";
      s.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      const t = setInterval(() => {
        if (w.turnstile) {
          clearInterval(t);
          render();
        }
      }, 200);
      return () => clearInterval(t);
    }
    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={ref} className="cf-turnstile" style={{ marginBlock: "1rem" }} />;
}
