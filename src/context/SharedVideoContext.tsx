'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAutoplayRetry } from '@/hooks/useAutoplayRetry';
import * as THREE from 'three';
import cdn from '@/lib/cdn';

interface SharedVideoContextType {
  video: HTMLVideoElement | null;
  texture: THREE.VideoTexture | null;
  /** Register a consumer that needs the video decoding. Returns a release fn. */
  acquire: () => () => void;
}

const SharedVideoContext = createContext<SharedVideoContextType>({
  video: null,
  texture: null,
  acquire: () => () => {},
});

export function useSharedVideo() {
  return useContext(SharedVideoContext);
}

/**
 * Keeps the shared video playing only while at least one canvas is on screen.
 * Decoding a looping video off-screen is pure CPU/battery cost on mobile.
 */
export function useSharedVideoPlayback(active: boolean) {
  const { acquire } = useSharedVideo();

  useEffect(() => {
    if (!active) return;
    return acquire();
  }, [active, acquire]);
}

export function SharedVideoProvider({ children }: { children: React.ReactNode }) {
  // One state update instead of two: the canvases need the element and its
  // texture at the same moment anyway.
  const [media, setMedia] = useState<{
    video: HTMLVideoElement;
    texture: THREE.VideoTexture;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const consumersRef = useRef(0);

  useEffect(() => {
    let createdTexture: THREE.VideoTexture | null = null;
    const vid = document.createElement('video');
    vid.src = `${cdn}/hero.mp4`;
    vid.crossOrigin = 'anonymous';
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.autoplay = true;
    videoRef.current = vid;

    vid.addEventListener(
      'canplay',
      () => {
        const tex = new THREE.VideoTexture(vid);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        createdTexture = tex;
        setMedia({ video: vid, texture: tex });
      },
      { once: true }
    );

    vid.play().catch(() => {});

    return () => {
      vid.pause();
      vid.removeAttribute('src');
      vid.load();
      videoRef.current = null;
      createdTexture?.dispose();
      setMedia(null);
    };
  }, []);

  const acquire = useCallback(() => {
    consumersRef.current += 1;
    if (consumersRef.current === 1) {
      videoRef.current?.play().catch(() => {});
    }
    let released = false;
    return () => {
      if (released) return;
      released = true;
      consumersRef.current -= 1;
      if (consumersRef.current === 0) {
        videoRef.current?.pause();
      }
    };
  }, []);

  // Never resume the shared video while every canvas is off screen.
  useAutoplayRetry(media?.video ?? null, () => consumersRef.current > 0);

  const value = useMemo(
    () => ({ video: media?.video ?? null, texture: media?.texture ?? null, acquire }),
    [media, acquire]
  );

  return <SharedVideoContext.Provider value={value}>{children}</SharedVideoContext.Provider>;
}
