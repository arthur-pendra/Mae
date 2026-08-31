'use client';

import Link from 'next/link';
import LazyParticleHero from '@/components/ParticleHero/LazyParticleHero';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.logoContainer}>
          <LazyParticleHero />
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.message}>Deze pagina bestaat niet.</p>
        <Link href="/" className="btn-accent">
          <span>Terug naar home</span>
        </Link>
      </div>
    </div>
  );
}
