const fs = require('fs');

['diego.html', 'fernando-aragon-c1.html'].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/Migraci\uFFFDn/g, 'Migración');
    content = content.replace(/Arag\uFFFDn/g, 'Aragón');
    content = content.replace(/Cap\uFFFDtulo/g, 'Capítulo');
    content = content.replace(/Per\uFFFD/g, 'Perú');
    content = content.replace(/Jos\uFFFD S\uFFFDnchez/g, 'José Sánchez');
    fs.writeFileSync(f, content, 'utf8');
});
