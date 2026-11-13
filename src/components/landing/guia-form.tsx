"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle2, ChevronDown, Download, Play } from "lucide-react";
import { Kicker } from "@/components/ui/kicker";
import { cn } from "@/lib/utils";
import { HERO, LOADER_STEPS, REVEAL, STEPS, type Step } from "@/content/form";
import {
  buildPayload,
  firstName,
  maskPhone,
  submitLead,
  suggestEmail,
  toE164,
  validateEmail,
  validateName,
  validatePhone,
  type Answers,
} from "@/lib/lead";
import { COUNTRIES, DEFAULT_COUNTRY, dialFor } from "@/content/countries";
import { AULA_URL, PDF_URL } from "@/lib/constants";

type Phase = "form" | "loading" | "done";

const EMAIL_INDEX = STEPS.findIndex((s) => s.field === "email");
const TRANSITION = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const };

const nextButtonClass = cn(
  "group/next mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)]",
  "font-semibold uppercase tracking-[var(--ls-cta)] text-accent-foreground",
  "shadow-[var(--shadow-glow-gold)] transition-transform duration-200 hover:-translate-y-0.5",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
);

export function GuiaForm() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("form");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [draft, setDraft] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const step = STEPS[index];
  const name = firstName(answers.nome);
  const dial = dialFor(country);

  // Foca o input a cada pergunta.
  useEffect(() => {
    if (phase === "form") inputRef.current?.focus();
  }, [index, phase]);

  const finish = useCallback(
    async (final: Answers) => {
      setPhase("loading");
      // Liberar o guia não depende da gravação: se o envio falhar, o PDF sai
      // do mesmo jeito. O micro-loader é só polish (nada é "processado").
      await Promise.all([
        submitLead(buildPayload(final)),
        new Promise((r) => setTimeout(r, reduced ? 300 : 850)),
      ]);
      setPhase("done");
    },
    [reduced],
  );

  const commit = useCallback(
    (value: string) => {
      const next: Answers = { ...answers, [step.field]: value };
      setAnswers(next);
      setError(null);
      setSuggestion(null);
      setDraft("");

      // Contato salvo já no e-mail — se desistir no WhatsApp, o lead fica.
      if (index === EMAIL_INDEX) void submitLead(buildPayload(next));

      if (index >= STEPS.length - 1) {
        void finish(next);
        return;
      }
      setIndex((i) => i + 1);
    },
    [answers, index, step.field, finish],
  );

  const submitText = useCallback(() => {
    const value = draft.trim();

    if (step.field === "whatsapp") {
      const problem = validatePhone(value, dial);
      if (problem) {
        setError(problem);
        return;
      }
      commit(toE164(value, dial));
      return;
    }

    let problem: string | null = null;
    if (step.field === "nome") problem = validateName(value);
    if (step.field === "email") problem = validateEmail(value);

    if (problem) {
      setError(problem);
      return;
    }

    if (step.field === "email") {
      const fix = suggestEmail(value);
      if (fix && fix !== value.toLowerCase() && !suggestion) {
        setSuggestion(fix);
        return;
      }
    }

    commit(value);
  }, [commit, dial, draft, step.field, suggestion]);

  if (phase === "loading") return <Loader reduced={!!reduced} />;
  if (phase === "done") return <Reveal name={name} />;

  const progress = ((index + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[var(--ls-badge)]">
          <span className="text-accent">{HERO.kicker}</span>
          <span className="text-muted-2">
            {Math.min(index + 1, STEPS.length)} de {STEPS.length}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[var(--gradient-cta-gold)]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="relative min-h-[300px] rounded-[8px] border border-border-gold bg-background/82 p-6 shadow-[var(--shadow-cinematic)] backdrop-blur sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.field}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={TRANSITION}
          >
            <h2 className="font-sans text-2xl font-semibold leading-tight text-foreground sm:text-[1.75rem]">
              {step.question.replace(/\{nome\}/g, name)}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {step.subtitle.replace(/\{nome\}/g, name)}
            </p>

            {step.field === "whatsapp" ? (
              <PhoneField
                ref={inputRef}
                country={country}
                placeholder={step.placeholder}
                value={draft}
                error={error}
                onCountryChange={(code) => {
                  const nextDial = dialFor(code);
                  setCountry(code);
                  setDraft(nextDial === dial ? maskPhone(draft, nextDial) : "");
                  setError(null);
                }}
                onChange={(v) => {
                  setDraft(maskPhone(v, dial));
                  if (error) setError(null);
                }}
                onSubmit={submitText}
              />
            ) : (
              <TextField
                ref={inputRef}
                step={step}
                value={draft}
                error={error}
                suggestion={suggestion}
                onChange={(v) => {
                  setDraft(v);
                  if (error) setError(null);
                }}
                onAcceptSuggestion={() => {
                  if (suggestion) {
                    setDraft(suggestion);
                    setSuggestion(null);
                    commit(suggestion);
                  }
                }}
                onSubmit={submitText}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted-2">
        Seus dados ficam comigo e não são compartilhados.
      </p>
    </div>
  );
}

/* ────────────────────────────── TextField ──────────────────────────── */

function TextField({
  ref,
  step,
  value,
  error,
  suggestion,
  onChange,
  onAcceptSuggestion,
  onSubmit,
}: {
  ref: React.RefObject<HTMLInputElement | null>;
  step: Extract<Step, { type: "text" | "email" | "tel" }>;
  value: string;
  error: string | null;
  suggestion: string | null;
  onChange: (value: string) => void;
  onAcceptSuggestion: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-8">
      <input
        ref={ref}
        type={step.type === "email" ? "email" : "text"}
        inputMode={step.type === "email" ? "email" : "text"}
        autoComplete={step.field === "nome" ? "name" : "email"}
        enterKeyHint="next"
        value={value}
        placeholder={step.placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        className={cn(
          "w-full rounded-[8px] border bg-surface-raised/62 px-5 py-4 text-lg text-foreground",
          "placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-accent",
          error ? "border-primary" : "border-white/12",
        )}
      />

      {error && <p className="mt-3 text-sm text-primary">{error}</p>}

      {suggestion && (
        <button
          type="button"
          onClick={onAcceptSuggestion}
          className="mt-3 w-full rounded-[8px] border border-border-gold bg-accent/10 px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-accent/16"
        >
          Faltou uma letra aí — você quis dizer{" "}
          <strong className="font-semibold text-accent">{suggestion}</strong>?
        </button>
      )}

      <button
        type="button"
        onClick={onSubmit}
        className={nextButtonClass}
        style={{ backgroundImage: "var(--gradient-cta-gold)" }}
      >
        Continuar
        <ArrowRight className="size-4 transition-transform group-hover/next:translate-x-0.5" aria-hidden />
      </button>
    </div>
  );
}

/* ────────────────────────────── PhoneField ─────────────────────────── */

function PhoneField({
  ref,
  country,
  placeholder,
  value,
  error,
  onCountryChange,
  onChange,
  onSubmit,
}: {
  ref: React.RefObject<HTMLInputElement | null>;
  country: string;
  placeholder: string;
  value: string;
  error: string | null;
  onCountryChange: (code: string) => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const isBR = country === DEFAULT_COUNTRY;

  return (
    <div className="mt-8">
      <div className="grid gap-3">
        <div className="relative">
          <select
            aria-label="País do seu WhatsApp"
            autoComplete="tel-country-code"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
            className={cn(
              "w-full appearance-none rounded-[8px] border border-white/12 bg-surface-raised/62 py-4 pl-5 pr-12",
              "text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent",
            )}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-background text-foreground">
                {c.name} +{c.dial} {c.flag}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-2"
            aria-hidden
          />
        </div>

        <input
          ref={ref}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          enterKeyHint="done"
          value={value}
          placeholder={isBR ? placeholder : "Número do WhatsApp"}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
          }}
          className={cn(
            "w-full rounded-[8px] border bg-surface-raised/62 px-5 py-4 text-lg text-foreground",
            "placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-accent",
            error ? "border-primary" : "border-white/12",
          )}
        />
      </div>

      {error && <p className="mt-3 text-sm text-primary">{error}</p>}

      <button
        type="button"
        onClick={onSubmit}
        className={nextButtonClass}
        style={{ backgroundImage: "var(--gradient-cta-gold)" }}
      >
        Liberar meu acesso
        <ArrowRight className="size-4 transition-transform group-hover/next:translate-x-0.5" aria-hidden />
      </button>
    </div>
  );
}

/* ─────────────────────────────── Loader ────────────────────────────── */

function Loader({ reduced }: { reduced: boolean }) {
  return (
    <div className="mx-auto flex min-h-[300px] w-full max-w-[560px] flex-col items-center justify-center rounded-[8px] border border-border-gold bg-background/82 p-8 text-center shadow-[var(--shadow-cinematic)] backdrop-blur">
      <div className="relative mb-8 size-16" aria-hidden>
        <motion.span
          className="absolute inset-0 rounded-full bg-accent/25 blur-xl"
          animate={reduced ? undefined : { scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg className="absolute inset-0 h-full w-full text-accent" viewBox="0 0 64 64" fill="none">
          <motion.circle
            cx="32"
            cy="32"
            r="20"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="126"
            strokeLinecap="round"
            animate={reduced ? undefined : { strokeDashoffset: [126, 0], rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />
        </svg>
      </div>
      <p className="text-lg text-muted-foreground">{LOADER_STEPS[0]}</p>
    </div>
  );
}

/* ─────────────────────────────── Reveal ────────────────────────────── */

function Reveal({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-[620px]"
    >
      <div className="rounded-[8px] border border-border-gold bg-background/88 p-6 shadow-[var(--shadow-cinematic)] backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-6 shrink-0 text-accent" aria-hidden />
          <Kicker>{REVEAL.kicker}</Kicker>
        </div>

        <h2 className="mt-5 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          {REVEAL.headline.replace(/\{nome\}/g, name)}
        </h2>

        {/* 1 — Aula gratuita (= LP da 3DM). Botão principal, em destaque.
            Abre em nova aba pra esta tela continuar aberta com o e-book. */}
        <div className="mt-7 rounded-[8px] border border-border-gold bg-accent/8 p-5">
          <Kicker>
            <Play className="size-3.5" aria-hidden />
            {REVEAL.aulaKicker}
          </Kicker>
          <p className="mt-3 text-lg font-semibold leading-tight text-foreground">
            {REVEAL.aulaTitle}
          </p>
          <a
            href={AULA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(nextButtonClass, "mt-4")}
            style={{ backgroundImage: "var(--gradient-cta-gold)" }}
          >
            {REVEAL.aulaLabel}
            <ArrowRight className="size-4 transition-transform group-hover/next:translate-x-0.5" aria-hidden />
          </a>
        </div>

        {/* 2 — Bônus: o e-book gratuito */}
        <div className="mt-4 flex flex-col gap-5 rounded-[8px] border border-white/10 bg-surface-raised/62 p-5 sm:flex-row sm:items-center">
          <div className="relative mx-auto aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-[6px] border border-border-gold sm:mx-0">
            <Image
              src="/img/pdf-mockup.png"
              alt="Capa do e-book Por Que Qualquer Mentira Funciona Com Você?"
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <Kicker>{REVEAL.bonusKicker}</Kicker>
            <p className="mt-2 text-lg font-semibold leading-tight text-foreground">{REVEAL.pdfTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{REVEAL.pdfDesc}</p>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-border-gold px-6 py-3",
                "font-semibold uppercase tracking-[var(--ls-cta)] text-accent transition-colors hover:bg-accent/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              )}
            >
              <Download className="size-4" aria-hidden />
              {REVEAL.downloadLabel}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
