export const blogSlugs = ["cat-costa-un-site-in-moldova-2026", "crm-pentru-afaceri-moldova", "ai-seo-moldova-chatgpt-gemini"] as const;
export type BlogSlug = (typeof blogSlugs)[number];
export const blogMeta: Record<BlogSlug, { key: "p1" | "p2" | "p3"; minutes: number; date: string }> = {
  "cat-costa-un-site-in-moldova-2026": { key: "p1", minutes: 7, date: "2026-09-01" },
  "crm-pentru-afaceri-moldova": { key: "p2", minutes: 8, date: "2026-09-05" },
  "ai-seo-moldova-chatgpt-gemini": { key: "p3", minutes: 9, date: "2026-09-10" },
};
