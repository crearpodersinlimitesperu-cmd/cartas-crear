const fs = require('fs');

['diego.html', 'fernando-aragon-c1.html'].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // 1. Font
    content = content.replace(/family=Inter:/g, 'family=Montserrat:');
    content = content.replace(/'Inter', sans-serif/g, "'Montserrat', sans-serif");
    
    // 2. Bigger Logo
    content = content.replace(/class="h-24 md:h-32 object-contain drop-shadow/g, 'class="h-40 md:h-56 object-contain drop-shadow');
    
    // 3. Google Chat Button
    const chatBtn = '<a href="https://chat.google.com/" target="_blank" class="mt-4 flex items-center justify-center w-full py-3 bg-[#1a73e8]/20 hover:bg-[#1a73e8]/40 border border-[#1a73e8]/50 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(26,115,232,0.4)]"><i class="fa-brands fa-google mr-2"></i>Unirme al Chat de Entrenadores</a>';
    content = content.replace(/(<ul class="space-y-3">[\s\S]*?<\/ul>)/g, `$1\n${chatBtn}`);
    
    // 4. Map Links
    content = content.replace(/Hotel Jose Antonio Deluxe/g, '<a href="https://maps.app.goo.gl/C7K8aFz6s9aYwT6q6" target="_blank" class="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 underline-offset-2 transition-colors">Hotel Jose Antonio Deluxe</a>');
    content = content.replace(/Hostal Sol y Luna/g, '<a href="https://maps.app.goo.gl/C7K8aFz6s9aYwT6q6" target="_blank" class="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 underline-offset-2 transition-colors">Hostal Sol y Luna</a>');

    // 5. Autoplay Overlay
    const overlay = `
    <!-- Welcome Overlay for Autoplay -->
    <div id="welcomeOverlay" class="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-1000">
        <img src="logo_crear_blanco.png" alt="CREAR" class="h-28 md:h-40 mb-10 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)] animate-pulse">
        <button id="openLetterBtn" class="px-10 py-5 bg-[#f59e0b] text-black font-black text-xl rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(251,191,36,0.6)] flex items-center gap-3">
            <i class="fa-solid fa-envelope-open-text"></i> ABRIR CARTA
        </button>
        <p class="mt-6 text-gray-500 text-sm font-light">Enciende el volumen para la experiencia completa</p>
    </div>
    `;
    content = content.replace(/(<body[^>]*>)/, `$1\n${overlay}`);

    const jsOld = /document\.body\.addEventListener\('click', \(\) => {[\s\S]*?\}, \{ once: true \}\);/;
    const jsNew = `
            const overlay = document.getElementById('welcomeOverlay');
            const openBtn = document.getElementById('openLetterBtn');
            if(openBtn) {
                openBtn.addEventListener('click', () => {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 1000);
                    if (!isPlaying) toggleMusic();
                });
            }
    `;
    content = content.replace(jsOld, jsNew);
    
    fs.writeFileSync(f, content);
});
