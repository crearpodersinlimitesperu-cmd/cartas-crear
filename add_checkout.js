const fs = require('fs');
let content = fs.readFileSync('fernando-aragon-c1.html', 'utf8');

content = content.replace(
    'hasta el domingo 16 de agosto).', 
    'hasta el domingo 16 de agosto - incluye Late Checkout).'
);

content = content.replace(
    '<a href="https://maps.app.goo.gl/C7K8aFz6s9aYwT6q6" target="_blank" class="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 underline-offset-2 transition-colors">Hotel Jose Antonio Deluxe</a>, Miraflores',
    '<a href="https://maps.app.goo.gl/C7K8aFz6s9aYwT6q6" target="_blank" class="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 underline-offset-2 transition-colors">Hotel Jose Antonio Deluxe</a>, Miraflores <span class="ml-2 text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full border border-amber-500/30 whitespace-nowrap">Late Checkout Confirmado</span>'
);

fs.writeFileSync('fernando-aragon-c1.html', content, 'utf8');
