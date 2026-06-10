import { skillGroups } from "@/data/portfolioData";

export const parseSkillYears = (years: string) => {
  const parsedYears = Number.parseInt(years, 10);
  return Number.isFinite(parsedYears) ? parsedYears : 0;
};

export const maxSkillYears = Math.max(
  ...skillGroups.flatMap((group) => group.items.map((item) => parseSkillYears(item.years)))
);

const MIN_SKILL_FILL = 58;
const MAX_SKILL_FILL = 90;

export const skillFillFromYears = (years: string) => {
  const parsedYears = parseSkillYears(years);
  if (maxSkillYears <= 0) return 0;
  const normalizedYears = Math.min(parsedYears / maxSkillYears, 1);
  return Math.round(MIN_SKILL_FILL + normalizedYears * (MAX_SKILL_FILL - MIN_SKILL_FILL));
};
