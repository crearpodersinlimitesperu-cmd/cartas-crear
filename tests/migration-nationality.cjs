const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
for (const file of ['carta_invitacion_migraciones.html', 'docs/carta_invitacion_migraciones.html', 'docs/cartas/carta_invitacion_migraciones.html']) {
  const html = fs.readFileSync(file, 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
  function render(params) {
    const fields = {};
    vm.runInNewContext(script, { URLSearchParams, window: { location: { search: new URLSearchParams(params).toString() } }, document: {
      addEventListener: (_, callback) => callback(),
      getElementById: id => fields[id] ||= { textContent: '' }
    }});
    return Object.fromEntries(Object.entries(fields).map(([id, el]) => [id, el.textContent]));
  }
  assert.equal(render({nombre:'Persona sin registro'})['field-nacionalidad'], '[NACIONALIDAD PENDIENTE]');
  assert.equal(render({nombre:'Mildred Muñoz Vasquez', nacionalidad:' colombiana '})['field-nacionalidad'], 'COLOMBIANA');
  const unrelated = render({nombre:'Fernando Perez', nacionalidad:'PERUANA'});
  assert.equal(unrelated['field-name'], 'FERNANDO PEREZ');
  assert.equal(unrelated['field-doc'], '[DOCUMENTO / PASAPORTE]');
  assert.equal(render({nombre:'Fernando Aragon', nacionalidad:'CHILENA'})['field-nacionalidad'], 'CHILENA');
  const aragon = render({nombre:'Fernando Aragon'});
  const aragonWithBlankValues = render({nombre:'Fernando Aragon', nacionalidad:'', doc:''});
  assert.equal(aragonWithBlankValues['field-nacionalidad'], aragon['field-nacionalidad']);
  assert.equal(aragonWithBlankValues['field-doc'], aragon['field-doc']);
  const verified = render({nombre:'Mildred Muñoz Vasquez', nacionalidad:'ECUATORIANA', doc:'PASAPORTE ECUATORIANO'});
  assert.equal(verified['field-nacionalidad'], 'COLOMBIANA');
  assert.equal(verified['field-doc'], 'PASAPORTE COLOMBIANO');
  assert.equal(render({nombre:' mildred   munoz vasquez ', nacionalidad:''})['field-nacionalidad'], 'COLOMBIANA');
  const elmer = render({
    nombre:'ELMER IDROBO ANDRADE',
    nacionalidad:'',
    doc:'',
    fechas:'Del 10 al 12 de octubre de 2026',
    hotel:'Hotel de prueba'
  });
  assert.equal(elmer['field-name'], 'ELMER ANDRES IDROBO ANDRADE');
  assert.equal(elmer['field-nacionalidad'], 'ECUATORIANA');
  assert.equal(elmer['field-doc'], 'PASAPORTE ECUATORIANO');
  assert.doesNotMatch(elmer['field-doc'], /\d/);
  assert.equal(elmer['field-dates'], 'Del 10 al 12 de octubre de 2026');
  assert.equal(elmer['field-hotel'], 'Hotel de prueba');
  const elmerWithStaleIdentity = render({
    nombre:'ELMER IDROBO ANDRADE',
    nacionalidad:'PERUANA',
    doc:'DNI 12345678'
  });
  assert.equal(elmerWithStaleIdentity['field-nacionalidad'], 'ECUATORIANA');
  assert.equal(elmerWithStaleIdentity['field-doc'], 'PASAPORTE ECUATORIANO');
  console.log('PASS', file);
}
const source = fs.readFileSync('index.html', 'utf8');
const button = source.slice(source.indexOf('  const migNombre'), source.indexOf('\n\r', source.indexOf('  const migNombre')) > 0 ? source.indexOf('\n\r', source.indexOf('  const migNombre')) : source.indexOf("  const migracionBtn"));
assert.ok(source.includes("'&nacionalidad=' + migNacionalidad"));
assert.ok(!button.includes('PASAPORTE ECUATORIANO'));
