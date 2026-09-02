const fs = require('fs');

const f = 'fernando-aragon-c1.html';
let content = fs.readFileSync(f, 'utf8');

const regex = /(El arranque del C1 para el Equipo 30 💥[\s\S]*?<\/p>)/;

const replacement = `$1

            <div class="inline-block px-8 py-3 rounded-full border border-[#f59e0b]/50 bg-[#f59e0b]/10 mb-8 reveal shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:scale-105 transition-transform" style="transition-delay: 250ms;">
                <p class="text-[#f59e0b] font-black text-xl md:text-2xl italic tracking-wider">"¡¡¡Se Puso Buena!!!"</p>
            </div>`;

content = content.replace(regex, replacement);

fs.writeFileSync(f, content, 'utf8');
