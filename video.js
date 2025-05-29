// ==UserScript==
// @name        uBO: Video Progress Saver
// @description Saves and restores HTML5 video progress using localStorage
// @include     *
// @grant       none
// @run-at      document-idle
// ==/UserScript==

(function () {
  'use strict';

  const SAVE_INTERVAL = 5000; // ms
  const STORAGE_KEY_PREFIX = 'ubo_video_progress_';

  function saveProgress(video) {
    const key = STORAGE_KEY_PREFIX + location.href;
    localStorage.setItem(key, video.currentTime);
  }

  function loadProgress(video) {
    const key = STORAGE_KEY_PREFIX + location.href;
    const savedTime = parseFloat(localStorage.getItem(key));
    if (!isNaN(savedTime)) {
      video.currentTime = savedTime;
    }
  }

  function attach(video) {
    if (!video || video.dataset.uboProgressAttached) return;
    video.dataset.uboProgressAttached = 'true';
    loadProgress(video);

    let interval = setInterval(() => saveProgress(video), SAVE_INTERVAL);

    video.addEventListener('ended', () => {
      const key = STORAGE_KEY_PREFIX + location.href;
      localStorage.removeItem(key);
      clearInterval(interval);
    });
  }

  const observer = new MutationObserver(() => {
    document.querySelectorAll('video').forEach(attach);
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Initial run
  document.querySelectorAll('video').forEach(attach);
})();
