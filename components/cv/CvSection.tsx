import { cn } from "@/lib/utils";

interface CvSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function CvSection({ title, children, className }: CvSectionProps) {
  return (
    <section className={cn("border-t border-border py-8 lg:py-10", className)}>
      <h2 className="text-2xl lg:text-3xl font-elegant italic tracking-tight">
        {title}
      </h2>
      <div className="cv-section-body mt-5">{children}</div>
    </section>
  );
}
