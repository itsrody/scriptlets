(function () {
  const INTERVAL = 5; // seconds
  const STORAGE_KEY = 'video-progress';
  const MAX_WAIT = 10000; // max time to wait for video (10 sec)
  const CHECK_INTERVAL = 500;

  let waited = 0;

  function trySetup() {
    const container = document.getElementById('player');
    if (!container) return;

    const video = container.querySelector('video');
    if (!video) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        video.currentTime = parseFloat(saved);
      } catch (e) {}
    }

    let lastSaved = 0;
    video.addEventListener('timeupdate', () => {
      const now = Math.floor(video.currentTime);
      if (Math.abs(now - lastSaved) >= INTERVAL) {
        localStorage.setItem(STORAGE_KEY, now);
        lastSaved = now;
      }
    });
  }

  // Wait until #player and video are available
  const interval = setInterval(() => {
    if (waited >= MAX_WAIT) {
      clearInterval(interval);
      return;
    }
    try {
      trySetup();
    } catch (e) {}
    waited += CHECK_INTERVAL;
  }, CHECK_INTERVAL);
})();
