'use client';

import { useEffect, useRef } from 'react';

/**
 * Retries video.play() on first user interaction and
 * resumes playback when the page becomes visible again
 * (e.g. returning from another tab/app on mobile).
 *
 * `shouldPlay` lets the caller veto a retry — used by the shared hero video,
 * which is deliberately paused while no canvas is on screen.
 */
export function useAutoplayRetry(video: HTMLVideoElement | null, shouldPlay?: () => boolean) {
  const shouldPlayRef = useRef(shouldPlay);

  useEffect(() => {
    shouldPlayRef.current = shouldPlay;
  });

  useEffect(() => {
    if (!video) return;

    const tryPlay = () => {
      if (video.paused && (shouldPlayRef.current?.() ?? true)) {
        video.play().catch(() => {});
      }
    };

    // One-time: retry play on first user gesture
    const events = ['click', 'touchstart', 'scroll', 'keydown'] as const;
    const onGesture = () => {
      tryPlay();
      events.forEach((evt) => document.removeEventListener(evt, onGesture));
    };
    events.forEach((evt) =>
      document.addEventListener(evt, onGesture, { once: true, passive: true })
    );

    // Persistent: resume when returning to tab/app
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      events.forEach((evt) => document.removeEventListener(evt, onGesture));
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [video]);
}
