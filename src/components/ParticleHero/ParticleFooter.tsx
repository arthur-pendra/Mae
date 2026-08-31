'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function ParticleFooter() {
  const screenSize = useScreenSize();
  const scrollProgressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const footerTagsRef = useRef<HTMLDivElement>(null);
  const { video: sharedVideo, texture: sharedTexture } = useSharedVideo();
  const { openPanel, activePanel } = usePanel();
  const [visible, setVisible] = useState(false);

  // An open panel covers the whole viewport, so nothing behind it needs drawing.
  const active = visible && activePanel === null;

  const mouseRef = usePointerTilt(screenSize, active);
  useSharedVideoPlayback(active);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '50%',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll-based: logo comes from above into center
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
        if (footerTagsRef.current) {
          footerTagsRef.current.style.opacity = String(Math.max(0, (self.progress - 0.7) / 0.3));
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const isMobile = screenSize === 'mobile';
  const { scale, zoom } = getScaleAndZoom(screenSize);
  const logoYOffset = isMobile ? 0.3 : 0;

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Footer Tags - fade in when logo reaches center */}
      <div ref={footerTagsRef} className={styles.footerTags} style={{ opacity: 0 }}>
        <button
          className={styles.footerTag}
          onClick={() => document.getElementById('herstel-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          [START FYSIOTHERAPIE]
        </button>
        <button
          className={styles.footerTag}
          onClick={() => document.getElementById('leefstijl-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          [START LEEFSTIJL COACHING]
        </button>
      </div>

      {isMobile ? (
        <>
          {/* Mobile: socials + legal above CTA buttons */}
          <div className={styles.footerMobileBottom}>
            <Link href="/privacy" className={styles.footerMobileLegalLink}>Privacy</Link>
            <div className={styles.footerMobileSocials}>
              <a
                href="https://www.instagram.com/m.a.e.coaching.fysiotherapie/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bottomBarSocialLink}
                aria-label="MAE op Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
            <a href="https://pendra.studio/" target="_blank" rel="noopener noreferrer" className={styles.footerMobileLegalLink}>
              by Pendra.studio
            </a>
          </div>

          {/* Mobile CTA buttons */}
          <div className={styles.mobileCta}>
            <button className={styles.mobileCtaGreen} onClick={() => openPanel('start-nu', 'fysio')}>
              Fysiotherapie
            </button>
            <button className={styles.mobileCtaGray} onClick={() => openPanel('start-nu', 'leefstijl')}>
              Leefstijlcoaching
            </button>
          </div>
        </>
      ) : (
        /* Bottom bar - desktop only */
        <div className={styles.bottomBar}>
          <span className={styles.bottomBarText}>
            &copy; 2026 M.A.E. All rights reserved.
            <Link href="/privacy" className={styles.bottomBarLegal}>Privacy</Link>
          </span>
          <div className={styles.bottomBarSocials}>
            <a
              href="https://www.instagram.com/m.a.e.coaching.fysiotherapie/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bottomBarSocialLink}
              aria-label="MAE op Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
          <a href="https://pendra.studio/" target="_blank" rel="noopener noreferrer" className={styles.bottomBarLink}>
            Design &amp; Dev by Pendra.studio
          </a>
        </div>
      )}

      {/* Only render Canvas once screenSize is known */}
      {screenSize !== null && (
        <Canvas
          orthographic
          camera={{ position: [0, 0, 100], zoom, near: 0.1, far: 200 }}
          frameloop="demand"
          gl={glOptions}
          dpr={canvasDpr}
        >
          <Invalidator active={active} />
          <VideoPlane texture={sharedTexture} video={sharedVideo} brightness={0.18} />
          <Suspense fallback={null}>
            <group position={[0, logoYOffset, 0]}>
              <Center precise>
                <Logo3D
                  scale={scale}
                  scrollProgressRef={scrollProgressRef}
                  mouseRef={mouseRef}
                  mode="footer"
                  isMobile={isMobile}
                  sharedTexture={sharedTexture}
                />
              </Center>
            </group>
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
