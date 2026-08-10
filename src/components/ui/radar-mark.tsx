import { cn } from "@/lib/utils";

/**
 * RadarMark — versão inline do logo-radar-simbolo.svg (radar dourado detectando
 * um sinal vermelho). Motif de marca recorrente: favicon, hero, carimbo por
 * seção, footer. `animated` gira a varredura (respeita reduced-motion via token).
 * Server component (SVG puro; a animação é CSS).
 */
export function RadarMark({
  size = 40,
  animated = false,
  className,
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {/* anel externo + círculos concêntricos */}
      <circle cx="50" cy="50" r="47" stroke="var(--accent)" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="36" stroke="var(--accent)" strokeWidth="0.8" opacity="0.2" />
      <circle cx="50" cy="50" r="26" stroke="var(--accent)" strokeWidth="0.8" opacity="0.35" />
      <circle cx="50" cy="50" r="17" stroke="var(--accent)" strokeWidth="1" opacity="0.58" />
      <circle cx="50" cy="50" r="9" stroke="var(--accent)" strokeWidth="1.2" opacity="0.82" />
      {/* eixos */}
      <line x1="50" y1="14" x2="50" y2="86" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
      <line x1="14" y1="50" x2="86" y2="50" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
      {/* varredura + rastro (gira quando animated) */}
      <g
        style={
          animated
            ? {
                transformOrigin: "50px 50px",
                animation: "radarSweep var(--dur-radar-sweep) linear infinite",
              }
            : undefined
        }
      >
        <line x1="50" y1="50" x2="78" y2="22" stroke="var(--accent)" strokeWidth="1.8" opacity="0.88" />
        <path d="M 74 26 A 34 34 0 0 0 50 16" stroke="var(--accent)" strokeWidth="1" opacity="0.25" />
      </g>
      {/* centro vermelho */}
      <circle cx="50" cy="50" r="4" fill="var(--primary-deep)" />
      <circle cx="50" cy="50" r="1.8" fill="var(--primary)" />
      {/* sinal detectado (blip) */}
      <circle cx="73" cy="27" r="3.5" fill="var(--primary)" opacity="0.92" />
      <circle cx="73" cy="27" r="6" stroke="var(--primary)" strokeWidth="0.8" opacity="0.35" />
    </svg>
  );
}
