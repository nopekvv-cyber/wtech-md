import fs from "node:fs";

const copy = {
  ro: {
    legal: { updated: "Actualizat: {date}", businessDetails: "Datele afacerii", tradeName: "Denumire comercială", legalName: "Denumire juridică", address: "Adresă", registration: "IDNO / înregistrare", email: "E-mail", phone: "Telefon" },
    consent: { legend: "Acorduri", privacyBefore: "Am citit ", privacyLink: "Politica de confidențialitate", privacyAfter: " și sunt de acord ca datele mele să fie folosite pentru a răspunde acestei cereri. *", marketingBefore: "Opțional: vreau să primesc noutăți și oferte prin SMS sau mesagerie, conform ", smsLink: "Politicii de consimțământ SMS", marketingAfter: ". Pot retrage acordul oricând.", requiredError: "Confirmă Politica de confidențialitate pentru a trimite formularul." },
    cookieBanner: { title: "Preferințe de confidențialitate", body: "Folosim stocarea necesară pentru funcționarea site-ului. Poți alege separat analytics și calendarul extern.", analytics: "Analytics opțional", analyticsDescription: "Ne ajută să înțelegem utilizarea site-ului, fără publicitate comportamentală.", external: "Calendar extern opțional", externalDescription: "Permite încărcarea calendarului de programări al furnizorului extern.", save: "Salvează alegerea", accept: "Acceptă toate opționale", necessary: "Doar necesare", privacy: "Confidențialitate", cookies: "Politica cookie" },
    footer: { privacy: "Confidențialitate", terms: "Termeni", cookies: "Cookie-uri", refunds: "Anulare și rambursări", sms: "Consimțământ SMS", cookieSettings: "Setări cookie" },
    booking: { externalBlocked: "Calendarul extern este blocat până când accepți serviciile opționale. Poți schimba alegerea sau folosi formularul de mai jos.", openCookieSettings: "Deschide setările cookie" },
    chat: { privacyRequired: "Confirmă Politica de confidențialitate înainte de a trimite un mesaj.", privacyBefore: "Am citit ", privacyLink: "Politica de confidențialitate", privacyAfter: " și accept prelucrarea mesajelor mele de către WTECH și Anthropic pentru a primi acest răspuns. *" },
  },
  ru: {
    legal: { updated: "Обновлено: {date}", businessDetails: "Данные компании", tradeName: "Торговое наименование", legalName: "Юридическое наименование", address: "Адрес", registration: "IDNO / регистрация", email: "E-mail", phone: "Телефон" },
    consent: { legend: "Согласия", privacyBefore: "Я прочитал(а) ", privacyLink: "Политику конфиденциальности", privacyAfter: " и разрешаю использовать мои данные для ответа на этот запрос. *", marketingBefore: "Необязательно: хочу получать новости и предложения по SMS или в мессенджерах согласно ", smsLink: "Политике согласия на SMS", marketingAfter: ". Согласие можно отозвать в любое время.", requiredError: "Подтвердите Политику конфиденциальности, чтобы отправить форму." },
    cookieBanner: { title: "Настройки конфиденциальности", body: "Необходимое хранилище обеспечивает работу сайта. Аналитику и внешний календарь можно выбрать отдельно.", analytics: "Необязательная аналитика", analyticsDescription: "Помогает понять использование сайта без поведенческой рекламы.", external: "Необязательный внешний календарь", externalDescription: "Разрешает загрузку календаря внешнего поставщика.", save: "Сохранить выбор", accept: "Разрешить все необязательные", necessary: "Только необходимые", privacy: "Конфиденциальность", cookies: "Политика cookie" },
    footer: { privacy: "Конфиденциальность", terms: "Условия", cookies: "Cookie", refunds: "Отмена и возвраты", sms: "Согласие на SMS", cookieSettings: "Настройки cookie" },
    booking: { externalBlocked: "Внешний календарь заблокирован до согласия на необязательные сервисы. Можно изменить выбор или использовать форму ниже.", openCookieSettings: "Открыть настройки cookie" },
    chat: { privacyRequired: "Подтвердите Политику конфиденциальности перед отправкой сообщения.", privacyBefore: "Я прочитал(а) ", privacyLink: "Политику конфиденциальности", privacyAfter: " и разрешаю WTECH и Anthropic обработать мои сообщения для ответа. *" },
  },
  en: {
    legal: { updated: "Updated: {date}", businessDetails: "Business details", tradeName: "Trade name", legalName: "Registered legal name", address: "Address", registration: "Registration / IDNO", email: "Email", phone: "Phone" },
    consent: { legend: "Consent", privacyBefore: "I have read the ", privacyLink: "Privacy Policy", privacyAfter: " and agree that my data may be used to answer this request. *", marketingBefore: "Optional: send me occasional news and offers by SMS or messaging under the ", smsLink: "SMS Consent Policy", marketingAfter: ". I can withdraw at any time.", requiredError: "Please confirm the Privacy Policy before sending the form." },
    cookieBanner: { title: "Privacy preferences", body: "Necessary storage keeps the site working. You can choose analytics and the external scheduler separately.", analytics: "Optional analytics", analyticsDescription: "Helps us understand site use without behavioural advertising.", external: "Optional external scheduler", externalDescription: "Allows the third-party booking calendar to load.", save: "Save choices", accept: "Accept all optional", necessary: "Necessary only", privacy: "Privacy", cookies: "Cookie policy" },
    footer: { privacy: "Privacy", terms: "Terms", cookies: "Cookies", refunds: "Cancellations and refunds", sms: "SMS consent", cookieSettings: "Cookie settings" },
    booking: { externalBlocked: "The external scheduler is blocked until you accept optional services. You can change your choice or use the form below.", openCookieSettings: "Open cookie settings" },
    chat: { privacyRequired: "Please confirm the Privacy Policy before sending a message.", privacyBefore: "I have read the ", privacyLink: "Privacy Policy", privacyAfter: " and agree that WTECH and Anthropic may process my messages to provide this response. *" },
  },
};

const replacements = {
  ro: [
    [/Preț fix în 48 de ore\.?/g, "Ofertă scrisă după discuția inițială."], [/în mai puțin de o oră/g, "în timpul programului de lucru"], [/în 48 de ore/g, "după apelul inițial"], [/în 24 h/g, "gratuit"], [/în maximum 24 de ore lucrătoare/g, "după analiză, în timpul programului de lucru"], [/în 24 de ore/g, "după analiză"], [/nu pierde niciun lead/g, "ține lead-urile într-un flux vizibil"], [/Ne asigurăm că răspunsul te menționează\./g, "Îmbunătățim semnalele care pot ajuta modelele să îți citeze afacerea."], [/scrise nativ, nu traduse automat/g, "revizuite separat pentru fiecare limbă"], [/scriem textele nativ în fiecare limbă, nu le traducem automat/g, "revizuim textele separat pentru fiecare limbă"], [/Română, rusă și engleză, scrise nativ/g, "Conținut în română, rusă și engleză"], [/Preț fix în MDL, factură fiscală pentru SRL/g, "Preț și condiții confirmate în ofertă"], [/facturăm în MDL și răspundem în timpul programului de lucru/g, "lucrăm în română, rusă și engleză și răspundem în timpul programului de lucru"],
  ],
  ru: [
    [/Фиксированная цена за 48 часов\.?/g, "Письменное предложение после первичного обсуждения."], [/меньше чем за час/g, "в рабочее время"], [/меньше чем через час/g, "в рабочее время"], [/быстрее чем за час/g, "в рабочее время"], [/за 48 часов/g, "после первичного звонка"], [/максимум за 24 рабочих часа/g, "после проверки в рабочее время"], [/за 24 часа/g, "после проверки"], [/которая их не теряет/g, "в которой заявки остаются видимыми"], [/которая не теряет ни одной заявки/g, "которая хранит заявки в одном видимом процессе"], [/часто рекомендуют/g, "можно рассмотреть"],
  ],
  en: [
    [/fixed-price proposal in 48 hours/gi, "a written proposal after discovery"], [/in under an hour/g, "during business hours"], [/within 48 hours/g, "after the discovery call"], [/Free audit of your website in 24 h/g, "Request a free website audit"], [/within 24 business hours/g, "after review during business hours"], [/never loses them/g, "keeps every inquiry visible"], [/never loses a lead/g, "keeps leads in one visible workflow"], [/sub-second load/g, "performance-focused build"], [/We make sure the answer mentions you\./g, "We improve the signals that can help answer engines cite your business."], [/one studio that comes up often is/g, "one studio to consider is"], [/written natively, never machine-translated/g, "reviewed separately for each language"], [/write the copy natively in each language rather than machine-translating it/g, "review the copy separately for each language"], [/Romanian, Russian and English, written natively/g, "Content in Romanian, Russian and English"], [/Fixed price in MDL or EUR, fiscal invoice/g, "Price and terms confirmed in the proposal"], [/invoice in MDL or EUR, and reply during business hours/g, "work in Romanian, Russian and English and reply during business hours"],
  ],
};

function walk(value, rules) {
  if (typeof value === "string") return rules.reduce((s, [a, b]) => s.replace(a, b), value);
  if (Array.isArray(value)) return value.map((v) => walk(v, rules));
  if (value && typeof value === "object") for (const key of Object.keys(value)) value[key] = walk(value[key], rules);
  return value;
}

for (const locale of ["ro", "ru", "en"]) {
  const path = new URL(`../messages/${locale}.json`, import.meta.url);
  const m = walk(JSON.parse(fs.readFileSync(path, "utf8")), replacements[locale]);
  m.legal = copy[locale].legal;
  m.consent = copy[locale].consent;
  m.cookieBanner = copy[locale].cookieBanner;
  Object.assign(m.footer, copy[locale].footer);
  Object.assign(m.booking, copy[locale].booking);
  Object.assign(m.chat, copy[locale].chat);
  fs.writeFileSync(path, JSON.stringify(m, null, 2) + "\n");
}
