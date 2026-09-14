import fs from 'node:fs';
import vm from 'node:vm';

const required = ['id', 'track', 'title', 'matn', 'summary', 'simple', 'detailed', 'vocab', 'caution', 'exercise', 'references'];
const load = path => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path, 'utf8'), sandbox, { filename: String(path) });
  return sandbox.window.AQIDAH_CONTENT;
};
const ar = load(new URL('../assets/content-ar.js', import.meta.url));
const fr = load(new URL('../assets/content-fr.js', import.meta.url));
for (const [locale, items] of [['ar', ar], ['fr', fr]]) {
  if (!Array.isArray(items) || items.length < 12) throw new Error(`${locale}: fewer than 12 learning units`);
  const ids = new Set();
  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`${locale}: duplicate id ${item.id}`);
    ids.add(item.id);
    for (const field of required) if (!item[field] || (Array.isArray(item[field]) && item[field].length === 0)) throw new Error(`${locale}: ${item.id} lacks ${field}`);
  }
}
if (ar.map(item => item.id).join('|') !== fr.map(item => item.id).join('|')) throw new Error('Arabic and French curricular units are out of alignment');
for (const path of ['index.html', 'ar/index.html', 'fr/index.html']) {
  const html = fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  if (!html.includes('viewport') || !html.includes('site.css')) throw new Error(`${path}: missing responsive or stylesheet metadata`);
}
console.log(`Validated ${ar.length} aligned Arabic/French units.`);
