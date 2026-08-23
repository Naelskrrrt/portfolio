import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_BOOKING_URL =
  "https://calendly.com/ralalanael/30-min-pour-identifier-5-a-10h-semaine-recuperables";

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL || DEFAULT_BOOKING_URL;

type BookingLinkProps = {
  children: ReactNode;
  className?: string;
  location?: string;
  ariaLabel?: string;
};

export function BookingLink({
  children,
  className,
  location,
  ariaLabel,
}: BookingLinkProps) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      data-location={location}
      className={cn(
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      {children}
    </a>
  );
}
