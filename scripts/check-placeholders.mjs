#!/usr/bin/env node
// Fails the build if any `[[placeholder]]` is left in source, messages, or env defaults.
// The typed CMS tokens [[proof.n1|n2|n3]] are allowed: lib/settings.ts resolves them at request time from the
// /admin values. Set ALLOW_PLACEHOLDERS=1 for local/dev builds while other placeholders remain.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const roots = ["app", "components", "lib", "messages", "i18n", "public/llms.txt"];
const exts = new Set([".ts", ".tsx", ".json", ".md", ".txt", ".mdx"]);
const skipDirs = new Set(["node_modules", ".next", "design", "scripts"]);
const hits = [];

function walk(p) {
  let st;
  try { st = statSync(p); } catch { return; }
  if (st.isDirectory()) {
    for (const f of readdirSync(p)) if (!skipDirs.has(f)) walk(join(p, f));
    return;
  }
  if (!exts.has(extname(p))) return;
  const text = readFileSync(p, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    const m = (line.match(/\[\[[a-zA-Z0-9_.\- ]+\]\]/g) || []).filter((t) => !/^\[\[proof\.n[123]\]\]$/.test(t));
    if (m.length) hits.push({ file: p, line: i + 1, tokens: m });
  });
}
roots.forEach(walk);

// env-driven contact values
const envFile = (() => { try { return readFileSync(".env", "utf8"); } catch { return ""; } })();
if (/\[\[[a-z_]+\]\]/i.test(envFile)) hits.push({ file: ".env", line: 0, tokens: envFile.match(/\[\[[a-z_]+\]\]/gi) });
// contact details are optional here: they are edited in /admin and hidden on the site while empty

if (hits.length) {
  const allow = process.env.ALLOW_PLACEHOLDERS === "1";
  console[allow ? "warn" : "error"](`\n${allow ? "WARNING" : "ERROR"}: ${hits.length} placeholder location(s) still unresolved:`);
  for (const h of hits) console[allow ? "warn" : "error"](`  ${h.file}:${h.line}  ${h.tokens.join(", ")}`);
  if (!allow) {
    console.error("\nReplace them with real values (or run with ALLOW_PLACEHOLDERS=1 for a dev build).\n");
    process.exit(1);
  }
  console.warn("\nALLOW_PLACEHOLDERS=1 set: continuing.\n");
} else {
  console.log("check-placeholders: OK, no [[placeholders]] found.");
}
