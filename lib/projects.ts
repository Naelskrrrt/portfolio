export const PROJECT_CATEGORIES = [
  "all",
  "agentic",
  "automation",
  "saas",
  "data",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export type Project = {
  id: string;
  categories: Exclude<ProjectCategory, "all">[];
  metric: string;
  stack: string[];
  results: string[];
  href?: string;
  featured?: boolean;
  highlight?: boolean;
  caseStudySlug?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "minia",
    results: ["35-50h", "21", "6+"],
    categories: ["agentic"],
    metric: "35-50h",
    stack: [
      "Hermes Agent",
      "Orchestration multi-agent",
      "FastAPI + SQLite",
      "Telegram / WhatsApp",
      "Gmail / CRM / Pennylane",
    ],
    href: "https://minia-landing.netlify.app",
    featured: true,
    highlight: true,
    caseStudySlug: "minia-chief-of-staff-ia",
  },
  {
    id: "prospection",
    results: ["400+", "3×", "0"],
    categories: ["agentic", "automation"],
    metric: "400+",
    stack: ["n8n", "Agents IA", "Clay", "Lemlist"],
    highlight: true,
  },
  {
    id: "datahub",
    results: ["+25h", "10+", "1"],
    categories: ["data"],
    metric: "+25h",
    stack: ["Data warehouse", "Monitoring IA", "API REST"],
    highlight: true,
  },
  {
    id: "orchestrateur",
    results: ["+82%", "4", "0"],
    categories: ["agentic"],
    metric: "+82%",
    stack: ["Telegram Bot", "Orchestration IA", "OpenClaw"],
  },
  {
    id: "support",
    results: ["80%", "-45%", "<30s"],
    categories: ["agentic"],
    metric: "80%",
    stack: ["RAG", "WhatsApp API", "Zendesk"],
  },
  {
    id: "rh",
    results: ["-60%", "18j", "300+"],
    categories: ["automation"],
    metric: "-60%",
    stack: ["NLP", "n8n", "Google Calendar", "Notion"],
  },
  {
    id: "stocks",
    results: ["-35%", "+8%", "-20%"],
    categories: ["data"],
    metric: "-35%",
    stack: ["ML / Python", "ERP SAP", "API temps réel"],
    highlight: true,
  },
  {
    id: "reporting",
    results: ["2j → 15min", "8", "100%"],
    categories: ["automation"],
    metric: "2j → 15min",
    stack: ["Shopify API", "n8n", "Notion", "GPT-4"],
    highlight: true,
    caseStudySlug: "reporting-automation",
  },
  {
    id: "telavie",
    results: ["3", "HDS", "Socket"],
    categories: ["saas"],
    metric: "3",
    stack: [
      "Next.js",
      "PostgreSQL",
      "Prisma",
      "Serveur HDS",
      "SWR",
      "Socket",
    ],
    href: "https://www.telavie.fr",
    highlight: true,
    caseStudySlug: "telavie-plateforme-sante",
  },
  {
    id: "talentfindr",
    results: ["800M+", "1 500+", "10+"],
    categories: ["saas", "agentic"],
    metric: "800M+",
    stack: ["Retool", "Xano", "n8n", "OpenAI"],
    href: "https://www.talentfindr.ai",
    highlight: true,
    caseStudySlug: "talentfindr-sourcing-ia",
  },
  {
    id: "growit",
    results: ["4", "1", "0"],
    categories: ["agentic"],
    metric: "4",
    stack: ["Agents IA", "CRM"],
  },
  {
    id: "mojo",
    results: ["24/7", "3", "1"],
    categories: ["saas", "agentic"],
    metric: "24/7",
    stack: ["WhatsApp", "Agents IA"],
  },
  {
    id: "automations",
    results: ["2 000+", "4", "2"],
    categories: ["automation"],
    metric: "2 000+",
    stack: ["n8n", "Make"],
  },
];

export const CASE_STUDIES = PROJECTS.filter(
  (project): project is Project & { caseStudySlug: string } =>
    Boolean(project.caseStudySlug)
);

export function getCaseStudyBySlug(slug: string) {
  return CASE_STUDIES.find((project) => project.caseStudySlug === slug);
}
