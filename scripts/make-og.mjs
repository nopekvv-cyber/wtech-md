// OG images: Higgsfield backdrop + the real lockup PNG + localised subline, per locale -> public/og-{ro,ru,en}.png
// Email header: backdrop + lockup -> public/media/email-header.png
import sharp from "sharp";
import { readFileSync } from "node:fs";

const W = 1200, H = 630;
const sub = {
  ro: "Site-uri, CRM, angajați AI și automatizări. Construit în Chișinău.",
  ru: "Сайты, CRM, ИИ-сотрудники и автоматизация. Сделано в Кишинёве.",
  en: "Websites, CRM, AI employees and automations. Built in Chișinău.",
};
const backdrop = await sharp("design/raw/seo-bg-1.png").resize(W, H, { fit: "cover" }).toBuffer();
const lockup = await sharp("public/brand/wtech-lockup-black.png").resize({ width: 560 }).toBuffer();
const lockupMeta = await sharp(lockup).metadata();
const fontData = readFileSync("public/fonts/outfit-latin.woff2").toString("base64");
const fontCyr = readFileSync("public/fonts/onest-cyrillic.woff2").toString("base64");

for (const [locale, text] of Object.entries(sub)) {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <style>
      @font-face{font-family:'Outfit';src:url(data:font/woff2;base64,${fontData}) format('woff2');font-weight:300 700}
      @font-face{font-family:'Onest';src:url(data:font/woff2;base64,${fontCyr}) format('woff2');font-weight:300 700}
      text{font-family:'Outfit','Onest',sans-serif;font-weight:400;font-size:30px;fill:rgba(245,241,234,0.72);letter-spacing:-0.01em}
    </style>
    <text x="600" y="470" text-anchor="middle">${text.replace(/&/g, "&amp;")}</text>
  </svg>`;
  await sharp(backdrop)
    .composite([
      { input: lockup, left: Math.round((W - (lockupMeta.width ?? 560)) / 2), top: Math.round(200 - (lockupMeta.height ?? 280) / 2), blend: "screen" },
      { input: Buffer.from(svg), left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(`public/og-${locale}.png`);
}
// Email header 600x200
const eh = await sharp("design/raw/seo-bg-2.png").resize(600, 200, { fit: "cover" }).toBuffer();
const lk = await sharp("public/brand/wtech-lockup-black.png").resize({ width: 260 }).toBuffer();
const lkm = await sharp(lk).metadata();
await sharp(eh).composite([{ input: lk, left: Math.round((600 - (lkm.width ?? 260)) / 2), top: Math.round((200 - (lkm.height ?? 130)) / 2), blend: "screen" }]).png().toFile("public/media/email-header.png");
console.log("og + email header ok");
