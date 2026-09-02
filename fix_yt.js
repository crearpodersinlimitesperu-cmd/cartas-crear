const fs = require('fs');

const jsOldRegex = /var tag = document\.createElement\('script'\);[\s\S]*?\}\);[\s\S]*?\}/;

const jsNew = `
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
`;

['diego.html', 'fernando-aragon-c1.html'].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace script block
    content = content.replace(jsOldRegex, jsNew.trim());
    
    // Add playsinline and allow="autoplay" to iframe container if we were making it manually, but YT Iframe API does it.
    
    fs.writeFileSync(f, content, 'utf8');
});
