import type { Locale } from "@/i18n/routing";

export type LegalDocumentKey = "privacy" | "terms" | "cookies" | "refunds" | "sms";

type Section = { title: string; paragraphs?: string[]; bullets?: string[] };
export type LegalDocument = { title: string; summary: string; updated: string; sections: Section[] };

const updated = "23 September 2026";

const en: Record<LegalDocumentKey, LegalDocument> = {
  privacy: {
    title: "Privacy Policy",
    summary: "How WTECH collects, uses, stores and protects personal information when you visit the site, use Ana, request an audit or contact us.",
    updated,
    sections: [
      { title: "1. Who is responsible", paragraphs: ["The controller is the business operating under the wtech.md trade name, identified in the Business details section on this page. Questions and privacy requests can be sent to the published privacy email."] },
      { title: "2. Information we collect", bullets: ["Contact and booking requests: name, phone or WhatsApp number, optional email, company, preferred time and project message.", "Audit requests: website URL, email, WhatsApp number and whether AI visibility should be included.", "Ana chat: the messages you submit and, only if you choose to provide them, contact details for follow-up.", "Technical and security data: IP address, request time, country inferred by the hosting provider, browser and server logs, and anti-abuse signals.", "Consent records: the notice version, date, form source and whether optional SMS or messaging marketing was accepted."] },
      { title: "3. Why we use it", bullets: ["To answer your request, prepare an audit or proposal, schedule a call and take steps you requested before entering a contract.", "To deliver a contract, provide support, keep accounting records and establish or defend legal claims.", "To secure the site, prevent spam and abuse, diagnose failures and keep the service available.", "To measure site use only after optional analytics consent where consent is required.", "To send marketing SMS, WhatsApp or email only when you gave separate optional consent or another lawful basis clearly applies."] },
      { title: "4. Service providers and international transfers", paragraphs: ["We use providers only as needed to run the service. They may process data in Moldova, the EU, the United States or other locations under their contractual safeguards."], bullets: ["Vercel for hosting, delivery, request logs and approximate country detection.", "Supabase for the lead database and application storage.", "Anthropic for Ana chat responses; do not submit passwords, payment data, health data or confidential documents in chat.", "Email and Telegram notification services, when configured, to alert the WTECH team about a request.", "Cal.com or another scheduler only when configured and loaded after your optional-services choice.", "Umami analytics only when configured and loaded after consent.", "WhatsApp, Telegram, Viber or your telephone provider when you choose those external channels."] },
      { title: "5. Retention and security", paragraphs: ["Ordinary inquiries are scheduled for review and deletion or anonymisation 12 months after the last meaningful contact. Contract, invoice and dispute records may be kept longer where tax, accounting or legal rules require it. Short-lived security logs are kept only as long as needed for security and troubleshooting. We use access controls, encrypted connections and restricted administrator access, but no online service can promise absolute security."] },
      { title: "6. Your choices and rights", paragraphs: ["Depending on your location, you may ask for access, correction, deletion, restriction, portability or objection, withdraw consent, or complain to a data-protection authority. California residents may also have rights to know, correct and delete data and to opt out of sale or sharing. WTECH does not sell personal information or share it for cross-context behavioural advertising. We will verify requests proportionately before acting."] },
      { title: "7. Children and sensitive information", paragraphs: ["This business service is not directed to children under 18. Do not send government identifiers, passwords, payment-card details, health information or other sensitive information through public forms or Ana."] },
      { title: "8. Changes", paragraphs: ["We may update this notice when providers, features or legal requirements change. The effective date at the top identifies the current version. Material changes will be highlighted where appropriate."] },
    ],
  },
  terms: {
    title: "Website Terms and Conditions",
    summary: "Rules for using the WTECH website and requesting professional services.",
    updated,
    sections: [
      { title: "1. Scope", paragraphs: ["These terms govern use of the public website, Ana chat, audit request and contact tools. A project starts only when both parties approve a written proposal or sign a separate agreement. That project agreement controls if it conflicts with these website terms."] },
      { title: "2. Business information and quotations", paragraphs: ["Website prices are starting prices and do not create a binding offer. Scope, milestones, taxes, third-party costs, delivery dates and final price are confirmed in writing. Unless a proposal says otherwise, quotations expire after 30 days."] },
      { title: "3. Acceptable use", bullets: ["Do not attack, scrape excessively, disrupt or attempt unauthorised access to the site or CRM.", "Do not submit unlawful material, malware, secrets belonging to others, or personal data you are not authorised to provide.", "Do not use Ana for emergencies, legal, medical, financial or other high-stakes decisions."] },
      { title: "4. Intellectual property", paragraphs: ["WTECH owns the website, brand, interface and original site content unless stated otherwise. Work created for a client is licensed or assigned only as stated in the signed project agreement and after the agreed payments. Portfolio visuals marked as concepts are illustrative and are not client endorsements or proof of deployment."] },
      { title: "5. AI and third-party services", paragraphs: ["Ana can make mistakes and does not replace a written proposal or professional advice. External services have their own terms and availability. WTECH is not responsible for an external service outside its control, but will use reasonable care when selecting and integrating providers."] },
      { title: "6. Warranties and liability", paragraphs: ["The public site is provided on an as-available basis. Nothing excludes liability or mandatory rights that cannot lawfully be excluded. For business users, liability arising from a paid project is governed by the signed project agreement; indirect or speculative losses are excluded to the extent permitted by law."] },
      { title: "7. Governing law", paragraphs: ["These website terms are governed by the laws of the Republic of Moldova, without removing mandatory protections that apply to a consumer in their country. The services are intended primarily for businesses. Any consumer engagement must be confirmed in writing with the required pre-contract information."] },
      { title: "8. Contact", paragraphs: ["Send legal notices or questions to the business and email listed in the Business details section below."] },
    ],
  },
  cookies: {
    title: "Cookie and Storage Policy",
    summary: "The site uses necessary storage and loads optional analytics or embedded scheduling only after your choice.",
    updated,
    sections: [
      { title: "1. What this covers", paragraphs: ["Cookie rules also cover local storage, scripts, tags and similar technologies that store or access information on your device."] },
      { title: "2. Necessary technologies", bullets: ["wtech_consent_v1 in local storage remembers your privacy choice. It is necessary to avoid asking on every page.", "wtech_locale is a first-party preference cookie created when you deliberately switch language. It lasts up to one year.", "wtech_admin_session is a secure, HTTP-only administrator cookie on /admin. Public visitors do not receive it.", "Security, load-balancing and delivery technologies may be applied by the hosting provider where strictly necessary to provide and protect the service."] },
      { title: "3. Optional analytics", paragraphs: ["When Umami analytics is configured, its script is blocked until you accept optional technologies. We use analytics to understand page and feature use, not for behavioural advertising. Refusing does not restrict access to the site."] },
      { title: "4. Embedded scheduler", paragraphs: ["When an external scheduler is configured, its iframe is not loaded until optional services are enabled. You can use the first-party callback form instead. After loading an embed, the provider may apply its own storage and privacy terms."] },
      { title: "5. Manage your choice", paragraphs: ["Use Cookie settings in the footer at any time. Rejecting optional technologies is as easy as accepting them. Browser controls can also delete stored preferences, after which the site will ask again."] },
      { title: "6. External links", paragraphs: ["WhatsApp, Telegram, Viber and other external links load only after you choose to visit them. Their own privacy and storage policies then apply."] },
    ],
  },
  refunds: {
    title: "Cancellation and Refund Policy",
    summary: "How cancellations, completed work, third-party costs and mandatory consumer rights are handled.",
    updated,
    sections: [
      { title: "1. Free requests", paragraphs: ["Contact requests, discovery calls and any audit explicitly described as free have no charge and no refund is needed."] },
      { title: "2. Custom projects", paragraphs: ["Project fees, deposits, milestones, acceptance criteria and cancellation terms are set in the signed proposal or services agreement. Because the work is custom, an approved milestone is not automatically refundable after the work has been performed and delivered."] },
      { title: "3. Cancellation before completion", paragraphs: ["If a client cancels, WTECH will provide an itemised account of completed work and committed non-cancellable third-party costs. Any prepaid amount exceeding those sums will be refunded using the original payment method where practical. A cancellation charge will not exceed the loss and work reasonably attributable to the cancellation where consumer law applies."] },
      { title: "4. Defects and agreed requirements", paragraphs: ["Report a material defect promptly with steps to reproduce it. During the defect-support period stated in the proposal, WTECH will first correct verified failures against the agreed written requirements. This does not cover new scope, client changes, third-party outages or misuse."] },
      { title: "5. Consumer withdrawal rights", paragraphs: ["Although services are intended mainly for businesses, an individual acting as a consumer may have a statutory cooling-off period, commonly 14 days for a distance service contract in Moldova, the EU or the UK. If the consumer expressly asks work to begin during that period and then withdraws, the consumer may owe a proportionate amount for work already supplied. Mandatory rights always prevail over this policy."] },
      { title: "6. Requesting cancellation or a refund", paragraphs: ["Email the address in Business details with your name, project or invoice reference, the requested remedy and the reason. We will acknowledge the request and respond after checking the agreement, delivered work and applicable law."] },
    ],
  },
  sms: {
    title: "SMS and Messaging Consent Policy",
    summary: "What you agree to when asking WTECH to contact you by SMS, WhatsApp or another messaging channel.",
    updated,
    sections: [
      { title: "1. Requested-service messages", paragraphs: ["When you submit a form and ask us to contact you, WTECH may send messages necessary to answer that specific inquiry, deliver the requested audit, confirm a meeting or provide project service notices. This is separate from marketing consent."] },
      { title: "2. Optional marketing consent", paragraphs: ["Marketing consent is optional, unchecked by default and is not a condition of purchase. If you select it, you authorise WTECH to send occasional promotional SMS, WhatsApp or similar messages to the number provided. Message frequency varies. Message and data rates may apply. Consent applies only to WTECH and is not sold."] },
      { title: "3. How to stop", paragraphs: ["Reply STOP, END, CANCEL, UNSUBSCRIBE or a clear equivalent, or email us. We will honour reasonable withdrawal requests. A single confirmation message may be sent where lawful. For help, reply HELP or use the published email."] },
      { title: "4. Records", paragraphs: ["We retain evidence of consent and withdrawal, including date, source, notice version and number, as needed to demonstrate compliance. Do not provide a number unless you are the subscriber or are authorised to consent for it."] },
      { title: "5. Delivery and third parties", paragraphs: ["Mobile carriers and messaging platforms control delivery and may process data under their own terms. WTECH does not guarantee message delivery. Automated or bulk campaigns, if introduced, must be configured to honour suppression lists and applicable sender-identification and unsubscribe rules."] },
      { title: "6. Country-specific protections", paragraphs: ["Commercial messages may be subject to the US TCPA and state laws, Canada’s CASL, Australia’s Spam Act, EU/UK direct-marketing rules and Moldovan law. WTECH applies the stricter opt-in approach for marketing unless legal review confirms another basis."] },
    ],
  },
};

const ro: Record<LegalDocumentKey, LegalDocument> = {
  privacy: { title: "Politica de confidențialitate", summary: "Cum colectează, utilizează, păstrează și protejează WTECH datele când folosești site-ul, Ana, auditul sau formularele.", updated: "23 septembrie 2026", sections: [
    { title: "1. Cine răspunde de date", paragraphs: ["Operatorul este afacerea care activează sub denumirea comercială wtech.md, identificată în secțiunea Datele afacerii de pe această pagină. Întrebările și cererile privind datele pot fi trimise la adresa de confidențialitate publicată."] },
    { title: "2. Ce colectăm", bullets: ["Cereri de contact și programare: nume, telefon sau WhatsApp, e-mail opțional, companie, ora preferată și mesajul despre proiect.", "Audit: adresa site-ului, e-mail, WhatsApp și opțiunea de vizibilitate AI.", "Chatul Ana: mesajele trimise și, numai dacă le oferi, datele de contact pentru revenire.", "Date tehnice și de securitate: IP, ora cererii, țara aproximată de hosting, browser, loguri și semnale anti-abuz.", "Dovezi de consimțământ: versiunea notificării, data, formularul și alegerea privind marketingul prin SMS sau mesagerie."] },
    { title: "3. De ce le folosim", bullets: ["Pentru a răspunde, pregăti auditul sau oferta, programa apelul și face pașii solicitați înaintea unui contract.", "Pentru executarea contractului, suport, contabilitate și apărarea drepturilor legale.", "Pentru securitate, prevenirea spamului, diagnostic și disponibilitate.", "Pentru analytics numai după acceptarea tehnologiilor opționale, când consimțământul este necesar.", "Pentru marketing prin SMS, WhatsApp sau e-mail numai cu acord separat ori alt temei legal confirmat."] },
    { title: "4. Furnizori și transferuri", paragraphs: ["Folosim doar furnizorii necesari. Datele pot fi prelucrate în Moldova, UE, SUA sau alte locații în baza garanțiilor contractuale."], bullets: ["Vercel pentru hosting, livrare, loguri și țară aproximativă.", "Supabase pentru baza de date a solicitărilor.", "Anthropic pentru răspunsurile Anei; nu trimite parole, plăți, date medicale sau documente confidențiale.", "E-mail și Telegram, dacă sunt configurate, pentru notificarea echipei.", "Cal.com sau alt calendar numai după alegerea serviciilor opționale.", "Umami numai când este configurat și acceptat.", "WhatsApp, Telegram, Viber și operatorul telefonic atunci când alegi canalul extern."] },
    { title: "5. Păstrare și securitate", paragraphs: ["Solicitările obișnuite sunt revizuite și șterse sau anonimizate la 12 luni după ultimul contact relevant. Contractele, facturile și disputele pot fi păstrate mai mult dacă legea o cere. Logurile de securitate se păstrează doar cât este necesar. Folosim conexiuni criptate, control al accesului și acces administrativ restricționat, fără a promite securitate absolută."] },
    { title: "6. Drepturile tale", paragraphs: ["În funcție de locație, poți cere acces, corectare, ștergere, restricționare, portabilitate, opoziție sau retragerea consimțământului și poți depune o plângere la autoritate. WTECH nu vinde date personale și nu le distribuie pentru publicitate comportamentală între contexte. Cererile vor fi verificate proporțional."] },
    { title: "7. Minori și date sensibile", paragraphs: ["Serviciul B2B nu este destinat persoanelor sub 18 ani. Nu trimite acte, parole, date de card, date medicale sau alte informații sensibile prin formulare ori Ana."] },
    { title: "8. Modificări", paragraphs: ["Putem actualiza politica dacă se schimbă furnizorii, funcțiile sau legea. Data de sus indică versiunea curentă."] },
  ] },
  terms: { title: "Termeni și condiții", summary: "Regulile de utilizare a site-ului WTECH și de solicitare a serviciilor profesionale.", updated: "23 septembrie 2026", sections: [
    { title: "1. Domeniu", paragraphs: ["Acești termeni se aplică site-ului public, chatului Ana, auditului și formularelor. Un proiect începe numai după aprobarea unei oferte scrise sau semnarea unui contract separat, care prevalează în caz de conflict."] },
    { title: "2. Informații și oferte", paragraphs: ["Prețurile de pe site sunt prețuri de pornire și nu constituie ofertă obligatorie. Scopul, etapele, taxele, costurile externe, termenul și prețul final se confirmă în scris. Dacă nu se indică altfel, oferta este valabilă 30 de zile."] },
    { title: "3. Utilizare acceptabilă", bullets: ["Nu ataca, nu perturba și nu încerca acces neautorizat.", "Nu trimite conținut ilegal, malware, secrete ale altora sau date pe care nu ai dreptul să le furnizezi.", "Nu folosi Ana pentru urgențe ori decizii juridice, medicale sau financiare."] },
    { title: "4. Proprietate intelectuală", paragraphs: ["WTECH deține site-ul, marca, interfața și conținutul original, dacă nu se indică altfel. Drepturile asupra lucrărilor pentru client se acordă numai conform contractului și plăților agreate. Vizualurile marcate drept concepte nu sunt recomandări ale clienților și nu dovedesc o implementare."] },
    { title: "5. AI și servicii externe", paragraphs: ["Ana poate greși și nu înlocuiește oferta scrisă sau consultanța profesională. Serviciile externe au termeni proprii și pot deveni indisponibile."] },
    { title: "6. Răspundere", paragraphs: ["Site-ul public este oferit în limita disponibilității. Nu excludem drepturi sau răspunderi care nu pot fi legal excluse. Pentru clienții business, răspunderea proiectului este stabilită în contract; pierderile indirecte sau speculative sunt excluse în măsura permisă de lege."] },
    { title: "7. Lege aplicabilă", paragraphs: ["Se aplică legea Republicii Moldova, fără eliminarea protecțiilor obligatorii ale consumatorului din țara sa. Serviciile sunt destinate în principal afacerilor; orice relație cu un consumator se confirmă în scris cu informațiile precontractuale obligatorii."] },
    { title: "8. Contact", paragraphs: ["Trimite notificările juridice la datele din secțiunea Datele afacerii."] },
  ] },
  cookies: { title: "Politica cookie și stocare", summary: "Site-ul folosește stocare necesară și încarcă analytics sau calendar extern numai după alegerea ta.", updated: "23 septembrie 2026", sections: [
    { title: "1. Ce acoperă", paragraphs: ["Regulile cookie acoperă și local storage, scripturi, taguri și tehnologii similare care accesează dispozitivul."] },
    { title: "2. Tehnologii necesare", bullets: ["wtech_consent_v1 în local storage reține alegerea de confidențialitate.", "wtech_locale este creat când schimbi limba și durează până la un an.", "wtech_admin_session este un cookie securizat HTTP-only doar pentru /admin.", "Hostingul poate folosi tehnologii strict necesare pentru securitate și livrare."] },
    { title: "3. Analytics opțional", paragraphs: ["Scriptul Umami, când este configurat, rămâne blocat până accepți tehnologiile opționale. Refuzul nu limitează site-ul."] },
    { title: "4. Calendar extern", paragraphs: ["Calendarul extern nu se încarcă până nu activezi serviciile opționale. Poți folosi formularul WTECH în schimb."] },
    { title: "5. Schimbarea alegerii", paragraphs: ["Folosește Setări cookie din footer oricând. Refuzul este la fel de ușor ca acceptarea. Ștergerea preferințelor din browser va afișa din nou alegerea."] },
    { title: "6. Linkuri externe", paragraphs: ["WhatsApp, Telegram, Viber și alte servicii se deschid numai la alegerea ta și aplică propriile politici."] },
  ] },
  refunds: { title: "Politica de anulare și rambursare", summary: "Cum tratăm anularea, munca efectuată, costurile externe și drepturile obligatorii ale consumatorului.", updated: "23 septembrie 2026", sections: [
    { title: "1. Cereri gratuite", paragraphs: ["Contactul, apelurile de descoperire și auditul descris explicit ca gratuit nu implică plată."] },
    { title: "2. Proiecte personalizate", paragraphs: ["Plățile, avansurile, etapele, acceptarea și anularea se stabilesc în oferta sau contractul semnat. O etapă aprobată nu este automat rambursabilă după executare și livrare."] },
    { title: "3. Anulare înainte de finalizare", paragraphs: ["WTECH va prezenta munca realizată și costurile externe angajate și nerambursabile. Orice avans care depășește aceste sume va fi restituit. Pentru consumatori, costul anulării nu va depăși pierderea și munca rezonabil atribuite anulării."] },
    { title: "4. Defecte", paragraphs: ["Raportează prompt defectul cu pași de reproducere. În perioada de suport, WTECH remediază mai întâi neconformitățile verificate față de cerințele scrise. Nu sunt incluse funcții noi, modificări ale clientului, indisponibilitatea terților sau utilizarea greșită."] },
    { title: "5. Dreptul consumatorului", paragraphs: ["Deși lucrăm în principal B2B, un consumator poate avea un termen legal de revocare, frecvent 14 zile pentru servicii la distanță în Moldova, UE sau Regatul Unit. Dacă solicită expres începerea lucrului și apoi revocă, poate datora partea proporțională deja executată. Drepturile obligatorii prevalează."] },
    { title: "6. Cerere", paragraphs: ["Trimite prin e-mail numele, proiectul sau factura, soluția cerută și motivul. Răspundem după verificarea contractului, livrărilor și legii aplicabile."] },
  ] },
  sms: { title: "Politica de consimțământ SMS și mesagerie", summary: "Ce accepți când ceri WTECH să te contacteze prin SMS, WhatsApp sau alt canal.", updated: "23 septembrie 2026", sections: [
    { title: "1. Mesaje solicitate", paragraphs: ["Când trimiți formularul, putem transmite mesajele necesare pentru răspunsul la cererea respectivă, audit, confirmarea întâlnirii sau notificări despre proiect. Acestea sunt separate de marketing."] },
    { title: "2. Marketing opțional", paragraphs: ["Acordul pentru marketing este opțional, nebifat implicit și nu condiționează cumpărarea. Dacă îl bifezi, permiți WTECH să trimită ocazional promoții prin SMS, WhatsApp sau canal similar. Frecvența variază; pot exista tarife ale operatorului. Acordul este doar pentru WTECH și nu se vinde."] },
    { title: "3. Oprire", paragraphs: ["Răspunde STOP, END, CANCEL, UNSUBSCRIBE sau echivalent, ori scrie-ne pe e-mail. Vom respecta orice retragere rezonabilă. Poate fi trimisă o singură confirmare, unde legea permite."] },
    { title: "4. Dovezi", paragraphs: ["Păstrăm dovada acordului și retragerii: data, sursa, versiunea notificării și numărul. Nu furniza un număr dacă nu ești abonatul sau nu ai autorizare."] },
    { title: "5. Livrare și terți", paragraphs: ["Operatorii și platformele controlează livrarea și au termeni proprii. Nu garantăm livrarea. Campaniile automate trebuie să respecte listele de excludere și regulile de identificare și dezabonare."] },
    { title: "6. Reguli internaționale", paragraphs: ["Pot fi aplicabile TCPA în SUA, CASL în Canada, Spam Act în Australia, regulile UE/UK și legea Moldovei. Pentru marketing aplicăm abordarea mai strictă de opt-in dacă o revizie juridică nu confirmă alt temei."] },
  ] },
};

const ru: Record<LegalDocumentKey, LegalDocument> = {
  privacy: { title: "Политика конфиденциальности", summary: "Как WTECH собирает, использует, хранит и защищает данные при использовании сайта, Ana, аудита и форм.", updated: "23 сентября 2026", sections: [
    { title: "1. Ответственный за данные", paragraphs: ["Оператором является бизнес под торговым наименованием wtech.md, указанный в разделе Данные компании. Запросы о данных принимаются по опубликованному адресу конфиденциальности."] },
    { title: "2. Какие данные мы собираем", bullets: ["Контакт и запись: имя, телефон или WhatsApp, необязательный e-mail, компания, удобное время и сообщение.", "Аудит: адрес сайта, e-mail, WhatsApp и выбор проверки AI-видимости.", "Чат Ana: отправленные сообщения и контактные данные, только если вы их предоставили.", "Технические данные: IP, время, приблизительная страна, браузер, журналы и антиспам-сигналы.", "Записи согласия: версия уведомления, дата, форма и выбор маркетинговых SMS или сообщений."] },
    { title: "3. Цели", bullets: ["Ответ на запрос, аудит, предложение, запись и действия до договора по вашей просьбе.", "Исполнение договора, поддержка, бухгалтерия и юридические требования.", "Безопасность, предотвращение спама и диагностика.", "Аналитика только после согласия на необязательные технологии, когда оно требуется.", "Маркетинг по SMS, WhatsApp или e-mail только по отдельному согласию либо иному подтверждённому основанию."] },
    { title: "4. Поставщики и передача", paragraphs: ["Мы привлекаем только необходимых поставщиков. Данные могут обрабатываться в Молдове, ЕС, США и других странах с договорными гарантиями."], bullets: ["Vercel — хостинг, журналы и приблизительная страна.", "Supabase — база заявок.", "Anthropic — ответы Ana; не отправляйте пароли, платежные, медицинские данные или конфиденциальные документы.", "E-mail и Telegram, если настроены, для уведомления команды.", "Cal.com — только после выбора необязательных сервисов.", "Umami — только после настройки и согласия.", "WhatsApp, Telegram, Viber и оператор связи при выборе внешнего канала."] },
    { title: "5. Хранение и безопасность", paragraphs: ["Обычные обращения проверяются и удаляются или обезличиваются через 12 месяцев после последнего значимого контакта. Договоры и счета могут храниться дольше по закону. Журналы безопасности хранятся лишь необходимый срок. Используются шифрование соединений и ограничение доступа, однако абсолютная безопасность не гарантируется."] },
    { title: "6. Ваши права", paragraphs: ["В зависимости от страны вы можете запросить доступ, исправление, удаление, ограничение, перенос, возражение или отзыв согласия и подать жалобу регулятору. WTECH не продаёт персональные данные и не передаёт их для межконтекстной поведенческой рекламы."] },
    { title: "7. Дети и чувствительные данные", paragraphs: ["B2B-сервис не предназначен для лиц младше 18 лет. Не отправляйте документы, пароли, данные карт, медицинские и иные чувствительные сведения."] },
    { title: "8. Изменения", paragraphs: ["Политика может обновляться при изменении поставщиков, функций или закона. Дата сверху обозначает актуальную версию."] },
  ] },
  terms: { title: "Условия использования", summary: "Правила использования сайта WTECH и запроса профессиональных услуг.", updated: "23 сентября 2026", sections: [
    { title: "1. Область", paragraphs: ["Условия распространяются на сайт, Ana, аудит и формы. Проект начинается только после письменного предложения или отдельного договора, который имеет приоритет."] },
    { title: "2. Информация и предложения", paragraphs: ["Цены на сайте стартовые и не являются обязательной офертой. Объём, этапы, налоги, внешние расходы, сроки и итоговая цена фиксируются письменно. Если не указано иначе, предложение действительно 30 дней."] },
    { title: "3. Допустимое использование", bullets: ["Не атакуйте, не нарушайте работу и не пытайтесь получить несанкционированный доступ.", "Не отправляйте незаконный контент, вредоносный код, чужие секреты или данные без полномочий.", "Не используйте Ana для экстренных, юридических, медицинских или финансовых решений."] },
    { title: "4. Интеллектуальная собственность", paragraphs: ["WTECH владеет сайтом, брендом, интерфейсом и оригинальным контентом, если не указано иное. Права на клиентскую работу передаются только по договору и после согласованных платежей. Макеты, отмеченные как концепты, не являются отзывами клиентов или доказательством запуска."] },
    { title: "5. AI и сторонние сервисы", paragraphs: ["Ana может ошибаться и не заменяет письменное предложение или профессиональную консультацию. Сторонние сервисы имеют собственные условия и доступность."] },
    { title: "6. Ответственность", paragraphs: ["Публичный сайт предоставляется по мере доступности. Обязательные права и ответственность не исключаются. Для бизнеса ответственность по проекту регулируется договором; косвенные и предположительные убытки исключаются в разрешённой законом степени."] },
    { title: "7. Применимое право", paragraphs: ["Применяется право Республики Молдова без отмены обязательной защиты потребителя в его стране. Услуги в основном B2B; отношения с потребителем подтверждаются письменно с обязательной преддоговорной информацией."] },
    { title: "8. Контакт", paragraphs: ["Юридические уведомления направляйте по данным в разделе Данные компании."] },
  ] },
  cookies: { title: "Политика cookie и хранилища", summary: "Сайт использует необходимое хранилище, а аналитику и внешний календарь загружает только после выбора.", updated: "23 сентября 2026", sections: [
    { title: "1. Что охватывается", paragraphs: ["Правила относятся также к local storage, скриптам, тегам и сходным технологиям доступа к устройству."] },
    { title: "2. Необходимые технологии", bullets: ["wtech_consent_v1 хранит ваш выбор конфиденциальности.", "wtech_locale создаётся при смене языка и хранится до года.", "wtech_admin_session — защищённый HTTP-only cookie только для /admin.", "Хостинг может использовать строго необходимые технологии защиты и доставки."] },
    { title: "3. Необязательная аналитика", paragraphs: ["Umami, если настроен, заблокирован до согласия. Отказ не ограничивает сайт."] },
    { title: "4. Внешний календарь", paragraphs: ["Внешний календарь не загружается до включения необязательных сервисов. Вместо него доступна форма WTECH."] },
    { title: "5. Изменение выбора", paragraphs: ["Используйте Настройки cookie внизу сайта. Отказ так же прост, как согласие. После удаления настроек браузера выбор появится снова."] },
    { title: "6. Внешние ссылки", paragraphs: ["WhatsApp, Telegram, Viber и другие сервисы открываются только по вашему выбору и применяют свои политики."] },
  ] },
  refunds: { title: "Политика отмены и возврата", summary: "Как рассматриваются отмена, выполненная работа, сторонние расходы и обязательные права потребителя.", updated: "23 сентября 2026", sections: [
    { title: "1. Бесплатные запросы", paragraphs: ["Контакт, ознакомительный звонок и явно бесплатный аудит не требуют оплаты."] },
    { title: "2. Заказные проекты", paragraphs: ["Платежи, аванс, этапы, приёмка и отмена определяются подписанным предложением или договором. Принятый этап не подлежит автоматическому возврату после выполнения."] },
    { title: "3. Отмена до завершения", paragraphs: ["WTECH предоставит расчёт выполненной работы и невозвратных сторонних расходов. Предоплата сверх этих сумм возвращается. Для потребителя удержание не превысит разумные потери и выполненную работу."] },
    { title: "4. Дефекты", paragraphs: ["Сообщите о дефекте с шагами воспроизведения. В период поддержки WTECH сначала исправляет подтверждённое несоответствие письменным требованиям. Новый объём, изменения клиента, сбои третьих лиц и неправильное использование не входят."] },
    { title: "5. Права потребителя", paragraphs: ["Хотя услуги преимущественно B2B, у потребителя может быть законный срок отказа, часто 14 дней для дистанционных услуг в Молдове, ЕС или Великобритании. При просьбе начать работу немедленно и последующем отказе оплачивается пропорционально выполненная часть. Обязательные права имеют приоритет."] },
    { title: "6. Запрос", paragraphs: ["Отправьте по e-mail имя, проект или счёт, требуемое решение и причину. Ответ даётся после проверки договора, результата и применимого права."] },
  ] },
  sms: { title: "Согласие на SMS и сообщения", summary: "Что вы разрешаете, прося WTECH связаться по SMS, WhatsApp или другому каналу.", updated: "23 сентября 2026", sections: [
    { title: "1. Запрошенные сообщения", paragraphs: ["После отправки формы мы можем направить сообщения, необходимые для ответа, аудита, подтверждения встречи или проекта. Это отдельно от маркетинга."] },
    { title: "2. Необязательный маркетинг", paragraphs: ["Согласие необязательно, по умолчанию не отмечено и не является условием покупки. При отметке вы разрешаете WTECH иногда отправлять акции по SMS, WhatsApp или сходному каналу. Частота меняется; возможна плата оператора. Согласие только для WTECH и не продаётся."] },
    { title: "3. Как отказаться", paragraphs: ["Ответьте STOP, END, CANCEL, UNSUBSCRIBE или ясным эквивалентом либо напишите по e-mail. Разумный запрос будет выполнен. Где разрешено, может прийти одно подтверждение отказа."] },
    { title: "4. Записи", paragraphs: ["Мы сохраняем подтверждение согласия и отзыва: дату, источник, версию уведомления и номер. Не указывайте номер без полномочий абонента."] },
    { title: "5. Доставка и третьи лица", paragraphs: ["Операторы и платформы контролируют доставку и применяют свои условия. Доставка не гарантируется. Автоматические кампании должны соблюдать списки исключения и правила идентификации и отказа."] },
    { title: "6. Международные правила", paragraphs: ["Могут применяться TCPA США, CASL Канады, Spam Act Австралии, правила ЕС/UK и Молдовы. Для маркетинга применяется более строгий opt-in, пока юридическая проверка не подтвердит другое основание."] },
  ] },
};

export const legalDocuments: Record<Locale, Record<LegalDocumentKey, LegalDocument>> = { en, ro, ru };
