// ====================== script ======================
// Simple utility functions
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// ====================== MUSIC PLAYER ======================
function initMusicPlayer() {
  console.log('Initializing music player...');
  
  const musicPlayer = $('#musicPlayer');
  const musicIcon = $('#musicIcon');
  const playBtn = $('#playBtn');
  const playIcon = $('#playIcon');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const volumeSlider = $('#volumeSlider');
  const songProgress = $('#songProgress');
  const currentSongTitle = $('#currentSongTitle');
  const currentSongArtist = $('#currentSongArtist');
  const playlistItems = $$('.playlist-item');
  
  // SIMPLIFIED: First song lang ang meron
  const songs = [
    {
      id: 'song1',
      title: 'Paligaw ligaw tingin',
      artist: 'Song for Engelo',
      src: 'audio/Paligaw.mp3'
    },
    {
      id: 'song2',
      title: 'Tuloy Pa Rin',
      artist: 'Song for Engelo',
      src: 'audio/TuloyPaRin.mp3'
    },
    {
      id: 'song3',
      title: 'Pretty Girl',
      artist: 'Song for Engelo',
      src: 'audio/PrettyGirl.mp3'
    },
    {
      id: 'song4',
      title: 'Kisame',
      artist: 'Song for Engelo',
      src: 'audio/Kisame.mp3'
    }
  ];
  
  let currentAudio = null;
  let currentSongIndex = 0;
  let isPlaying = false;
  
  // SIMPLE FUNCTION: Load and auto-play first song
  function loadAndAutoPlayFirstSong() {
    console.log('Loading first song for auto-play...');
    
    // Create audio element
    currentAudio = document.createElement('audio');
    currentAudio.id = 'first-song';
    currentAudio.src = songs[0].src;
    currentAudio.volume = 0.5;
    currentAudio.loop = true;
    
    // Set up event listeners
    currentAudio.addEventListener('timeupdate', updateProgress);
    currentAudio.addEventListener('canplaythrough', function() {
      console.log('First song loaded, trying to auto-play...');
      autoPlayFirstSong();
    });
    
    currentAudio.addEventListener('error', function(e) {
      console.error('Error loading audio:', e);
    });
    
    document.body.appendChild(currentAudio);
    
    // Update UI
    if (currentSongTitle) currentSongTitle.textContent = songs[0].title;
    if (currentSongArtist) currentSongArtist.textContent = songs[0].artist;
    if (playlistItems[0]) playlistItems[0].classList.add('active');
    
    // Auto-expand music player
    musicPlayer.classList.add('expanded');
    musicIcon.className = 'fas fa-chevron-down';
  }
  
  // Try to auto-play
  function autoPlayFirstSong() {
    if (!currentAudio) return;
    
    console.log('Attempting auto-play...');
    
    // ADDED: 2-second delay before playing
    setTimeout(() => {
      currentAudio.play().then(() => {
        console.log('First song is now playing!');
        isPlaying = true;
        if (playIcon) playIcon.className = 'fas fa-pause';
        
        // Show play state
        musicPlayer.style.background = 'linear-gradient(135deg, #ff6fa3, #ff9ccf)';
        musicPlayer.style.borderColor = '#ff6fa3';
        
      }).catch(error => {
        console.log('Auto-play blocked. Need user interaction.');
        
        // Add visual cue
        musicPlayer.style.animation = 'pulse 2s infinite';
        musicPlayer.style.cursor = 'pointer';
        musicPlayer.title = 'Click to play music';
        
        // Add click to play
        const playOnClick = function() {
          console.log('User clicked to play');
          musicPlayer.style.animation = '';
          currentAudio.play().then(() => {
            isPlaying = true;
            if (playIcon) playIcon.className = 'fas fa-pause';
            musicPlayer.style.background = 'linear-gradient(135deg, #ff6fa3, #ff9ccf)';
          });
          document.removeEventListener('click', playOnClick);
        };
        
        document.addEventListener('click', playOnClick, { once: true });
      });
    }, 2000); // 2-second delay before playing
  }
  
  // Play current song
  function playCurrentSong() {
    if (!currentAudio) return;
    
    currentAudio.play().then(() => {
      isPlaying = true;
      if (playIcon) playIcon.className = 'fas fa-pause';
    }).catch(error => {
      console.error('Playback failed:', error);
    });
  }
  
  // Pause current song
  function pauseCurrentSong() {
    if (!currentAudio) return;
    
    currentAudio.pause();
    isPlaying = false;
    if (playIcon) playIcon.className = 'fas fa-play';
  }
  
  // Toggle play/pause
  function togglePlayPause() {
    if (!currentAudio) {
      loadAndAutoPlayFirstSong();
      return;
    }
    
    if (isPlaying) {
      pauseCurrentSong();
    } else {
      playCurrentSong();
    }
  }
  
  // Play next song (for other songs)
  function playNextSong() {
    if (!currentAudio) return;
    
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= songs.length) nextIndex = 0;
    currentSongIndex = nextIndex;
    
    // Change song
    currentAudio.src = songs[nextIndex].src;
    currentSongTitle.textContent = songs[nextIndex].title;
    
    // Update playlist highlight
    playlistItems.forEach((item, i) => {
      item.classList.toggle('active', i === nextIndex);
    });
    
    if (isPlaying) {
      currentAudio.play();
    }
  }
  
  // Play previous song
  function playPrevSong() {
    if (!currentAudio) return;
    
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) prevIndex = songs.length - 1;
    currentSongIndex = prevIndex;
    
    // Change song
    currentAudio.src = songs[prevIndex].src;
    currentSongTitle.textContent = songs[prevIndex].title;
    
    // Update playlist highlight
    playlistItems.forEach((item, i) => {
      item.classList.toggle('active', i === prevIndex);
    });
    
    if (isPlaying) {
      currentAudio.play();
    }
  }
  
  // Update progress bar
  function updateProgress() {
    if (!currentAudio || !songProgress) return;
    
    const percent = (currentAudio.currentTime / currentAudio.duration) * 100 || 0;
    songProgress.style.width = percent + '%';
  }
  
  // Update volume
  function updateVolume() {
    if (!currentAudio || !volumeSlider) return;
    currentAudio.volume = volumeSlider.value / 100;
  }
  
  // ====================== EVENT LISTENERS ======================
  
  // Toggle music player expand/collapse
  musicPlayer.addEventListener('click', (e) => {
    if (e.target.closest('.music-btn') || 
        e.target.closest('.playlist-item') ||
        e.target.closest('.volume-slider')) {
      return;
    }
    
    musicPlayer.classList.toggle('expanded');
    if (musicPlayer.classList.contains('expanded')) {
      musicIcon.className = 'fas fa-chevron-down';
    } else {
      musicIcon.className = 'fas fa-music';
    }
  });
  
  // Play/Pause button
  if (playBtn) {
    playBtn.addEventListener('click', togglePlayPause);
  }
  
  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', playPrevSong);
  }
  
  // Next button
  if (nextBtn) {
    nextBtn.addEventListener('click', playNextSong);
  }
  
  // Volume slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', updateVolume);
  }
  
  // Playlist items
  playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (!currentAudio) {
        loadAndAutoPlayFirstSong();
        return;
      }
      
      currentSongIndex = index;
      currentAudio.src = songs[index].src;
      currentSongTitle.textContent = songs[index].title;
      
      playlistItems.forEach((item2, i) => {
        item2.classList.toggle('active', i === index);
      });
      
      if (isPlaying) {
        currentAudio.play();
      }
    });
  });
  
  // Click on progress bar to seek
  const progressBar = $('.progress-bar');
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      if (!currentAudio) return;
      
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      currentAudio.currentTime = percent * currentAudio.duration;
    });
  }
  
  // LOAD AND AUTO-PLAY FIRST SONG ON PAGE LOAD WITH 2-SECOND DELAY
  setTimeout(() => {
    loadAndAutoPlayFirstSong();
  }, 2000); // Changed to 2 seconds delay
}

// ====================== COUNT UP TIMER ======================
function initCountUp() {
  console.log('Initializing COUNT UP timer...');
  const startDate = new Date('October 14, 2025 00:00:00').getTime();
  console.log('Count Up Start Date:', new Date(startDate));

  function updateCountUp() {
    const now = new Date().getTime();
    const timePassed = now - startDate;
    const totalSeconds = Math.floor(timePassed / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const daysElement = $('#days');
    const hoursElement = $('#hours');
    const minutesElement = $('#minutes');
    const secondsElement = $('#seconds');

    if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
  }

  const countUpInterval = setInterval(updateCountUp, 1000);
  updateCountUp();
  return countUpInterval;
}

// ====================== MEMORY COUNTERS ======================
function initMemoryCounters() {
  let smiles = 0;
  let memories = 0;
  let laughter = 0;
  let animationStarted = false;

  function updateCounters() {
    const smilesElement = $('#smilesCount');
    const memoriesElement = $('#memoriesCount');
    const laughterElement = $('#laughterCount');

    if (smilesElement) smilesElement.textContent = smiles.toLocaleString();
    if (memoriesElement) memoriesElement.textContent = memories.toLocaleString();
    if (laughterElement) laughterElement.textContent = laughter.toLocaleString();
  }

  const timelinePanel = $('#timeline');
  if (timelinePanel) {
    const header = timelinePanel.querySelector('.panel-header');
    if (header) {
      header.addEventListener('click', function () {
        if (!animationStarted && timelinePanel.classList.contains('open')) {
          animationStarted = true;
          setTimeout(() => {
            const interval = setInterval(() => {
              smiles = Math.min(smiles + Math.floor(Math.random() * 5) + 1, 9999);
              memories = Math.min(memories + Math.floor(Math.random() * 3) + 1, 9999);
              laughter = Math.min(laughter + Math.floor(Math.random() * 4) + 1, 9999);
              updateCounters();

              if (smiles >= 9999 && memories >= 9999 && laughter >= 9999) {
                clearInterval(interval);
              }
            }, 100);
          }, 500);
        }
      });
    }
  }
}

// ====================== ACCORDION ======================
function initAccordion() {
  const panels = $$('.panel');
  panels.forEach(panel => {
    const header = panel.querySelector('.panel-header');
    if (header) {
      header.addEventListener('click', () => {
        panels.forEach(p => {
          if (p !== panel) {
            p.classList.remove('open');
            const content = p.querySelector('.panel-content');
            if (content) content.style.maxHeight = null;
          }
        });

        panel.classList.toggle('open');
        const content = panel.querySelector('.panel-content');
        if (content) {
          if (panel.classList.contains('open')) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.style.maxHeight = null;
          }
        }
      });
    }
  });
}

// ====================== BUTTONS ======================
function initButtons() {
  const scrollToAboutBtn = $('#scrollToAbout');
  if (scrollToAboutBtn) {
    scrollToAboutBtn.addEventListener('click', () => {
      const aboutPanel = $('#about');
      if (aboutPanel) {
        const header = aboutPanel.querySelector('.panel-header');
        if (header) header.click();
      }
    });
  }

  const surpriseQuickBtn = $('#surpriseQuick');
  if (surpriseQuickBtn) {
    surpriseQuickBtn.addEventListener('click', () => {
      const surprisePanel = $('#surprise');
      if (surprisePanel) {
        const header = surprisePanel.querySelector('.panel-header');
        if (header) header.click();
      }
    });
  }

  const revealSurpriseBtn = $('#revealSurprise');
  if (revealSurpriseBtn) {
    revealSurpriseBtn.addEventListener('click', function () {
      this.classList.add('bounce');
      setTimeout(() => this.classList.remove('bounce'), 1000);

      const surpriseMessage = $('#surpriseMessage');
      if (surpriseMessage) {
        surpriseMessage.style.display = 'block';
      }

      for (let i = 0; i < 20; i++) {
        createFloatingHeart();
      }
    });
  }
}

// ====================== FLOATING HEARTS ======================
function createFloatingHeart() {
  const heart = document.createElement('div');
  heart.innerHTML = '❤️';
  heart.style.position = 'fixed';
  heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.top = '100vh';
  heart.style.opacity = Math.random() * 0.5 + 0.3;
  heart.style.zIndex = '9999';
  heart.style.pointerEvents = 'none';

  document.body.appendChild(heart);

  const animation = heart.animate([
    { transform: 'translateY(0) rotate(0deg)', opacity: heart.style.opacity },
    { transform: `translateY(-100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
  ], {
    duration: Math.random() * 3000 + 2000,
    easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
  });

  animation.onfinish = () => heart.remove();
}

// ====================== GALLERY LIGHTBOX ======================
function initGallery() {
  const masonry = $('#masonry');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');

  if (masonry && lightbox && lightboxImg) {
    masonry.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        lightboxImg.src = e.target.src;
        lightbox.style.display = 'flex';
      }
    });

    lightbox.addEventListener('click', () => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
    });
  }
}

// ====================== TYPEWRITER EFFECT ======================
function initTypewriter() {
  const target = $('#typewriter');
  if (!target) return;

  const lines = [
    "My Dearest Engelo,",
    "",
    "There are moments in life that change everything,",
    "and meeting you was one of those moments.",
    "",
    "You have this incredible light within you,",
    "a warmth that touches everyone around you.",
    "",
    "I admire your strength, your kindness,",
    "and the beautiful way you see the world.",
    "",
    "This is just a small token of my affection,",
    "a digital love letter to remind you",
    "how truly special you are.",
    "",
    "Will you let me be the one",
    "who makes you smile every single day? 💕",
    "",
    "With all my heart, always."
  ];

  target.textContent = '';
  let hasTyped = false;
  let typingInProgress = false;

  function startTyping() {
    if (hasTyped || typingInProgress) return;

    typingInProgress = true;
    hasTyped = true;

    let lineIndex = 0;
    let charIndex = 0;

  function typeNextChar() {
      if (lineIndex >= lines.length) {
        typingInProgress = false;
        return;
      }

      const currentLine = lines[lineIndex];

      if (charIndex <= currentLine.length) {
        const textSoFar = lines.slice(0, lineIndex).join('\n') +
          (lineIndex > 0 ? '\n' : '') +
          currentLine.slice(0, charIndex) +
          (charIndex < currentLine.length ? '|' : '');

        target.textContent = textSoFar;
        charIndex++;

        const speed = charIndex === currentLine.length + 1 ? 500 : 30 + Math.random() * 40;
        setTimeout(typeNextChar, speed);
      } else {
        charIndex = 0;
        lineIndex++;
        const isNewParagraph = lines[lineIndex] === "";
        setTimeout(typeNextChar, isNewParagraph ? 800 : 300);
      }
    }

    setTimeout(typeNextChar, 300);
  }

  const messagePanel = $('#message');
  if (messagePanel) {
    const header = messagePanel.querySelector('.panel-header');
    header.addEventListener('click', function () {
      setTimeout(() => {
        if (messagePanel.classList.contains('open')) {
          console.log('Message panel opened, starting typewriter...');
          startTyping();
        }
      }, 350);
    });
  }

  setTimeout(() => {
    if (messagePanel && messagePanel.classList.contains('open')) {
      console.log('Message panel already open on load');
      startTyping();
    }
  }, 1500);
}

// ====================== INITIALIZE EVERYTHING ======================
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, initializing...');

  // Initialize COUNT UP timer
  initCountUp();

  // Initialize other features
  initMemoryCounters();
  initAccordion();
  initButtons();
  initGallery();
  initTypewriter();
  initMusicPlayer(); // Make sure this is called!

  // Auto-open first panel
  setTimeout(() => {
    const aboutPanel = $('#about');
    if (aboutPanel) {
      const header = aboutPanel.querySelector('.panel-header');
      if (header) header.click();
    }
  }, 1000);

  // Create background hearts
  const container = $('#floatingHeartsBg');
  if (container) {
    for (let i = 0; i < 25; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-bg';
      heart.innerHTML = '❤️';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
      heart.style.animationDelay = Math.random() * 20 + 's';
      heart.style.animationDuration = (Math.random() * 10 + 15) + 's';
      container.appendChild(heart);
    }
  }
});