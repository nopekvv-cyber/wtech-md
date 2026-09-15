// Seed articles (AI-drafted, marked "[[review]]"-style in the UI via blog.review label until approved).
// Kept as structured blocks so every locale is written natively, not translated.
import type { Locale } from "@/i18n/routing";
import type { BlogSlug } from "@/lib/blog";

export type Block = { h?: string; p?: string; ul?: string[] };

const posts: Record<BlogSlug, Record<Locale, Block[]>> = {
  "cat-costa-un-site-in-moldova-2026": {
    ro: [
      { p: "Dacă ai cerut trei oferte pentru un site în Chișinău, ai primit probabil trei prețuri care nu seamănă deloc între ele: 150 EUR, 1 200 EUR și 6 000 EUR. Toate trei sunt reale. Diferența nu este în număr, ci în ce cumperi." },
      { h: "Ce există pe piață în 2026" },
      { ul: ["Site pe template, 50 până la 300 EUR: un șablon WordPress, textele tale copiate în el, fără design, fără viteză, fără suport. Bun pentru o carte de vizită online, nu pentru vânzări.", "Site de agenție mică, 350 până la 1 500 EUR: design adaptat, câteva pagini, formular de contact. De obicei într-o singură limbă și fără legătură cu vreun CRM.", "Site premium, 1 500 până la 5 000 EUR: design unic, animații, RO/RU/EN, viteză sub o secundă, formulare conectate la CRM și WhatsApp, SEO tehnic inclus.", "Platformă la comandă, de la 5 000 EUR: magazin online complex, portal de clienți, integrări cu 1C sau bănci."] },
      { h: "Ce diferențiază un site care aduce clienți" },
      { p: "Un site aduce clienți când face trei lucruri: se încarcă în sub o secundă pe telefon, spune în prima secundă ce vinzi și cui, și transformă interesul într-un mesaj pe WhatsApp sau un apel. Restul este decor." },
      { p: "Întreabă orice agenție cum ajunge lead-ul de pe site în telefonul tău. Dacă răspunsul este „pe e-mail”, vei pierde jumătate din ele." },
      { h: "Cum citești o ofertă" },
      { ul: ["Prețul este fix sau estimativ? Cere-l fix, în scris.", "Cine deține codul și domeniul după plată? Trebuie să fii tu.", "Ce se întâmplă în prima lună după lansare? Suportul ar trebui inclus.", "Există o versiune în rusă scrisă de un om, nu de un traducător automat?"] },
      { p: "La wtech.md un site de prezentare pornește de la un preț fix în MDL, include RO/RU/EN, animații și formulare conectate la CRM, iar propunerea cu preț fix o primești în 48 de ore după un apel de 30 de minute." },
    ],
    ru: [
      { p: "Если вы запросили три предложения на сайт в Кишинёве, вы наверняка получили три цены, которые не похожи друг на друга: 150 евро, 1 200 евро и 6 000 евро. Все три реальные. Разница не в цифре, а в том, что вы покупаете." },
      { h: "Что есть на рынке в 2026 году" },
      { ul: ["Сайт на шаблоне, от 50 до 300 евро: шаблон WordPress, ваши тексты, без дизайна, без скорости, без поддержки. Годится как визитка, не как инструмент продаж.", "Сайт от небольшой студии, 350 до 1 500 евро: адаптированный дизайн, несколько страниц, форма обратной связи. Обычно на одном языке и без связи с CRM.", "Премиальный сайт, 1 500 до 5 000 евро: уникальный дизайн, анимации, RO/RU/EN, загрузка меньше секунды, формы, связанные с CRM и WhatsApp, техническое SEO.", "Платформа под заказ, от 5 000 евро: сложный интернет-магазин, личный кабинет, интеграции с 1С или банками."] },
      { h: "Чем отличается сайт, который приводит клиентов" },
      { p: "Сайт приводит клиентов, когда делает три вещи: открывается меньше чем за секунду на телефоне, за первую секунду объясняет, что вы продаёте и кому, и превращает интерес в сообщение в WhatsApp или звонок. Всё остальное декор." },
      { p: "Спросите любую студию, как заявка с сайта попадает в ваш телефон. Если ответ «на почту», половину заявок вы потеряете." },
      { h: "Как читать предложение" },
      { ul: ["Цена фиксированная или ориентировочная? Требуйте фиксированную, письменно.", "Кому принадлежат код и домен после оплаты? Должны принадлежать вам.", "Что происходит в первый месяц после запуска? Поддержка должна быть включена.", "Есть ли русская версия, написанная человеком, а не автопереводчиком?"] },
      { p: "В wtech.md сайт-визитка начинается с фиксированной цены в леях, включает RO/RU/EN, анимации и формы, связанные с CRM, а предложение с фиксированной ценой вы получаете через 48 часов после 30-минутного звонка." },
    ],
    en: [
      { p: "Ask three studios in Chișinău for a website quote and you will get three numbers that have nothing in common: 150 EUR, 1,200 EUR and 6,000 EUR. All three are real. The difference is not the number, it is what you are buying." },
      { h: "What the market offers in 2026" },
      { ul: ["Template site, 50 to 300 EUR: a WordPress theme with your text pasted in, no design, no speed, no support. Fine as an online business card, useless for sales.", "Small-agency site, 350 to 1,500 EUR: adapted design, a few pages, a contact form. Usually one language and no CRM connection.", "Premium site, 1,500 to 5,000 EUR: unique design, motion, RO/RU/EN, sub-second load on mobile, forms wired into a CRM and WhatsApp, technical SEO included.", "Custom platform, from 5,000 EUR: complex e-commerce, client portals, integrations with 1C or banks."] },
      { h: "What separates a site that brings clients" },
      { p: "A website brings clients when it does three things: loads in under a second on a phone, says in the first second what you sell and to whom, and turns interest into a WhatsApp message or a call. Everything else is decoration." },
      { p: "Ask any agency how a lead from the site reaches your phone. If the answer is \"by email\", you will lose half of them." },
      { h: "How to read a quote" },
      { ul: ["Is the price fixed or an estimate? Ask for fixed, in writing.", "Who owns the code and the domain after payment? It has to be you.", "What happens in the first month after launch? Support should be included.", "Is there a Russian version written by a person, not a machine translator?"] },
      { p: "At wtech.md a presentation site starts from a fixed price in MDL, includes RO/RU/EN, motion and CRM-connected forms, and you get the fixed-price proposal 48 hours after a 30-minute call." },
    ],
  },
  "crm-pentru-afaceri-moldova": {
    ro: [
      { p: "Majoritatea firmelor din Moldova țin lead-urile în trei locuri: Excel, telefonul managerului și un chat de Viber. Când un client nu primește răspuns, nimeni nu știe cine trebuia să-i răspundă. Un CRM rezolvă exact asta. Întrebarea este ce fel de CRM." },
      { h: "Abonament: Bitrix24, AmoCRM, Zoho" },
      { ul: ["Pornire rapidă, interfață cunoscută, integrări gata pentru Facebook și Telegram.", "Plată lunară per utilizator: pentru 8 oameni, 3 ani, ajungi ușor la 5 000 până la 9 000 EUR.", "Procesul tău se adaptează la CRM, nu invers. Câmpurile în rusă și română sunt de multe ori un compromis.", "Datele stau pe serverele lor; exportul complet este rareori simplu."] },
      { h: "CRM construit pentru afacerea ta" },
      { ul: ["Etapele, câmpurile și rapoartele tale, în limbile echipei tale.", "Preț fix, o singură dată. Fără plată per utilizator.", "Integrare directă cu 1C Contabilitate, maib, PayNet, WhatsApp Business, Facebook Lead Ads.", "Un angajat AI care face follow-up și scrie în CRM, inclus în același sistem.", "Codul și datele sunt ale tale, pe serverul tău sau găzduite de noi."] },
      { h: "Când merită fiecare variantă" },
      { p: "Sub 3 utilizatori și un proces standard de vânzări: ia un abonament și pornește săptămâna asta. Peste 5 utilizatori, integrare cu 1C, oferte și facturi generate din CRM, sau două limbi în echipă: un CRM propriu se amortizează în 12 până la 18 luni și după aceea nu mai plătești nimic." },
      { p: "Costul pe trei ani este testul corect. Pune pe hârtie abonamentul lunar înmulțit cu 36 și cu numărul de oameni, apoi compară cu un preț fix." },
    ],
    ru: [
      { p: "Большинство компаний в Молдове хранят заявки в трёх местах: в Excel, в телефоне руководителя и в чате Viber. Когда клиент не получает ответа, никто не знает, кто должен был ответить. CRM решает именно это. Вопрос в том, какая CRM." },
      { h: "Подписка: Битрикс24, amoCRM, Zoho" },
      { ul: ["Быстрый старт, знакомый интерфейс, готовые интеграции с Facebook и Telegram.", "Ежемесячная оплата за пользователя: для 8 человек за 3 года легко выходит 5 000 до 9 000 евро.", "Ваш процесс подстраивается под CRM, а не наоборот. Поля на русском и румынском часто компромисс.", "Данные лежат на их серверах; полный экспорт редко бывает простым."] },
      { h: "CRM, построенная под ваш бизнес" },
      { ul: ["Ваши этапы, поля и отчёты, на языках вашей команды.", "Фиксированная цена, один раз. Без оплаты за пользователя.", "Прямая интеграция с 1С Бухгалтерией, maib, PayNet, WhatsApp Business, Facebook Lead Ads.", "ИИ-сотрудник, который делает follow-up и пишет в CRM, в той же системе.", "Код и данные принадлежат вам, на вашем сервере или на нашем хостинге."] },
      { h: "Когда какой вариант оправдан" },
      { p: "Меньше 3 пользователей и стандартный процесс продаж: берите подписку и запускайтесь на этой неделе. Больше 5 пользователей, интеграция с 1С, коммерческие предложения и счета из CRM или два языка в команде: собственная CRM окупается за 12 до 18 месяцев, а дальше вы ничего не платите." },
      { p: "Стоимость за три года это честный тест. Запишите ежемесячную подписку, умножьте на 36 и на число людей, затем сравните с фиксированной ценой." },
    ],
    en: [
      { p: "Most Moldovan companies keep leads in three places: a spreadsheet, the manager's phone and a Viber chat. When a client gets no reply, nobody knows who was supposed to answer. A CRM fixes exactly that. The question is which kind." },
      { h: "Subscription: Bitrix24, amoCRM, Zoho" },
      { ul: ["Fast start, familiar interface, ready-made Facebook and Telegram integrations.", "Monthly fee per user: for 8 people over 3 years you easily reach 5,000 to 9,000 EUR.", "Your process adapts to the CRM, not the other way round. Russian and Romanian fields are often a compromise.", "Data lives on their servers; a full export is rarely simple."] },
      { h: "A CRM built for your business" },
      { ul: ["Your stages, fields and reports, in your team's languages.", "Fixed price, paid once. No per-user fee.", "Direct integration with 1C accounting, maib, PayNet, WhatsApp Business, Facebook Lead Ads.", "An AI employee that follows up and writes into the CRM, part of the same system.", "Code and data are yours, on your server or hosted by us."] },
      { h: "When each option makes sense" },
      { p: "Under 3 users and a standard sales process: take a subscription and start this week. Over 5 users, a 1C integration, quotes and invoices generated from the CRM, or two languages in the team: a custom CRM pays for itself in 12 to 18 months and costs nothing after that." },
      { p: "Three-year cost is the honest test. Write down the monthly fee times 36 times the number of people, then compare it with a fixed price." },
    ],
  },
  "ai-seo-moldova-chatgpt-gemini": {
    ro: [
      { p: "Tot mai mulți clienți din Moldova întreabă ChatGPT sau Gemini „cine face site-uri în Chișinău” înainte să deschidă Google. Dacă răspunsul nu te menționează, nu exiști pentru ei. AI SEO, sau GEO (generative engine optimisation), este disciplina care schimbă asta." },
      { h: "Ce citează modelele AI" },
      { ul: ["Pagini care răspund direct la o întrebare, într-o propoziție clară, nu în trei paragrafe de marketing.", "Entități bine definite: o pagină „Despre” care spune cine ești, unde ești, ce faci și în ce limbi.", "Date structurate: Organization, LocalBusiness, Service, FAQPage în JSON-LD.", "Mențiuni pe alte site-uri de încredere: directoare, presă locală, parteneri.", "Conținut actualizat regulat, cu date și autor."] },
      { h: "Șapte pași concreți" },
      { ul: ["Scrie un fișier llms.txt la rădăcina site-ului cu ce faci și pentru cine.", "Adaugă FAQ cu răspunsuri de o propoziție, marcate cu schema FAQPage.", "Construiește pagina de entitate: nume, adresă, IDNO, limbi, servicii, linkuri sameAs.", "Pune întrebarea reală a clientului în H2 și răspunde imediat sub ea.", "Publică lunar un articol pe un subiect pe care îl caută clienții tăi, în RO și RU.", "Obține citări: profil pe directoare locale, articole în presa de business, parteneri care te menționează.", "Măsoară: întreabă lunar ChatGPT, Gemini și Perplexity aceleași 10 întrebări și notează dacă apari."] },
      { p: "wtech.md aplică toate cele șapte pe propriul site și le livrează clienților ca serviciu lunar, cu un dashboard de poziții și vizibilitate AI în CRM." },
    ],
    ru: [
      { p: "Всё больше клиентов в Молдове спрашивают ChatGPT или Gemini «кто делает сайты в Кишинёве», прежде чем открыть Google. Если в ответе вас нет, для них вы не существуете. AI SEO, или GEO (generative engine optimisation), это дисциплина, которая это меняет." },
      { h: "Что цитируют ИИ-модели" },
      { ul: ["Страницы, которые отвечают на вопрос прямо, одним ясным предложением, а не тремя абзацами маркетинга.", "Чётко описанные сущности: страница «О нас», где сказано, кто вы, где вы, что делаете и на каких языках.", "Структурированные данные: Organization, LocalBusiness, Service, FAQPage в JSON-LD.", "Упоминания на других надёжных сайтах: каталоги, местная пресса, партнёры.", "Регулярно обновляемый контент с датой и автором."] },
      { h: "Семь конкретных шагов" },
      { ul: ["Создайте файл llms.txt в корне сайта с описанием, что вы делаете и для кого.", "Добавьте FAQ с ответами в одно предложение и разметкой FAQPage.", "Постройте страницу сущности: название, адрес, IDNO, языки, услуги, ссылки sameAs.", "Вынесите реальный вопрос клиента в H2 и ответьте сразу под ним.", "Публикуйте раз в месяц статью на тему, которую ищут ваши клиенты, на RO и RU.", "Получайте цитирования: профили в местных каталогах, статьи в деловой прессе, партнёры, которые вас упоминают.", "Измеряйте: раз в месяц задавайте ChatGPT, Gemini и Perplexity одни и те же 10 вопросов и отмечайте, появляетесь ли вы."] },
      { p: "wtech.md применяет все семь шагов на собственном сайте и предоставляет их клиентам как ежемесячную услугу с дашбордом позиций и ИИ-видимости в CRM." },
    ],
    en: [
      { p: "More and more buyers in Moldova ask ChatGPT or Gemini \"who builds websites in Chișinău\" before they open Google. If the answer does not mention you, you do not exist for them. AI SEO, or GEO (generative engine optimisation), is the discipline that changes that." },
      { h: "What AI models cite" },
      { ul: ["Pages that answer a question directly, in one clear sentence, not three paragraphs of marketing.", "Well-defined entities: an About page that says who you are, where you are, what you do and in which languages.", "Structured data: Organization, LocalBusiness, Service and FAQPage in JSON-LD.", "Mentions on other trusted sites: directories, local press, partners.", "Content updated regularly, with a date and an author."] },
      { h: "Seven concrete steps" },
      { ul: ["Publish an llms.txt file at the site root describing what you do and for whom.", "Add an FAQ with one-sentence answers, marked up with FAQPage schema.", "Build the entity page: name, address, registration number, languages, services, sameAs links.", "Put the client's real question in an H2 and answer it right underneath.", "Publish one article a month on a topic your clients search for, in RO and RU.", "Earn citations: local directory profiles, business-press articles, partners who mention you.", "Measure: ask ChatGPT, Gemini and Perplexity the same 10 questions every month and note whether you appear."] },
      { p: "wtech.md applies all seven on its own site and delivers them to clients as a monthly service, with a rankings and AI-visibility dashboard inside the CRM." },
    ],
  },
};

export function getPost(locale: Locale, slug: BlogSlug): Block[] {
  return posts[slug][locale];
}
