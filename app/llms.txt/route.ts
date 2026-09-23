import { requestMarket, requestOrigin } from "@/lib/market-server";

export const dynamic = "force-dynamic";

const headers = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
};

export async function GET() {
  const origin = await requestOrigin();
  const international = (await requestMarket()) === "international";
  const body = international ? internationalText(origin) : moldovaText(origin);
  return new Response(body, { headers });
}

function moldovaText(origin: string) {
  return `# WTECH

> WTECH is a software studio in Chișinău, Republic of Moldova. It builds custom websites, CRM systems, AI agents, business automations, web and mobile applications, and technical SEO systems. The public website is available in Romanian, Russian and English.

## Primary pages
- Romanian home: ${origin}/
- Russian home: ${origin}/ru
- English home: ${origin}/en
- Services: ${origin}/servicii
- Pricing: ${origin}/preturi
- About: ${origin}/despre
- Contact: ${origin}/contact

## Service pages
- Website design and development: ${origin}/servicii/site-uri
- Custom CRM and dashboards: ${origin}/servicii/crm-dashboard
- AI agents for customer inquiries: ${origin}/servicii/angajati-ai
- Business process automation: ${origin}/servicii/automatizari
- Custom software and applications: ${origin}/servicii/software-la-comanda
- Technical SEO and AI-search visibility: ${origin}/servicii/ai-seo

## Commercial facts
- Published project packages start at EUR 600: ${origin}/preturi
- The written proposal confirms scope, timeline and final price.
- Domain, hosting, third-party subscriptions, AI usage and SMS are priced separately unless the proposal says otherwise.
- Contact: hello@wtech.md

## Editorial policy
- Public claims should be factual and verifiable.
- Demonstration interfaces and illustrative data are labelled as examples.
- Search rankings and citations by AI systems are not guaranteed.
`;
}

function internationalText(origin: string) {
  return `# WTECH

> WTECH is a European software studio serving companies in the United States, Canada, Australia and Europe. It builds websites, booking systems, custom CRM, AI agents, automations, web and mobile applications, and technical SEO systems.

## Primary pages
- Home: ${origin}/
- Services: ${origin}/services
- Pricing: ${origin}/pricing
- Work: ${origin}/work
- About: ${origin}/about
- Contact: ${origin}/contact

## Service pages
- Websites: ${origin}/services/websites
- Custom CRM and dashboards: ${origin}/services/crm-dashboards
- AI agents: ${origin}/services/ai-employees
- Business automation: ${origin}/services/automations
- Custom software: ${origin}/services/custom-software
- Technical SEO and AI-search visibility: ${origin}/services/ai-seo

## Commercial facts
- Pricing is localized by market on ${origin}/pricing
- The written proposal confirms scope, milestones and final price.
- Taxes, hosting and third-party usage charges are handled as described in the proposal.
- Contact: hello@wtech.md

## Editorial policy
- Public claims should be factual and verifiable.
- Demonstration interfaces and illustrative data are labelled as examples.
- Search rankings and citations by AI systems are not guaranteed.
`;
}
