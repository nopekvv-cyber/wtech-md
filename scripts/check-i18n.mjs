#!/usr/bin/env node
// Fails the build when any message key is missing in any locale, or when a value is empty.
import { readFileSync } from "node:fs";

const locales = ["ro", "ru", "en"];
const data = Object.fromEntries(locales.map((l) => [l, JSON.parse(readFileSync(`messages/${l}.json`, "utf8"))]));

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const flat = Object.fromEntries(locales.map((l) => [l, flatten(data[l])]));
const all = new Set(locales.flatMap((l) => Object.keys(flat[l])));
let errors = 0;
for (const key of all) {
  for (const l of locales) {
    if (!(key in flat[l])) { console.error(`missing  ${l}: ${key}`); errors++; }
    else if (flat[l][key] === "" || flat[l][key] == null) { console.error(`empty    ${l}: ${key}`); errors++; }
  }
}
// identical RO and RU values for long strings usually mean an untranslated copy
const SAME_OK = new Set(["crm.ana.t3s"]); // proper-noun lists that are legitimately identical
for (const key of Object.keys(flat.ro)) {
  const ro = flat.ro[key], ru = flat.ru[key];
  if (SAME_OK.has(key)) continue;
  if (typeof ro === "string" && ro.length > 24 && ro === ru && !/^https?:|^\+|MDL|@/.test(ro)) {
    console.error(`untranslated RU (same as RO): ${key}`); errors++;
  }
}
if (errors) { console.error(`\ncheck-i18n: ${errors} problem(s).`); process.exit(1); }
console.log(`check-i18n: OK, ${all.size} keys present in ${locales.join("/")}.`);
