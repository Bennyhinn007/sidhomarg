// Checks that every language file has exactly the same keys as English,
// that no value is empty, and that {placeholders} and <tags> match.
// Usage: npm run check:i18n
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "..", "messages");
const base = "en";
const load = (l) => JSON.parse(readFileSync(join(dir, `${l}.json`), "utf8"));

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flatten(v, key, out);
    else out[key] = String(v);
  }
  return out;
}

const tokens = (s) => [...s.matchAll(/\{(\w+)\}|<(\w+)>/g)].map((m) => m[0]).sort().join(",");

const en = flatten(load(base));
const locales = readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));
let problems = 0;

for (const locale of locales) {
  const msgs = flatten(load(locale));
  const report = (msg) => { problems++; console.error(`[${locale}] ${msg}`); };

  for (const key of Object.keys(en)) {
    if (!(key in msgs)) report(`missing key: ${key}`);
    else if (!msgs[key].trim()) report(`empty value: ${key}`);
    else if (tokens(en[key]) !== tokens(msgs[key])) report(`placeholder/tag mismatch: ${key}`);
  }
  for (const key of Object.keys(msgs)) if (!(key in en)) report(`extra key: ${key}`);

  // Kannada pages should actually be in Kannada script (brand names and "English" are allowed exceptions).
  if (locale === "kn") {
    const allowLatin = new Set(["Nav.english"]);
    for (const [key, value] of Object.entries(msgs)) {
      if (allowLatin.has(key)) continue;
      if (/[A-Za-z]{4,}/.test(value.replace(/<\/?\w+>|\{\w+\}|AAA/g, "")) && !/[\u0C80-\u0CFF]/.test(value)) {
        report(`looks untranslated: ${key} = "${value}"`);
      }
    }
  }
  console.log(`${locale}: ${Object.keys(msgs).length} keys checked`);
}

if (problems) {
  console.error(`\n${problems} problem(s) found.`);
  process.exit(1);
}
console.log("All translation files are complete.");
