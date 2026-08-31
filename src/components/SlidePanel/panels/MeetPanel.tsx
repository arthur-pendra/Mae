'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { usePanel } from '@/context/PanelContext';
import { meetPanelData, type MeetPerson } from './meetPanelData';
import styles from './MeetMaartenPanel.module.css';

const ArrowIcon = ({ flipped }: { flipped?: boolean }) => (
  <svg
    width="60%"
    height="60%"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeMiterlimit="10"
    style={flipped ? { transform: 'scaleX(-1)' } : undefined}
  >
    <path d="M14 19L21 12L14 5" />
    <path d="M21 12H2" />
  </svg>
);

export default function MeetPanel({ person }: { person: MeetPerson }) {
  const data = meetPanelData[person];
  const [activeCredential, setActiveCredential] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const prevArrowRef = useRef<HTMLButtonElement>(null);
  const nextArrowRef = useRef<HTMLButtonElement>(null);
  const { openPanel, setPanelStep } = usePanel();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!titleRef.current) return;
    const tween = gsap.fromTo(
      titleRef.current,
      { y: '100%' },
      { y: '0%', duration: 0.4, ease: 'power2.out' }
    );
    return () => {
      tween.kill();
    };
  }, [activeCredential]);

  const animateAndChange = (newIndex: number) => {
    if (!titleRef.current) return;
    gsap.to(titleRef.current, {
      y: '-100%',
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => setActiveCredential(newIndex),
    });
  };

  const step = (delta: number) => {
    const count = data.credentials.length;
    animateAndChange((activeCredential + delta + count) % count);
  };

  // Track which section is visible and update the navBar step number
  useEffect(() => {
    const sections = sectionsRef.current.filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setPanelStep(String(idx + 1).padStart(2, '0'));
          }
        }
      },
      { threshold: 0.5, root: sections[0]?.closest('[data-lenis-prevent]') }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [setPanelStep]);

  const handleArrowHover = (button: HTMLButtonElement | null, direction: 'left' | 'right') => {
    const svgEl = button?.querySelector('svg');
    if (!svgEl) return;
    const moveOut = direction === 'right' ? '120%' : '-120%';
    const moveIn = direction === 'right' ? '-120%' : '120%';
    gsap
      .timeline()
      .to(svgEl, { x: moveOut, duration: 0.2, ease: 'power2.in' })
      .set(svgEl, { x: moveIn })
      .to(svgEl, { x: '0%', duration: 0.2, ease: 'power2.out' });
  };

  return (
    <div className={styles.panel}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h2 className={styles.name}>{data.name}</h2>
      </div>

      {/* Hero Image */}
      <div className={styles.heroImage}>
        <img
          src={data.hero.src}
          alt={data.hero.alt}
          className="img-cover"
          style={{ objectPosition: data.hero.objectPosition }}
        />
      </div>

      {/* Over ... */}
      <section ref={(el) => { sectionsRef.current[0] = el; }} className={styles.aboutSection}>
        <div className={styles.aboutHeader}>
          <span className={styles.aboutLabel}>Over {data.name}</span>
          <span className={styles.aboutNumber}>[01]</span>
        </div>
        <div className={styles.aboutText}>
          {data.about.map((paragraph, i) => (
            <p key={i} className="par">{paragraph}</p>
          ))}
        </div>
        <div className={styles.photoGrid}>
          {data.photos.map((photo) => (
            <div key={photo.src} className={styles.photo}>
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="img-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Work Method */}
      <section ref={(el) => { sectionsRef.current[1] = el; }} className={styles.section}>
        <div className={styles.aboutHeader}>
          <span className={styles.aboutLabel}>Werkwijze</span>
          <span className={styles.aboutNumber}>[02]</span>
        </div>
        <div className={styles.stepsList}>
          {data.steps.map((item, i) => (
            <div key={item.title} className={styles.step}>
              <span className={styles.stepNumber}>{i + 1}</span>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>{item.title}</h4>
                <p className="par">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Credentials Timeline */}
      <section ref={(el) => { sectionsRef.current[2] = el; }} className={styles.section}>
        <div className={styles.aboutHeader}>
          <span className={styles.aboutLabel}>Certificeringen</span>
          <span className={styles.aboutNumber}>[03]</span>
        </div>

        <div className={styles.timelineContent}>
          <div className={styles.timelineMain}>
            <div className={styles.timelineTitleWrapper}>
              <h3 ref={titleRef} className={styles.timelineTitle}>
                {data.credentials[activeCredential].text}
              </h3>
            </div>
          </div>
          <div className={styles.timelineNav}>
            <button
              ref={prevArrowRef}
              className={styles.timelineArrow}
              onClick={() => step(-1)}
              onMouseEnter={() => handleArrowHover(prevArrowRef.current, 'left')}
              aria-label="Vorige certificering"
            >
              <ArrowIcon flipped />
            </button>
            <button
              ref={nextArrowRef}
              className={styles.timelineArrow}
              onClick={() => step(1)}
              onMouseEnter={() => handleArrowHover(nextArrowRef.current, 'right')}
              aria-label="Volgende certificering"
            >
              <ArrowIcon />
            </button>
          </div>
        </div>

        <div className={styles.timeline}>
          {data.credentials.map((cred, index) => (
            <button
              key={cred.year}
              className={`${styles.timelineItem} ${index === activeCredential ? styles.timelineItemActive : ''}`}
              onClick={() => index !== activeCredential && animateAndChange(index)}
              aria-current={index === activeCredential}
            >
              <span className={styles.timelineYear}>{cred.year}</span>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <button className={styles.ctaButton} onClick={() => openPanel('start-nu', data.variant)}>
          <span>Start Traject</span>
        </button>
      </section>
    </div>
  );
}
