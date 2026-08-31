'use client';

import { useRef } from 'react';
import { useStickyBanner } from '@/hooks/useStickyBanner';
import { useInViewVideo } from '@/hooks/useInViewVideo';
import styles from './Hall13Section.module.css';
import cdn from '@/lib/cdn';

export default function Hall13Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const videoRef = useInViewVideo();

  useStickyBanner(sectionRef, bannerRef);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={bannerRef} className={`banner-accent ${styles.banner}`}>
        <p className="banner-text par">
          MAE maakt deel uit van Hal 13, een platform voor beweging en prestatie. Naast fysiotherapie en leefstijlcoaching biedt Hal 13 nog meer: performance coaching, sport specifieke trainingen en mentale begeleiding.
        </p>
        <a href="https://hal13.nl/" target="_blank" rel="noopener noreferrer" className={`btn-bar ${styles.bannerButton}`}>
          Ontdek Hal 13
        </a>
      </div>
      <video
        ref={videoRef}
        src={`${cdn}/degym.mp4`}
        preload="none"
        loop
        muted
        playsInline
        className="img-cover"
      />
    </section>
  );
}
