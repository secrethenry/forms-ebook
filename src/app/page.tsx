import Image from "next/image";
import { GuiaForm } from "@/components/landing/guia-form";
import { Kicker } from "@/components/ui/kicker";
import { RadarMark } from "@/components/ui/radar-mark";
import { HERO } from "@/content/form";
import { BLUR } from "@/lib/blur";
import { cn } from "@/lib/utils";

/**
 * Página de captura da aula gratuita (= LP da 3DM), com o e-book de bônus.
 *
 * Enxuta de propósito: copy curta + form de 3 campos (uma pergunta por tela).
 * No fim, a tela de liberação mostra dois botões: a aula gratuita (LP da 3DM)
 * em destaque e o e-book (PDF) como bônus.
 */

const CREDENTIALS = [
  "Certificado pelo Paul Ekman Group",
  "8 anos estudando comportamento",
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Image
        src="/img/bg-concrete.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={BLUR["bg-concrete"]}
        className="-z-30 object-cover opacity-[0.14]"
      />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,162,39,.12),transparent_58%)]" />

      <section className="px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-10">
        <div className="mx-auto w-full max-w-[680px]">
          <header className="text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <RadarMark size={32} />
              <Kicker>{HERO.kicker}</Kicker>
            </div>

            <h1 className="mx-auto max-w-[18ch] font-display text-display-lg uppercase leading-[var(--lh-display)] text-foreground">
              {HERO.title.lead} <span className="text-accent">{HERO.title.accent}</span>
            </h1>

            <p className="mx-auto mt-7 max-w-[520px] text-base leading-[1.75] text-muted-foreground sm:text-lg">
              {HERO.sub}
            </p>

            <p className="mx-auto mt-4 max-w-[520px] text-sm font-medium leading-relaxed text-accent">
              {HERO.bonus}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {CREDENTIALS.map((credential) => (
                <span
                  key={credential}
                  className={cn(
                    "rounded-full border border-white/10 bg-background/60 px-3 py-1.5",
                    "font-mono text-[10px] uppercase tracking-[var(--ls-badge)] text-muted-2",
                  )}
                >
                  {credential}
                </span>
              ))}
            </div>
          </header>

          <div className="mt-12 sm:mt-14">
            <GuiaForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-[680px] items-center justify-center gap-3">
          <RadarMark size={26} />
          <span className="font-mono text-[10px] uppercase tracking-[var(--ls-badge)] text-muted-2">
            Jogo de Corpo · Henrique Yoiti
          </span>
        </div>
      </footer>
    </main>
  );
}
