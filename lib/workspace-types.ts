export const stages = [
  "new",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
  "nurture",
] as const;
export type Role = "owner" | "sales" | "delivery" | "finance" | "client";
export type WorkspaceLead = {
  id: number;
  created_at: string;
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  interest: string | null;
  channel: string | null;
  source: string | null;
  stage: (typeof stages)[number];
  next_action: string | null;
  follow_up_at: string | null;
  value: number;
  currency: string;
  handled: boolean;
  delivered: boolean;
  owner_id: string | null;
  version: number;
  privacy_version: string | null;
  marketing_consent: boolean | null;
};
export type LeadNote = {
  id: string;
  title: string;
  status: "open" | "done" | "blocked";
  lead_id: number | null;
  due_at: string | null;
  payload: { notes?: string };
  version: number;
  created_at: string;
  updated_at: string;
};
export const stageLabels: Record<string, string> = {
  new: "Nou",
  qualified: "Calificat",
  proposal: "Propunere",
  negotiation: "Negociere",
  won: "Câștigat",
  lost: "Pierdut",
  nurture: "Nurture",
};
