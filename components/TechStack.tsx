import { useTranslations } from "next-intl";
import {
  TechStackBoard,
  type SkillGroup,
  type SkillProfile,
} from "./TechStackBoard";

export function TechStack() {
  const t = useTranslations("CV");
  const skillGroups = t.raw("skills.groups") as SkillGroup[];
  const skillProfiles = t.raw("skills.profiles") as SkillProfile[];

  return (
    <TechStackBoard
      title={t("skills.title")}
      filterLabel={t("skills.filterLabel")}
      groups={skillGroups}
      profiles={skillProfiles}
    />
  );
}
