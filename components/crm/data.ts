// Demo data for the CRM showcase. Company names are plausible Moldovan SRLs invented for the demo,
// not clients or testimonials. Industry labels come from messages (crm.industries.*).
export type ColumnKey = "new" | "contacted" | "offer" | "won";
export type Card = { id: string; company: string; industry: string; amount: number; days: number; initials: string };

export const initialColumns: Record<ColumnKey, Card[]> = {
  new: [
    { id: "c1", company: "Nordic Tech SRL", industry: "software", amount: 12000, days: 12, initials: "AS" },
    { id: "c2", company: "AgroPlus Nord", industry: "agro", amount: 8500, days: 11, initials: "TR" },
    { id: "c3", company: "Delta Construct", industry: "construction", amount: 15000, days: 10, initials: "IG" },
  ],
  contacted: [
    { id: "c4", company: "EuroTrade SRL", industry: "trade", amount: 25000, days: 9, initials: "CS" },
    { id: "c5", company: "Moldova Foods", industry: "food", amount: 18000, days: 8, initials: "PV" },
    { id: "c6", company: "Innova Group", industry: "it", amount: 32000, days: 6, initials: "AL" },
  ],
  offer: [
    { id: "c7", company: "Vinăria Codru", industry: "wine", amount: 45000, days: 5, initials: "DR" },
    { id: "c8", company: "Farmacia Familiei", industry: "pharmacy", amount: 22000, days: 4, initials: "MC" },
    { id: "c9", company: "TransCargo MD", industry: "logistics", amount: 28000, days: 3, initials: "SB" },
  ],
  won: [
    { id: "c10", company: "Dental Art", industry: "dental", amount: 60000, days: 2, initials: "ET" },
    { id: "c11", company: "Bucuria Group", industry: "confectionery", amount: 35000, days: 29, initials: "VL" },
    { id: "c12", company: "Mobilex SRL", industry: "furniture", amount: 52000, days: 21, initials: "IN" },
  ],
};

export const extraCounts: Record<ColumnKey, number> = { new: 25, contacted: 19, offer: 12, won: 9 };

export const revenue = [
  { m: 0, v: 120 }, { m: 1, v: 210 }, { m: 2, v: 330 }, { m: 3, v: 300 }, { m: 4, v: 380 }, { m: 5, v: 450 },
  { m: 6, v: 600 }, { m: 7, v: 700 }, { m: 8, v: 680 }, { m: 9, v: 820 }, { m: 10, v: 950 }, { m: 11, v: 1200 },
];

export const followups = [
  { time: "09:00", company: "Vinăria Codru", key: "f1", urgent: true },
  { time: "11:30", company: "Dental Art", key: "f2", urgent: true },
  { time: "14:00", company: "Farmacia Familiei", key: "f3", urgent: false },
  { time: "16:00", company: "EuroTrade SRL", key: "f4", urgent: false },
] as const;

export function numberLocaleForCurrency(currency: string) {
  return ({ USD: "en-US", CAD: "en-CA", AUD: "en-AU", GBP: "en-GB", EUR: "en-IE" } as Record<string, string>)[currency] ?? "en-US";
}

export function formatNumber(n: number, currency: string) {
  return new Intl.NumberFormat(numberLocaleForCurrency(currency), { maximumFractionDigits: 0 }).format(n).replace(/ /g, " ");
}

export function formatMoney(n: number, currency: string) {
  return `${formatNumber(n, currency)} ${currency}`;
}
