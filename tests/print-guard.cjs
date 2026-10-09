const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const catalog = JSON.parse(fs.readFileSync('sedes-institucionales.json', 'utf8'));
const valid = {'field-name':'PERSONA DE PRUEBA','field-nacionalidad':'CHILENA','field-doc':'PASAPORTE X0000000','field-hotel':'Hotel de Prueba','field-dates':'1 al 3 de enero'};

async function scenario(file, fields, { deferred } = {}) {
  const els = {};
  const mk = () => ({ textContent: '', disabled: false, value: '', children: [], className: '',
    setAttribute() {}, append(...c) { this.children.push(...c); }, replaceChildren() { this.children = []; },
    addEventListener(e, f) { (this.listeners ||= {})[e] = f; } });
  const ids = ['sede-authority','sede-city','sede-invitation','sede-signature','print-letter',...Object.keys(valid)];
  ids.forEach(id => { els[id] = mk(); els[id].textContent = id in fields ? fields[id] : '[PENDIENTE]'; });
  els['print-letter'].disabled = true;
  const pending = [];
  const fetch = async url => {
    if (String(url).includes('sedes-institucionales.json')) return { ok: true, json: async () => catalog };
    if (deferred) await new Promise(r => pending.push({ url: String(url), r }));
    return { ok: false, status: 404 };
  };
  const document = { currentScript: { src: 'https://x.test/carta-sedes.js' }, body: { prepend() {} },
    addEventListener(_, f) { document.start = f; }, getElementById: id => els[id],
    createElement: () => { const e = mk(); if (!e.tagName) e.tagName = 'X'; return e; } };
  let select;
  const origCreate = document.createElement;
  document.createElement = t => { const e = origCreate(t); if (t === 'select') select = e; return e; };
  const location = { search: '' };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { document, fetch, location, URL, URLSearchParams,
    AbortSignal, history: { replaceState() {} }, window: {} });
  return { els, document, location, pending, get select() { return select; }, fetch };
}
const tick = () => new Promise(r => setImmediate(r));

(async () => {
  for (const file of ['carta-sedes.js', 'docs/carta-sedes.js', 'docs/cartas/carta-sedes.js']) {
    // placeholders -> blocked with warning
    let s = await scenario(file, { ...valid, 'field-doc': '[DOCUMENTO / PASAPORTE]' });
    s.location.search = '?sede=lima'; await s.document.start(); await tick();
    assert.equal(s.els['print-letter'].disabled, true, file + ' debe bloquear con placeholder');
    // no sede selected -> blocked
    s = await scenario(file, valid);
    await s.document.start(); await tick();
    assert.equal(s.els['print-letter'].disabled, true, file + ' sin sede');
    // all valid -> enabled
    s = await scenario(file, valid);
    s.location.search = '?sede=lima'; await s.document.start(); await tick();
    assert.equal(s.els['print-letter'].disabled, false, file + ' datos validos');
    // stale async: lima slow, switch to blank -> older response must not enable
    s = await scenario(file, valid, { deferred: true });
    s.location.search = '?sede=lima';
    const started = s.document.start(); await tick(); await tick();
    s.select.value = ''; s.select.listeners.change(); await tick();
    s.pending.forEach(p => p.r()); await started; await tick();
    assert.equal(s.els['print-letter'].disabled, true, file + ' estado antiguo no debe habilitar');
  }
  console.log('PASS print guard');
})().catch(e => { console.error(e); process.exit(1); });
