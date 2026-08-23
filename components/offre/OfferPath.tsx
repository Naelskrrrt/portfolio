import type { OfferPathId } from "@/lib/offer";

export type OfferPathStep = {
  id: OfferPathId;
  kicker: string;
  title: string;
  situation: string;
  result: string;
  pricePrefix: string;
  price: string | null;
  duration: string;
  scope: string;
};

type OfferPathProps = {
  steps: OfferPathStep[];
};

export function OfferPath({ steps }: OfferPathProps) {
  return (
    <ol className="relative grid gap-8 before:absolute before:bottom-3 before:left-[0.6875rem] before:top-3 before:w-px before:bg-border lg:grid-cols-5 lg:gap-4 lg:before:bottom-auto lg:before:left-[10%] lg:before:right-[10%] lg:before:top-[0.6875rem] lg:before:h-px lg:before:w-auto">
      {steps.map((step, index) => {
        const isPilot = step.id === "pilot";

        return (
          <li
            key={step.id}
            className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4 lg:grid-cols-1 lg:gap-5"
          >
            <span
              aria-hidden="true"
              className={`relative z-10 flex size-6 items-center justify-center rounded-full border font-mono text-[10px] tabular-nums ${
                isPilot
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {index + 1}
            </span>

            <article
              className={`min-w-0 border-t pt-4 lg:pt-5 ${
                isPilot
                  ? "border-primary lg:-mx-2 lg:px-2"
                  : "border-border"
              }`}
            >
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
                {step.kicker}
              </p>
              <h3 className="mt-2 text-lg font-medium leading-tight text-foreground">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.situation}
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">
                {step.result}
              </p>

              <div className="mt-5 border-t border-border/70 pt-3">
                <p className="text-sm font-semibold text-foreground">
                  {step.pricePrefix}
                  {step.price ? ` ${step.price}` : ""}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {step.duration}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {step.scope}
                </p>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
