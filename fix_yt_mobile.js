const fs = require('fs');

const ytScriptNew = `
      <div id="ytplayer" class="absolute -left-[9999px] top-0 w-[300px] h-[300px] opacity-0 pointer-events-none"></div>
      <script>
          var tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
          var player;
          var isPlaying = false;
          var playerReady = false;
  
          function onYouTubeIframeAPIReady() {
              player = new YT.Player('ytplayer', {
                  height: '300',
                  width: '300',
                  videoId: 's5R-d5hT32c',
                  playerVars: {
                      'autoplay': 0,
                      'controls': 0,
                      'loop': 1,
                      'playlist': 's5R-d5hT32c',
                      'playsinline': 1,
                      'rel': 0
                  },
                  events: {
                      'onReady': onPlayerReady,
                      'onStateChange': onPlayerStateChange
                  }
              });
          }

          function onPlayerStateChange(event) {
              if (event.data === YT.PlayerState.PLAYING) {
                  isPlaying = true;
                  const icon = document.querySelector('#musicToggleBtn i');
                  if(icon) {
                      icon.classList.remove('fa-music');
                      icon.classList.add('fa-pause', 'text-crear-accent', 'fa-beat-fade');
                  }
              } else if (event.data === YT.PlayerState.PAUSED) {
                  isPlaying = false;
                  const icon = document.querySelector('#musicToggleBtn i');
                  if(icon) {
                      icon.classList.remove('fa-pause', 'text-crear-accent', 'fa-beat-fade');
                      icon.classList.add('fa-music');
                  }
              }
          }
  
          function toggleMusic() {
              if (!playerReady || !player) return;
              if (isPlaying) {
                  player.pauseVideo();
              } else {
                  player.playVideo();
              }
          }
  
          function onPlayerReady(event) {
              playerReady = true;
              const openBtn = document.getElementById('openLetterBtn');
              if(openBtn) {
                  openBtn.innerHTML = '<i class="fa-solid fa-envelope-open-text"></i> ABRIR CARTA';
                  openBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
                  openBtn.classList.add('animate-pulse');
              }
          }
  
          document.addEventListener('DOMContentLoaded', () => {
              const overlay = document.getElementById('welcomeOverlay');
              const openBtn = document.getElementById('openLetterBtn');
              const musicBtn = document.getElementById('musicToggleBtn');
  
              if(openBtn && overlay) {
                  openBtn.addEventListener('click', () => {
                      overlay.style.opacity = '0';
                      setTimeout(() => overlay.remove(), 1000);
                      if (playerReady) {
                          player.playVideo();
                      }
                  });
              }
  
              if(musicBtn) {
                  musicBtn.addEventListener('click', (e) => {
                      e.stopPropagation();
                      toggleMusic();
                  });
              }
          });
      </script>
`;

['diego.html', 'fernando-aragon-c1.html'].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace script block and the old div ytplayer
    const divRegex = /<div id="ytplayer"[\s\S]*?<\/div>/;
    const scriptRegex = /<script>\s*var tag = document\.createElement\('script'\);[\s\S]*?<\/script>/;
    
    content = content.replace(divRegex, '');
    content = content.replace(scriptRegex, ytScriptNew.trim());
    
    // Also, initially disable the openLetterBtn in HTML
    const oldBtn = /<button id="openLetterBtn"[^>]*>[\s\S]*?<\/button>/;
    const newBtn = `
        <button id="openLetterBtn" class="px-10 py-5 bg-[#f59e0b] text-black font-black text-xl rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(251,191,36,0.6)] flex items-center gap-3 opacity-50 cursor-not-allowed pointer-events-none transition-all duration-500">
            <i class="fa-solid fa-spinner fa-spin"></i> PREPARANDO EXPERIENCIA...
        </button>
    `.trim();
    content = content.replace(oldBtn, newBtn);
    
    fs.writeFileSync(f, content, 'utf8');
});
