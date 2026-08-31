'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Plays a video only while it is near the viewport and pauses it otherwise.
 *
 * Combined with `preload="none"` this also defers the download: an autoplaying
 * video starts fetching (and decoding) at page load no matter where it sits on
 * the page, which is the single most expensive thing a section can do on mobile.
 *
 * Returns a callback ref to attach to the <video> element.
 */
export function useInViewVideo(rootMargin = '200px') {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const inViewRef = useRef(false);

  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    setVideo(node);
  }, []);

  useEffect(() => {
    if (!video) return;

    const play = () => {
      if (inViewRef.current && video.paused && document.visibilityState === 'visible') {
        video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { rootMargin }
    );
    observer.observe(video);

    // Autoplay can be blocked until the first gesture, and mobile browsers
    // suspend playback when the app goes to the background.
    const gestures = ['click', 'touchstart', 'keydown'] as const;
    gestures.forEach((evt) => document.addEventListener(evt, play, { passive: true }));
    document.addEventListener('visibilitychange', play);

    return () => {
      observer.disconnect();
      gestures.forEach((evt) => document.removeEventListener(evt, play));
      document.removeEventListener('visibilitychange', play);
      video.pause();
    };
  }, [video, rootMargin]);

  return videoRef;
}
