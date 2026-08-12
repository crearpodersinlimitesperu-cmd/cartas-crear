const fs = require('fs');

const file = 'fernando-aragon-c1.html';
let content = fs.readFileSync(file, 'utf8');

// Replace broken characters
content = content.replace(/Migracin/g, 'Migración');
content = content.replace(/Aragn/g, 'Aragón');
content = content.replace(/Captulo/g, 'Capítulo');
content = content.replace(/Jos Snchez/g, 'José Sánchez');

// Fix nationality
content = content.replace(
    /<p class="text-white font-medium text-lg">Ecuador<\/p>/g, 
    '<p class="text-white font-medium text-lg">México</p>'
);

fs.writeFileSync(file, content, 'utf8');
