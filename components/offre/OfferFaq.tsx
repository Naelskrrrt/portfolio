type FaqItem = {
  question: string;
  answer: string;
};

type OfferFaqProps = {
  items: FaqItem[];
};

export function OfferFaq({ items }: OfferFaqProps) {
  return (
    <div className="border-t border-border">
      {items.map((item, index) => (
        <details key={item.question} className="group border-b border-border">
          <summary className="grid cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-start gap-3 py-5 text-left text-sm font-medium text-foreground outline-none marker:content-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:text-base [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="font-mono text-[11px] font-normal text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{item.question}</span>
            <span aria-hidden="true" className="text-lg font-light leading-none text-primary group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="max-w-2xl pb-5 pl-11 pr-8 text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
