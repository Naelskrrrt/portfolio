import { WhatsAppDemoVideo } from "@/components/offre/WhatsAppDemoVideo";

type PilotMetric = {
  value: string;
  label: string;
};

type PilotBentoProps = {
  eyebrow: string;
  title: string;
  intro: string;
  metrics: PilotMetric[];
  includedTitle: string;
  included: string[];
  limitsTitle: string;
  limits: string[];
  interfaceTitle: string;
  interfaceBody: string;
  videoCaption: string;
  videoFallback: string;
  guarantees: string[];
};

export function PilotBento({
  eyebrow,
  title,
  intro,
  metrics,
  includedTitle,
  included,
  limitsTitle,
  limits,
  interfaceTitle,
  interfaceBody,
  videoCaption,
  videoFallback,
  guarantees,
}: PilotBentoProps) {
  const [primaryMetric, ...supportingMetrics] = metrics;

  return (
    <section
      id="pilote"
      aria-labelledby="scope-title"
      className="border-b border-border bg-primary/[0.025] px-4 py-14 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl border border-border bg-border gap-px md:grid-cols-12">
        <article className="bg-primary/[0.07] p-6 md:col-span-12 sm:p-8 lg:col-span-7">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </p>
            <h2
              id="scope-title"
              className="mt-3 max-w-2xl font-elegant text-4xl leading-[1.02] tracking-tight sm:text-5xl"
            >
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {intro}
            </p>
          </div>

          {primaryMetric ? (
            <dl className="mt-9 flex items-end gap-4 border-t border-primary/25 pt-5">
              <div className="flex min-w-0 items-end gap-4">
                <dt className="font-elegant text-7xl leading-[0.78] text-primary sm:text-8xl">
                  {primaryMetric.value}
                </dt>
                <dd className="max-w-36 pb-1 text-xs font-medium uppercase leading-relaxed tracking-[0.08em] text-foreground">
                  {primaryMetric.label}
                </dd>
              </div>
            </dl>
          ) : null}
        </article>

        <article className="flex min-w-0 flex-col bg-background p-5 md:col-span-12 sm:p-6 lg:col-span-5 lg:row-span-3">
          <div className="mb-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
              {interfaceTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {interfaceBody}
            </p>
          </div>
          <div className="mt-auto">
            <WhatsAppDemoVideo
              caption={videoCaption}
              fallbackLabel={videoFallback}
              label={interfaceTitle}
            />
          </div>
        </article>

        <dl className="grid gap-px bg-border md:col-span-12 sm:grid-cols-3 lg:col-span-7">
          {supportingMetrics.map((metric) => (
            <div key={metric.label} className="bg-background px-5 py-6 sm:px-6">
              <dt className="font-elegant text-3xl leading-none text-primary sm:text-4xl">
                {metric.value}
              </dt>
              <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {metric.label}
              </dd>
            </div>
          ))}
        </dl>

        <article className="bg-background p-6 md:col-span-7 lg:col-span-4">
          <h3 className="text-sm font-semibold text-foreground">{includedTitle}</h3>
          <ul className="mt-5 space-y-4">
            {included.map((item) => (
              <li
                key={item}
                className="grid grid-cols-[1.25rem_1fr] gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <span aria-hidden="true" className="font-mono text-xs text-primary">
                  +
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-background p-6 md:col-span-5 lg:col-span-3">
          <h3 className="text-sm font-semibold text-foreground">{limitsTitle}</h3>
          <ul className="mt-5 space-y-4">
            {limits.map((item) => (
              <li
                key={item}
                className="grid grid-cols-[1.25rem_1fr] gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-muted-foreground/60"
                >
                  –
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="bg-foreground text-background md:col-span-12">
          <ul className="grid sm:grid-cols-3 sm:divide-x sm:divide-background/15">
            {guarantees.map((item, index) => (
              <li
                key={item}
                className={`flex items-start gap-3 px-5 py-5 text-xs font-medium leading-relaxed text-background sm:px-6 ${
                  index > 0 ? "border-t border-background/15 sm:border-t-0" : ""
                }`}
              >
                <span aria-hidden="true" className="mt-0.5 text-primary">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
