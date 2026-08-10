import { cn } from "@/lib/utils";

/**
 * Rótulo de seção — "evidência forense" em mono, caixa-alta, tracking largo.
 * Server component.
 */
export function Kicker({
  children,
  className,
  tone = "gold",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "gold" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[var(--ls-kicker)]",
        tone === "gold" ? "text-accent" : "text-muted-2",
        className,
      )}
    >
      {children}
    </span>
  );
}
