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
const vocalizedSandbox = { window: { AQIDAH_CONTENT: ar } };
vm.runInNewContext(fs.readFileSync(new URL('../assets/vocalized-ar.js', import.meta.url), 'utf8'), vocalizedSandbox);
const vocalizedAr = vocalizedSandbox.window.AQIDAH_CONTENT;
const stripHarakat = value => String(value).normalize('NFC').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').normalize('NFC');
for (const [index, original] of ar.entries()) {
  const updated = vocalizedAr[index];
  for (const field of ['summary', 'simple', 'detailed', 'caution', 'exercise']) {
    if (!/[\u064B-\u065F]/.test(updated[field])) throw new Error(`ar: ${original.id} ${field} is not vocalized`);
    if (stripHarakat(updated[field]) !== stripHarakat(original[field])) throw new Error(`ar: ${original.id} ${field} changed letters while vocalizing\nOriginal: ${stripHarakat(original[field])}\nVocalized stripped: ${stripHarakat(updated[field])}`);
  }
  if (updated.vocab.length !== original.vocab.length) throw new Error(`ar: ${original.id} vocabulary count changed`);
  for (const [termIndex, term] of original.vocab.entries()) {
    if (!/[\u064B-\u065F]/.test(updated.vocab[termIndex])) throw new Error(`ar: ${original.id} vocabulary ${termIndex} is not vocalized`);
    if (stripHarakat(updated.vocab[termIndex]) !== stripHarakat(term)) throw new Error(`ar: ${original.id} vocabulary ${termIndex} changed letters while vocalizing\nOriginal: ${stripHarakat(term)}\nVocalized stripped: ${stripHarakat(updated.vocab[termIndex])}`);
  }
}
for (const [locale, items] of [['ar', ar], ['fr', fr]]) {
  if (!Array.isArray(items) || items.length < 20) throw new Error(`${locale}: fewer than 20 learning units`);
  const ids = new Set();
  const passages = new Set();
  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`${locale}: duplicate id ${item.id}`);
    if (passages.has(item.matn)) throw new Error(`${locale}: duplicate matn passage for ${item.id}`);
    ids.add(item.id);
    passages.add(item.matn);
    for (const field of required) if (!item[field] || (Array.isArray(item[field]) && item[field].length === 0)) throw new Error(`${locale}: ${item.id} lacks ${field}`);
  }
}
if (ar.map(item => item.id).join('|') !== fr.map(item => item.id).join('|')) throw new Error('Arabic and French curricular units are out of alignment');
for (const path of ['index.html', 'ar/index.html', 'fr/index.html']) {
  const html = fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  if (!html.includes('viewport') || !html.includes('site.css')) throw new Error(`${path}: missing responsive or stylesheet metadata`);
  if (path === 'ar/index.html' && !html.includes('vocalized-ar.js')) throw new Error('Arabic page does not load the vocalized edition');
}
const app = fs.readFileSync(new URL('../assets/app.js', import.meta.url), 'utf8');
if (!app.includes('commentary-reference') || !app.includes('commentaryCitation')) throw new Error('lesson commentary-source rendering is missing');
console.log(`Validated ${ar.length} aligned Arabic/French units.`);
