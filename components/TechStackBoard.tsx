"use client";

import { useMemo, useState } from "react";
import { Section } from "./Section";
import { cn } from "@/lib/utils";

export type SkillGroup = { label: string; items: string[] };
export type SkillProfile = { label: string; items: string[] };

interface TechStackBoardProps {
  title: string;
  filterLabel: string;
  groups: SkillGroup[];
  profiles: SkillProfile[];
}

/**
 * Technical skills, same presentation as the CV page.
 * Hovering (or focusing) a profile badge under the title lights up the skills
 * that profile relies on — only the chips change color, nothing is hidden.
 */
export function TechStackBoard({
  title,
  filterLabel,
  groups,
  profiles,
}: TechStackBoardProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned;

  const highlighted = useMemo(() => {
    const profile = profiles.find((item) => item.label === active);
    return profile ? new Set(profile.items) : null;
  }, [active, profiles]);

  return (
    <Section title={title}>
      <div
        role="group"
        aria-label={filterLabel}
        className="flex flex-wrap gap-1.5"
        onMouseLeave={() => setHovered(null)}
      >
        {profiles.map((profile) => {
          const isActive = active === profile.label;

          return (
            <button
              key={profile.label}
              type="button"
              aria-pressed={pinned === profile.label}
              onMouseEnter={() => setHovered(profile.label)}
              onFocus={() => setHovered(profile.label)}
              onBlur={() => setHovered(null)}
              onClick={() =>
                setPinned((current) =>
                  current === profile.label ? null : profile.label
                )
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                isActive
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
              )}
            >
              {profile.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-foreground">
              {group.label}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className={cn(
                    "px-2 py-0.5 rounded-md border text-xs transition-colors",
                    highlighted?.has(item)
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border bg-background/60 text-muted-foreground"
                  )}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
