import { TelegramBrief, type TelegramBriefCopy } from "./TelegramBrief";

type PilotScopeProps = {
  eyebrow: string;
  title: string;
  intro: string;
  promise: string;
  includedTitle: string;
  included: string[];
  excludedTitle: string;
  excluded: string[];
  timingLabel: string;
  timing: string;
  stabilizationLabel: string;
  stabilization: string;
  interfaceTitle: string;
  interfaceBody: string;
  telegram: TelegramBriefCopy;
};

function ScopeList({ items, tone }: { items: string[]; tone: "included" | "excluded" }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[1.25rem_1fr] gap-2 text-sm leading-relaxed text-muted-foreground">
          <span
            aria-hidden="true"
            className={`font-mono text-xs ${
              tone === "included" ? "text-primary" : "text-muted-foreground/60"
            }`}
          >
            {tone === "included" ? "+" : "–"}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PilotScope({
  eyebrow,
  title,
  intro,
  promise,
  includedTitle,
  included,
  excludedTitle,
  excluded,
  timingLabel,
  timing,
  stabilizationLabel,
  stabilization,
  interfaceTitle,
  interfaceBody,
  telegram,
}: PilotScopeProps) {
  return (
    <section id="pilote" aria-labelledby="pilot-title" className="border-y border-primary/50 bg-primary/[0.035]">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(19rem,0.95fr)] lg:gap-14">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </p>
            <h2 id="pilot-title" className="mt-3 max-w-2xl font-elegant text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {intro}
            </p>
            <p className="mt-6 border-l-2 border-primary pl-4 text-sm font-medium leading-relaxed text-foreground">
              {promise}
            </p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div className="border-t border-primary/50 pt-4">
                <h3 className="text-sm font-semibold text-foreground">{includedTitle}</h3>
                <ScopeList items={included} tone="included" />
              </div>
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-foreground">{excludedTitle}</h3>
                <ScopeList items={excluded} tone="excluded" />
              </div>
            </div>

            <dl className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
              <div className="bg-background p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {timingLabel}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{timing}</dd>
              </div>
              <div className="bg-background p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {stabilizationLabel}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{stabilization}</dd>
              </div>
            </dl>
          </div>

          <div className="self-center lg:pt-10">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
              {interfaceTitle}
            </p>
            <p className="mb-5 mt-2 text-sm leading-relaxed text-muted-foreground">
              {interfaceBody}
            </p>
            <TelegramBrief label={interfaceTitle} copy={telegram} />
          </div>
        </div>
      </div>
    </section>
  );
}
