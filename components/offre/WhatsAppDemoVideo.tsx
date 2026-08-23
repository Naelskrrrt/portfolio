const WHATSAPP_DEMO_URL =
  "https://drive.google.com/file/d/14zJ25pmsGQ9gc-jqx4xXu4OS05FoH2A0/view?usp=sharing";

type WhatsAppDemoVideoProps = {
  label: string;
  caption: string;
  fallbackLabel: string;
};

export function WhatsAppDemoVideo({
  label,
  caption,
  fallbackLabel,
}: WhatsAppDemoVideoProps) {
  return (
    <figure
      aria-label={label}
      className="mx-auto w-full max-w-[22rem] overflow-hidden rounded-2xl border border-border bg-[#0b141a] shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
    >
      <video
        aria-label={label}
        className="aspect-[9/16] w-full bg-black object-contain"
        controls
        playsInline
        poster="/media/whatsapp-demo-poster.jpg"
        preload="metadata"
      >
        <source src="/media/whatsapp-demo.mp4" type="video/mp4" />
        <a href={WHATSAPP_DEMO_URL} rel="noreferrer" target="_blank">
          {fallbackLabel}
        </a>
      </video>

      <figcaption className="flex flex-col gap-2 border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-white/65 sm:flex-row sm:items-center sm:justify-between">
        <span>{caption}</span>
        <a
          className="shrink-0 font-medium text-white underline decoration-white/35 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          href={WHATSAPP_DEMO_URL}
          rel="noreferrer"
          target="_blank"
        >
          {fallbackLabel}
          <span aria-hidden="true"> ↗</span>
        </a>
      </figcaption>
    </figure>
  );
}
