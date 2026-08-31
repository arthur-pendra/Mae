'use client';

import { useRef } from 'react';
import { useStickyBanner } from '@/hooks/useStickyBanner';
import { usePanel } from '@/context/PanelContext';
import styles from './HerstelSection.module.css';
import cdn from '@/lib/cdn';

export default function HerstelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const { openPanel } = usePanel();

  useStickyBanner(sectionRef, bannerRef);

  return (
    <section ref={sectionRef} id="herstel-section" className={styles.section}>
      {/* Left Content */}
      <div className={styles.content}>
        <span className="label label-light">
          [ Fysiotherapie bij MAE ]
        </span>
        <h2 className={`title-chaney ${styles.title}`}>Herstel</h2>
        <p className={`text-description ${styles.description} par`}>
          Bij MAE zien we fysiotherapie niet als een vast stramien, maar als een ingang. Een poort
          naar het échte gesprek, naar beweging, naar ervaren, en vooral: naar verandering.
          Geen standaardprotocols of voorspelbare trajecten, maar een behandeling die begint met
          écht luisteren. Wat zegt je lichaam? Waar zit de belemmering? Wat wil er eigenlijk gehoord worden?
          Want de waarheid is: Jij bent niet je klacht.
          En herstel begint niet altijd met een behandelplan, maar met vertrouwen, inzicht en een
          fysiotherapeut die naast je staat. Echt kijken naar de mens ACHTER de klacht!
        </p>
        <button className="btn-accent" onClick={() => openPanel('start-nu', 'fysio')}><span>Start nu</span></button>
      </div>

      {/* Right Image */}
      <div id="herstel-image" className={styles.imageContainer}>
        <div ref={bannerRef} className={`banner-accent ${styles.banner}`}>
          <p className="banner-text par">
            Maarten is krachtsporter en fysiotherapeut. Waar de zorg te snel grenzen stelt, zoekt hij naar wat wél kan. Met een aanpak die volledig op jou is afgestemd.
          </p>
          <button className={`btn-bar ${styles.bannerButton}`} onClick={() => openPanel('meet-maarten')}>
            Meet Maarten
          </button>
        </div>
        <img
          src={`${cdn}/maarten-sled.webp`}
          alt="Maarten"
          loading="lazy"
          decoding="async"
          className="img-cover"
        />
      </div>
    </section>
  );
}
