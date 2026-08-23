export type TelegramBriefCopy = {
  status: string;
  you: string;
  userMessage: string;
  assistant: string;
  response: string;
  sourceLabel: string;
  sourceValue: string;
  actionLabel: string;
  actionValue: string;
  buttons: string[];
};

type TelegramBriefProps = {
  label: string;
  copy: TelegramBriefCopy;
};

export function TelegramBrief({ label, copy }: TelegramBriefProps) {
  return (
    <figure aria-label={label} className="overflow-hidden rounded-2xl border border-[#2a3b4a] bg-[#0e1621] text-[#f4f7f9] shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
      <figcaption className="sr-only">{label}</figcaption>

      <div className="flex items-center gap-3 border-b border-[#243443] bg-[#17212b] px-4 py-3">
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-full bg-[#d8782f] text-xs font-semibold text-white"
        >
          FA
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{copy.assistant}</p>
          <p className="truncate text-[11px] text-[#79b7df]">{copy.status}</p>
        </div>
        <svg
          aria-hidden="true"
          className="ml-auto size-4 text-[#78909c]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </div>

      <div className="flex flex-col gap-4 px-3 py-5 sm:px-5">
        <div className="ml-auto max-w-[88%] rounded-xl rounded-br-sm bg-[#2b5278] px-3.5 py-2.5">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b9d9ee]">
            {copy.you}
          </p>
          <p className="text-[13px] leading-relaxed text-white">{copy.userMessage}</p>
        </div>

        <div className="max-w-[94%] rounded-xl rounded-bl-sm bg-[#182533] px-3.5 py-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#e69a62]">
            {copy.assistant}
          </p>
          <p className="text-[13px] leading-relaxed text-[#eef3f6]">{copy.response}</p>

          <dl className="mt-3 divide-y divide-[#2b3c4b] border-y border-[#2b3c4b] text-[11px]">
            <div className="grid grid-cols-[5.5rem_1fr] gap-3 py-2">
              <dt className="text-[#8ca1af]">{copy.sourceLabel}</dt>
              <dd className="text-[#d5e2e9]">{copy.sourceValue}</dd>
            </div>
            <div className="grid grid-cols-[5.5rem_1fr] gap-3 py-2">
              <dt className="text-[#8ca1af]">{copy.actionLabel}</dt>
              <dd className="text-[#d5e2e9]">{copy.actionValue}</dd>
            </div>
          </dl>
        </div>

        <div className="grid grid-cols-2 gap-2" role="group" aria-label={copy.actionLabel}>
          {copy.buttons.map((button, index) => (
            <span
              key={button}
              className={`rounded-lg border px-3 py-2 text-center text-[11px] font-medium ${
                copy.buttons.length % 2 === 1 && index === copy.buttons.length - 1
                  ? "col-span-2 "
                  : ""
              }${
                index === 0
                  ? "border-[#4f92bd] text-[#7fc4ed]"
                  : "border-[#344958] text-[#a9bac4]"
              }`}
            >
              {button}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}
