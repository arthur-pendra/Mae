'use client';

import { useInViewVideo } from '@/hooks/useInViewVideo';
import styles from './ShowreelSection.module.css';
import cdn from '@/lib/cdn';

export default function ShowreelSection() {
  const videoRef = useInViewVideo();

  return (
    <section className={styles.section}>
      <div className={styles.contentWrap}>
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.video}
            src={`${cdn}/hero.mp4`}
            preload="none"
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </section>
  );
}
