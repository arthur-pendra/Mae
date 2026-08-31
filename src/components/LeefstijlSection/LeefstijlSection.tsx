'use client';

import { useRef } from 'react';
import { useStickyBanner } from '@/hooks/useStickyBanner';
import { usePanel } from '@/context/PanelContext';
import styles from './LeefstijlSection.module.css';
import cdn from '@/lib/cdn';

export default function LeefstijlSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const { openPanel } = usePanel();

  useStickyBanner(sectionRef, bannerRef);

  return (
    <section ref={sectionRef} id="leefstijl-section" className={styles.section}>
      {/* Left Image */}
      <div id="leefstijl-image" className={styles.imageContainer}>
        <div ref={bannerRef} className={`banner-accent ${styles.banner}`}>
          <p className="banner-text par">
            Merel is krachtsporter en leefstijlcoach. Ze helpt je een duurzame levensstijl te vinden die echt bij je past. Geen diëten, maar blijvende verandering.
          </p>
          <button className={`btn-bar ${styles.bannerButton}`} onClick={() => openPanel('meet-merel')}>
            Meet Merel
          </button>
        </div>
        <img
          src={`${cdn}/merel.webp`}
          alt="Merel"
          loading="lazy"
          decoding="async"
          className="img-cover"
        />
      </div>

      {/* Right Content */}
      <div id="leefstijl-content" className={styles.content}>
        <span className="label label-light">
          [ Leefstijlcoaching ]
        </span>
        <h2 className={`title-chaney ${styles.title}`}>Balans</h2>
        <p className={`text-description ${styles.description} par`}>
          Bij leefstijlcoaching nemen we jouw volledige levensstijl onder de loep.
          Geen diëten, maar duurzame verandering. Samen stellen we doelen op en
          ontvang je een persoonlijk leefstijlplan, voedingsplan en trainingsschema
          waarmee je stapsgewijs naar jouw doelen toe kunt werken.
        </p>
        <button className="btn-accent" onClick={() => openPanel('start-nu', 'leefstijl')}><span>Start nu</span></button>
      </div>
    </section>
  );
}
