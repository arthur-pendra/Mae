'use client';

import { useRef } from 'react';
import { useStackedRows } from '@/hooks/useStackedRows';
import styles from './FAQSection.module.css';

const faqs = [
  {
    question: 'Hoe kan ik een afspraak maken?',
    answer: 'Je kunt direct een afspraak inplannen via onze website of contact opnemen via WhatsApp. Een verwijzing is niet nodig — voor zowel fysiotherapie als leefstijlcoaching kun je zelf rechtstreeks terecht bij MAE.',
  },
  {
    question: 'Wat kan ik verwachten bij mijn eerste bezoek?',
    answer: 'We beginnen altijd met een uitgebreide intake van 60 minuten. Hierin bespreken we je klachten, doelen en situatie. Op basis daarvan stellen we samen een persoonlijk plan op dat aansluit bij wat jij nodig hebt.',
  },
  {
    question: 'Voor wie is MAE geschikt?',
    answer: 'Voor iedereen. Of je nu herstellende bent van een blessure, meer wilt bewegen, gezonder wilt leven of topsport bedrijft. Ons aanbod is volledig afgestemd op jouw niveau en doelen.',
  },
  {
    question: 'Wat kost een behandeling en wordt het vergoed?',
    answer: 'Intake (prestatiecode 1864): €55 btw-vrij. Behandeling (prestatiecode 1000): €45 btw-vrij. Wij werken zonder contracten met zorgverzekeraars zodat we volledige vrijheid hebben in onze aanpak. Je kunt facturen met deze prestatiecodes mogelijk indienen bij je zorgverzekeraar voor een (gedeeltelijke) vergoeding vanuit je aanvullende verzekering.',
  },
  {
    question: 'Kan ik fysiotherapie en leefstijlcoaching combineren?',
    answer: 'Zeker. Sterker nog, de combinatie versterkt je resultaat. We stemmen beide trajecten op elkaar af zodat je lichaam én leefstijl samen vooruitgaan.',
  },
];

export default function FAQSection() {
  const rowsWrapperRef = useRef<HTMLDivElement>(null);
  const { overlayRef, rowsRef, shadowsRef } = useStackedRows(rowsWrapperRef);

  return (
    <section id="faq-section" className={styles.section}>
      <div className={styles.header}>
        <span className="label label-dark">[ Veelgestelde vragen ]</span>
      </div>

      <h2 className={styles.title}>
        <span className={styles.titleLine}>VRAGEN?</span>
        <span className={styles.titleLine}>WIJ HEBBEN</span>
        <span className={styles.titleLine}><span style={{ fontFeatureSettings: '"ss02" 1' }}>A</span>NTWOORDEN.</span>
      </h2>

      <div className={styles.list}>
        <div ref={rowsWrapperRef} className={styles.rowsWrapper}>
          {/* White overlay that hides all rows initially (desktop animation) */}
          <div ref={overlayRef} className={styles.overlay}>
            <div className={styles.divider} />
          </div>
          {/* Mobile-only divider above first row (overlay is hidden on mobile) */}
          <div className={styles.mobileDivider} />
          {faqs.map((faq, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) rowsRef.current[index] = el;
              }}
              className={styles.row}
            >
              <div
                ref={(el) => {
                  if (el) shadowsRef.current[index] = el;
                }}
                className={styles.shadowOverlay}
              />
              <div className={styles.rowContent}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <div className={styles.textContent}>
                  <h3 className={styles.question}>{faq.question}</h3>
                  <p className={`${styles.answer} par`}>{faq.answer}</p>
                </div>
              </div>
              <div className={styles.divider} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
