'use client';

import { useRef } from 'react';
import { useStackedRows } from '@/hooks/useStackedRows';
import styles from './MaeSection.module.css';
import cdn from '@/lib/cdn';

const maeData = [
  {
    number: '01',
    title: 'MOVE',
    description: 'Verandering begint met beweging. Niet alleen fysiek, maar ook mentaal. De eerste stap is vaak het lastigst, en de weg ernaartoe gaat niet altijd in een rechte lijn. Dat hoort erbij. Wij zijn er om je te begeleiden, te motiveren wanneer het tegenzit, en je te helpen volhouden.',
    image: `${cdn}/maarten-training.webp`,
    keywords: ['Mobiliteit', 'Beweging', 'Motivatie', 'Begeleiding']
  },
  {
    number: '02',
    title: 'ADAPT',
    description: 'Iedereen is anders. Daarom krijg je een plan dat volledig is afgestemd op jouw situatie, doelen en niveau. En omdat jij verandert, verandert je plan mee. We evalueren regelmatig en sturen bij waar nodig, zodat je altijd blijft groeien.',
    image: `${cdn}/maarten-behandelplan.webp`,
    keywords: ['Persoonlijk', 'Maatwerk', 'Progressie', 'Evaluatie']
  },
  {
    number: '03',
    title: 'EVOLVE',
    description: 'Dit gaat verder dan alleen trainen. Het gaat om bouwen aan een sterkere, gezondere versie van jezelf. Niet voor even, maar voor de lange termijn. Meer energie, meer zelfvertrouwen, en een lichaam waar je je goed in voelt.',
    image: `${cdn}/maarten-groepssessie.webp`,
    keywords: ['Transformatie', 'Energie', 'Zelfvertrouwen', 'Lange termijn']
  }
];

export default function MaeSection() {
  const rowsWrapperRef = useRef<HTMLDivElement>(null);
  const { overlayRef, rowsRef, shadowsRef } = useStackedRows(rowsWrapperRef);

  return (
    <section id="mae-section" className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <span className="label label-dark">
          [ VISIE EN MISSIE ]
        </span>
      </div>

      {/* Main Title */}
      <h1 className={styles.title}>
        <span className={styles.titleLine}>THE PL<span style={{ fontFeatureSettings: '"ss02" 1' }}>A</span>CE</span>
        <span className={styles.titleLine}>WHERE YOU MOVE</span>
        <span className={styles.titleLine}>ADAPT EVOLVE</span>
      </h1>

      {/* Content rows */}
      <div className={styles.content}>
        <div ref={rowsWrapperRef} className={styles.rowsWrapper}>
          {/* White overlay that hides all rows initially (desktop animation) */}
          <div ref={overlayRef} className={styles.overlay}>
            <div className={styles.divider} />
          </div>
          {/* Mobile-only divider above first row (overlay is hidden on mobile) */}
          <div className={styles.mobileDivider} />
          {maeData.map((item, index) => (
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
                <span className={styles.number}>{item.number}</span>
                <div className={styles.textContent}>
                  <h2 className={styles.rowTitle}>{item.title}</h2>
                  <p className={`${styles.description} par`}>{item.description}</p>
                  <div className={styles.keywords}>
                    {item.keywords.map((keyword, i) => (
                      <span key={i} className={styles.keywordTag}>{keyword}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.imageWrapper}>
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="img-cover img-grayscale"
                  />
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
