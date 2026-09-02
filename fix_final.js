const fs = require('fs');

const ytScriptNew = `
      <script>
          var tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
          var player;
          var isPlaying = false;
          var userInteracted = false;
          var playerReady = false;
  
          function onYouTubeIframeAPIReady() {
              player = new YT.Player('ytplayer', {
                  height: '10',
                  width: '10',
                  videoId: 's5R-d5hT32c',
                  playerVars: {
                      'autoplay': 1,
                      'controls': 0,
                      'loop': 1,
                      'playlist': 's5R-d5hT32c',
                      'playsinline': 1
                  },
                  events: {
                      'onReady': onPlayerReady
                  }
              });
          }
  
          function toggleMusic() {
              if (!playerReady) return;
              const btn = document.getElementById('musicToggleBtn');
              const icon = btn.querySelector('i');
              if (isPlaying) {
                  player.pauseVideo();
                  if(icon) {
                      icon.classList.remove('fa-pause', 'text-crear-accent', 'fa-beat-fade');
                      icon.classList.add('fa-music');
                  }
                  isPlaying = false;
              } else {
                  player.playVideo();
                  if(icon) {
                      icon.classList.remove('fa-music');
                      icon.classList.add('fa-pause', 'text-crear-accent', 'fa-beat-fade');
                  }
                  isPlaying = true;
              }
          }
  
          function onPlayerReady(event) {
              playerReady = true;
              if (userInteracted && !isPlaying) {
                  toggleMusic();
              }
          }
  
          document.addEventListener('DOMContentLoaded', () => {
              const overlay = document.getElementById('welcomeOverlay');
              const openBtn = document.getElementById('openLetterBtn');
              const musicBtn = document.getElementById('musicToggleBtn');
  
              if(openBtn && overlay) {
                  openBtn.addEventListener('click', () => {
                      userInteracted = true;
                      overlay.style.opacity = '0';
                      setTimeout(() => overlay.remove(), 1000);
                      if (playerReady && !isPlaying) {
                          toggleMusic();
                      }
                  });
              }
  
              if(musicBtn) {
                  musicBtn.addEventListener('click', (e) => {
                      e.stopPropagation();
                      userInteracted = true;
                      toggleMusic();
                  });
              }
          });
      </script>
`;

['diego.html', 'fernando-aragon-c1.html'].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Find everything from <script> var tag = ... up to </script>
    const regex = /<script>\s*var tag = document\.createElement\('script'\);[\s\S]*?<\/script>/;
    content = content.replace(regex, ytScriptNew.trim());
    
    // Add Google Chat to Diego if missing
    if(f === 'diego.html' && !content.includes('Chat de Entrenadores')) {
        const chatBtn = '<a href="https://chat.google.com/room/AAQAj8M5Q-8?cls=7" target="_blank" class="mt-4 flex items-center justify-center w-full py-3 bg-[#1a73e8]/20 hover:bg-[#1a73e8]/40 border border-[#1a73e8]/50 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(26,115,232,0.4)]"><i class="fa-brands fa-google mr-2"></i>Unirme al Chat de Entrenadores</a>';
        content = content.replace(/(<ul class="space-y-3">[\s\S]*?<\/ul>)/, `$1\n${chatBtn}`);
    } else {
        content = content.replace(/https:\/\/chat\.google\.com\//g, 'https://chat.google.com/room/AAQAj8M5Q-8?cls=7');
    }
    
    fs.writeFileSync(f, content, 'utf8');
});
