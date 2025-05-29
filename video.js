  // Video Progress Save/Restore
  (function setupVideoProgressSave(video) {
    if (!video || video._progressTracked) return;
    video._progressTracked = true;

    const STORAGE_KEY_PREFIX = 'video-progress-';
    const key = STORAGE_KEY_PREFIX + (video.currentSrc || video.src || location.href);

    try {
      // Restore progress
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      if (saved && typeof saved.time === 'number' && saved.time < video.duration - 10) {
        video.currentTime = saved.time;
      }
    } catch (e) {
      console.warn('Failed to load saved video progress:', e);
    }

    // Save progress periodically
    video.addEventListener('timeupdate', () => {
      try {
        if (video.duration > 60 && !video.paused && !video.ended) {
          localStorage.setItem(key, JSON.stringify({
            time: video.currentTime,
            updated: Date.now()
          }));
        }
      } catch (e) {
        console.warn('Failed to save video progress:', e);
      }
    });
  })(mediaElement);
