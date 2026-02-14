import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
}

export function Section({ title, children, className, withBorder = true }: SectionProps) {
  return (
    <section
      className={cn(
        "py-8 lg:py-16 px-4",
        withBorder && "border-t border-border",
        className
      )}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <h2 className="text-3xl lg:text-4xl font-elegant italic tracking-tight">{title}</h2>
        {children}
      </div>
    </section>
  );
}
