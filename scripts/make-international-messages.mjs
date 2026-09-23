import fs from "node:fs";

const file = new URL("../messages/en.json", import.meta.url);
const out = new URL("../messages/en-intl.json", import.meta.url);
const m = JSON.parse(fs.readFileSync(file, "utf8"));

m.meta.home = {
  title: "WTECH | Websites, CRM, AI and custom software",
  description: "Premium websites, booking systems, custom CRM, AI employees, automation and mobile apps for businesses in the USA, Canada, Australia and Europe. Written project proposal after discovery.",
};
m.meta.services.title = "Website, CRM and AI services | WTECH";
m.meta.services.description = "Premium websites, CRM and dashboards, AI employees, automation, custom software and AI SEO for businesses in the USA, Canada, Australia and Europe.";
m.meta.work = {
  title: "Website, CRM and AI projects | WTECH",
  description: "Explore WTECH website, custom CRM and AI assistant work, with real projects and demonstration concepts labelled clearly.",
};
m.meta.pricing.title = "International website, CRM and AI pricing | WTECH";
m.meta.pricing.description = "Five cumulative WTECH packages for landing pages, business websites, booking systems, custom CRM, AI and mobile apps. International project prices from USD 1,490.";
m.meta.contact = {
  title: "Contact WTECH | International software studio",
  description: "Talk with WTECH about a website, CRM, AI agent, automation or custom software project. Send a message or book a 30-minute discovery call.",
};
m.meta.audit = {
  title: "Free website, SEO and conversion audit | WTECH",
  description: "Send your website address for a review of speed, technical SEO, conversion and visibility in Google Search and AI answers.",
};
m.meta.about = {
  title: "About WTECH | International software studio",
  description: "WTECH is a European software studio serving businesses in the USA, Canada, Australia and Europe with websites, CRM, AI employees, automation and custom applications.",
};
m.meta.blog.description = "Practical guides on websites, CRM, automation and AI SEO for international businesses.";

m.hero.sub = "Premium websites, CRM, AI employees and automation — one connected system for businesses in the USA, Canada, Australia and Europe.";
m.hero.facts.city = "USA · Canada · Australia · Europe";

m.services.items.websites.intro = "Conversion-focused business websites with original design, purposeful motion, reviewed English copy, fast loading and forms connected directly to your CRM.";
m.services.items.websites.pageTitle = "Custom business website development";
m.services.items.websites.seoTitle = "Custom business website development | WTECH";
m.services.items.websites.seoDescription = "Custom business websites with original design, responsive development, reviewed English content, performance work and forms connected to your workflow.";
m.services.items.websites.b2 = "English content reviewed for the target market, responsive across desktop, tablet and mobile.";
m.services.items.crm.intro = "Custom CRM development built around your sales and service process. Pipeline, customer history, tasks, reporting and AI follow-up without per-seat lock-in.";
m.services.items.crm.pageTitle = "Custom CRM and dashboard development";
m.services.items.crm.seoTitle = "Custom CRM and dashboard development | WTECH";
m.services.items.crm.seoDescription = "CRM systems and dashboards built around your sales and service process, with pipelines, reports, integrations and client-owned data.";
m.services.items.ai.intro = "AI agents that answer through your website and messaging channels, qualify leads, send information, book meetings and write every conversation into the CRM.";
m.services.items.ai.pageTitle = "AI agents for customer inquiries";
m.services.items.ai.seoTitle = "AI agents for customer inquiries | WTECH";
m.services.items.ai.seoDescription = "English-language AI agents for websites and messaging: inquiry handling, lead qualification, bookings, CRM updates and transfer to a human operator.";
m.services.items.ai.b1 = "Answers in English, 24/7, on every connected channel.";
m.services.items.automations.intro = "Business automation connecting CRM, email, forms, messaging, invoicing and reporting into one visible workflow that your team controls.";
m.services.items.automations.pageTitle = "Business process automation";
m.services.items.automations.seoTitle = "Business process automation services | WTECH";
m.services.items.automations.seoDescription = "Connect CRM, email, forms, messaging, invoicing and reporting in observable workflows adapted to your company and existing tools.";
m.services.items.automations.b4 = "Connect QuickBooks, Xero, Stripe, HubSpot, Salesforce and other systems through their APIs.";
m.services.items.software.intro = "Web apps, mobile apps and integrations built in two-week sprints, with senior English-speaking project management and code that stays yours.";
m.services.items.software.pageTitle = "Custom web and mobile software development";
m.services.items.software.seoTitle = "Custom web and mobile software development | WTECH";
m.services.items.software.seoDescription = "Web apps, mobile apps, internal platforms and integrations delivered in planned sprints with English project management and client-owned code.";
m.services.items.software.b2 = "Integrations with Stripe, QuickBooks, Xero, HubSpot, Salesforce, Google Workspace and industry APIs.";
m.services.items.seo.intro = "Technical SEO and answer-engine optimization: useful English content, structured data, entity pages and transparent measurement. Search positions and AI citations are monitored, not guaranteed.";
m.services.items.seo.pageTitle = "Technical SEO and AI search visibility";
m.services.items.seo.seoTitle = "Technical SEO and AI search visibility | WTECH";
m.services.items.seo.seoDescription = "Technical SEO, useful content, structured data, entity clarity and transparent measurement for Google Search and AI answer engines.";
m.services.items.seo.b2 = "Monthly English content: AI-assisted, human-edited and published on schedule.";
m.proof.l1 = "projects delivered";

m.ai.chat.m2 = "Hi, Andrei! I have prepared a tailored proposal for the presentation website. The START package begins at USD 1,490 excluding applicable taxes, and delivery takes 2–3 weeks.";
m.ai.roi.value = "Average order value (USD)";
m.ai.roi.result = "USD recovered per month";

m.automations.l1 = "We connect HubSpot, Salesforce, QuickBooks, Xero, Google Workspace, WhatsApp Business and your existing tools.";
m.automations.l2 = "Invoices, payments and customer updates are confirmed automatically in the CRM.";
m.software.p = "Web apps, mobile apps and integrations built around your process in two-week sprints, with code and data that stay yours.";
m.seo.question = "Who builds premium business websites and connected CRM systems?";
m.seo.answerIntro = "For businesses that want the website, CRM and AI workflow built as one system, one studio to consider is ";
m.seo.answerBody = ", a European team serving clients across the USA, Canada, Australia and Europe with fixed-scope delivery and English-speaking project management.";
m.seo.ranking.k1 = "premium web development agency";
m.seo.ranking.k2 = "custom CRM development";
m.seo.ranking.k3 = "AI automation agency";
m.seo.ranking.k4 = "business software development";
m.seo.ranking.k5 = "nearshore development team";
m.seo.l2 = "English content engine: AI-assisted, human-edited and published monthly.";
m.audit.whatsappPlaceholder = "+1 555 000 0000";

Object.assign(m.pricing, {
  eyebrow: "International WTECH packages",
  title: "Five levels. One system that grows with your business.",
  sub: "Senior nearshore delivery priced below typical local full-service agencies in our target markets. Every package includes the previous one; all prices are total project prices in USD.",
  currency: "USD",
  r1p: "1,490",
  r2p: "3,490",
  r3p: "6,900",
  r4p: "14,900",
  r5p: "29,900",
  r5note: "From USD 29,900. This package is fully tailored; the final price varies with workflows, integrations, data migration, compliance and launch markets.",
  includedText: "English delivery, discovery, custom design, two design revision rounds, responsive implementation, QA, launch, admin training and 30 days of defect support against the agreed scope.",
  separateText: "Domain, hosting, third-party subscriptions, AI usage, SMS, paid assets and Apple or Google publishing accounts. Ongoing maintenance is quoted separately.",
  individualText: "E-commerce, payments, ERP or accounting integrations, regulated data, complex migration, multiple brands or branches and enterprise workflows.",
  vat: "Applicable sales tax, GST or VAT is added according to the client location and invoice rules.",
  note: "The proposal confirms scope, milestones and a fixed project price. Payments are staged against delivery milestones.",
});

m.faq.a1 = "International WTECH packages start at USD 1,490 for START, USD 3,490 for BUSINESS, USD 6,900 for BOOKING, USD 14,900 for CRM & AI and USD 29,900 for COMPLETE. Each package includes the previous one; applicable tax is added separately.";
m.faq.a4 = "On Vercel, AWS, Azure, Google Cloud, your own infrastructure or another provider agreed in the proposal. We keep the application portable and hand over the code and deployment documentation.";
m.faq.q5 = "Do you work with international teams?";
m.faq.a5 = "Yes. Delivery, documentation and project management are available in English, with planned overlap for North American, European and Australian working hours.";
m.faq.a7 = "Yes. The packages are designed for small and mid-sized companies that need a serious website or operating system without large-agency overhead.";
m.faq.a1_short = "You receive a written project price after the discovery call. The five international packages are priced in USD.";

m.footer.tagline = "Software that runs your business. Built in Europe, delivered internationally.";
m.footer.languages = "Market";
m.about.p1 = "WTECH is a European software studio building premium websites, booking systems, custom CRM, AI employees, automation and mobile applications for businesses in the USA, Canada, Australia and Europe.";
m.about.p2 = "You work directly with an English-speaking product team. We combine original design, reliable engineering and connected business workflows without large-agency overhead.";
m.about.f1 = "European team with international delivery";
m.about.f2 = "English-speaking project management and documentation";
m.about.f3 = "Fixed project price in USD or EUR";
m.blog.sub = "Practical guides on websites, CRM, automation and AI SEO for international businesses.";
m.schema.orgDescription = "European software studio serving the USA, Canada, Australia and Europe with premium websites, CRM, AI employees, automation and custom software.";
m.schema.areaServed = "USA, Canada, Australia and Europe";
m.chat.subtitle = "Answers in English about everything we build";
m.chat.s3 = "Can you integrate our current tools?";

fs.writeFileSync(out, JSON.stringify(m, null, 2) + "\n");
