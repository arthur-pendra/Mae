'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo3D from './LogoParticles';
import VideoPlane from './VideoPlane';
import { useSharedVideo, useSharedVideoPlayback } from '@/context/SharedVideoContext';
import { usePanel } from '@/context/PanelContext';
import {
  Invalidator,
  canvasDpr,
  getScaleAndZoom,
  glOptions,
  usePointerTilt,
  useScreenSize,
} from './useParticleScene';
import styles from './ParticleHero.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ParticleHero() {
  const screenSize = useScreenSize();
  const scrollProgressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sideLabelsRef = useRef<HTMLDivElement>(null);
  const mobileCtaRef = useRef<HTMLDivElement>(null);
  const { video: sharedVideo, texture: sharedTexture } = useSharedVideo();
  const { openPanel, activePanel } = usePanel();
  const introOffsetRef = useRef(2.0); // Logo starts tilted+dropped below screen
  const bgBrightnessRef = useRef({ value: 0 }); // Animated by GSAP
  const loaderRef = useRef<HTMLDivElement>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const heroVisibleRef = useRef(true);

  // An open panel covers the whole viewport, so nothing behind it needs drawing.
  const active = heroVisible && activePanel === null;

  const mouseRef = usePointerTilt(screenSize, active);
  useSharedVideoPlayback(active);

  const handleLogoReady = useCallback(() => {
    setLogoReady(true);
  }, []);

  // Intro animation: starts only after the 3D logo has rendered its first frame
  useEffect(() => {
    if (!logoReady) return;

    const startDelay = 1; // Logo starts after 1 second
    const logoDuration = 2.0;
    const brightenDuration = 2.0;
    const fadeDuration = 0.8;

    // Fade out loader as logo starts
    const loaderTween = loaderRef.current
      ? gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: startDelay - 0.3,
          ease: 'power2.inOut',
        })
      : null;

    // After 1 second: logo animates up
    const introTween = gsap.to(introOffsetRef, {
      current: 0,
      duration: logoDuration,
      delay: startDelay,
      ease: 'power3.out',
    });

    // Background fades in gradually after logo has mostly landed
    const brightenDelay = startDelay + logoDuration * 0.5;
    const brightenTween = gsap.to(bgBrightnessRef.current, {
      value: 0.18,
      duration: brightenDuration,
      delay: brightenDelay,
      ease: 'power2.out',
    });

    // Fade in side labels + mobile CTA after background starts brightening
    const uiFadeDelay = brightenDelay + brightenDuration * 0.4;
    const uiTween = gsap.to([sideLabelsRef.current, mobileCtaRef.current].filter(Boolean), {
      opacity: 1,
      duration: fadeDuration,
      delay: uiFadeDelay,
      ease: 'power2.out',
    });

    // Navigation fades in + scroll unblocked after UI elements
    const navTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('heroIntroComplete'));
      setIntroComplete(true);
    }, (uiFadeDelay + fadeDuration * 0.3) * 1000);

    return () => {
      clearTimeout(navTimer);
      loaderTween?.kill();
      introTween.kill();
      brightenTween.kill();
      uiTween.kill();
    };
  }, [logoReady]);

  // Scroll-based: tilt + drop when scrolling away from hero
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
        // Update label opacity directly via DOM
        const opacity = String(Math.max(0, 1 - self.progress * 3));
        if (sideLabelsRef.current) sideLabelsRef.current.style.opacity = opacity;
        // Pause canvas when hero is fully scrolled away
        const nowVisible = self.progress < 1;
        if (nowVisible !== heroVisibleRef.current) {
          heroVisibleRef.current = nowVisible;
          setHeroVisible(nowVisible);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const isMobile = screenSize === 'mobile';
  const { scale, zoom } = getScaleAndZoom(screenSize);
  const logoYOffset = isMobile ? 0.05 : 0;

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Intro loader */}
      {!introComplete && (
        <div ref={loaderRef} className={styles.loader}>
          <span className={styles.loaderText}>Move Adapt Evolve</span>
        </div>
      )}

      {/* Side Labels - start hidden, fade in after intro */}
      <div ref={sideLabelsRef} className={styles.sideLabels} style={{ opacity: 0 }}>
        <button className={`${styles.sideLabel} ${styles.left}`} onClick={() => openPanel('start-nu', 'fysio')}>
          [START FYSIOTHERAPIE]
        </button>
        <button className={`${styles.sideLabel} ${styles.right}`} onClick={() => openPanel('start-nu', 'leefstijl')}>
          [START LEEFSTIJL COACHING]
        </button>
      </div>

      {/* Mobile CTA buttons — start hidden, fade in after intro */}
      {isMobile && (
        <div ref={mobileCtaRef} className={styles.mobileCta} style={{ opacity: 0 }}>
          <button className={styles.mobileCtaGreen} onClick={() => openPanel('start-nu', 'fysio')}>
            Fysiotherapie
          </button>
          <button className={styles.mobileCtaGray} onClick={() => openPanel('start-nu', 'leefstijl')}>
            Leefstijlcoaching
          </button>
        </div>
      )}

      {/* Only render Canvas once screenSize is known to prevent zoom/scale flash */}
      {screenSize !== null && (
        <Canvas
          orthographic
          camera={{ position: [0, 0, 100], zoom, near: 0.1, far: 200 }}
          frameloop="demand"
          gl={glOptions}
          dpr={canvasDpr}
        >
          <Invalidator active={active} />
          <VideoPlane texture={sharedTexture} video={sharedVideo} brightnessRef={bgBrightnessRef} />
          <Suspense fallback={null}>
            <group position={[0, logoYOffset, 0]}>
              <Center precise>
                <Logo3D
                  scale={scale}
                  scrollProgressRef={scrollProgressRef}
                  mouseRef={mouseRef}
                  mode="hero"
                  isMobile={isMobile}
                  sharedTexture={sharedTexture}
                  introOffsetRef={introOffsetRef}
                  onReady={handleLogoReady}
                />
              </Center>
            </group>
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
