'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import styles from './ReviewsSection.module.css';

gsap.registerPlugin(ScrollTrigger, Observer);

interface ReviewsSectionProps {
  type: 'fysio' | 'leefstijl';
}

// Fysiotherapie reviews (Maarten)
const fysioReviews = [
  {
    text: 'Na jaren dagelijkse pijn kan ik weer vrij bewegen. Waar anderen zeggen "minder bewegen", helpt Maarten juist door in beweging te blijven. Mijn kwaliteit van leven is echt verbeterd.',
    author: 'Lisa Nooijen',
    tag: 'Pijnvrij bewegen',
  },
  {
    text: 'Kwam met rugklachten, til nu deadlifts boven de 100kg,zonder pijn. Iets wat ik nooit voor mogelijk had gehouden.',
    author: 'Kimberly Fellings',
    tag: 'Krachtsport',
  },
  {
    text: 'Andere fysio\'s zeiden: minder zwaar tillen. Maarten liet me juist wél zwaar tillen, op de juiste manier. Rugklachten verdwenen.',
    author: 'Jools Korver',
    tag: 'Rugklachten',
  },
  {
    text: 'Dacht dat mijn rugpijn niet meer weg zou gaan. Dankzij Maarten ben ik nu sterker dan daarvoor en kan ik pijnvrij powerliften.',
    author: 'Kim de Haar',
    tag: 'Powerlifting',
  },
  {
    text: 'Maarten ontdekte de oorzaak van mijn knieproblemen,bijzonder vanwege mijn onderbeenamputatie. Sindsdien klachtenvrij. Hij pusht op het juiste moment, maar remt ook af waar nodig.',
    author: 'Shn',
    tag: 'Revalidatie',
  },
  {
    text: 'Na een paar weken al verbetering, inmiddels klachtenvrij. De persoonlijke aandacht en deskundigheid maken echt het verschil.',
    author: 'Gijs Pinckers',
    tag: 'Herstel',
  },
];

// Leefstijl reviews (Merel)
const leefstijlReviews = [
  {
    text: 'Merel kijkt verder dan voeding en beweging,ook slaap, zelfbeeld en mentale gezondheid krijgen aandacht. Stap voor stap dichter bij mijn doelen.',
    author: 'MK',
    tag: 'Mentale gezondheid',
  },
  {
    text: 'Merel gaat verder dan alleen voeding en sport. Volledig maatwerk, professioneel en motiverend. Vanaf moment één voelde ik me gehoord.',
    author: 'Fauve Clignet',
    tag: 'Maatwerk',
  },
  {
    text: 'Merel maakte me bewust van mijn eetgedrag in combinatie met emoties. Ik maak nu bewuste keuzes, maar blijf genieten.',
    author: 'Lieke Colier',
    tag: 'Voeding',
  },
  {
    text: 'Merel luistert goed naar mijn wensen en leert me enorm veel over sporten en voeding. Resultaten komen op precies het juiste tempo.',
    author: 'Dounia Bellari',
    tag: 'Sport & voeding',
  },
  {
    text: 'Merel liet me inzien dat gezondheid veel meer is dan fitness en voeding. Begeleiding die aansluit op mij als persoon.',
    author: 'Koen van de Berg',
    tag: 'Leefstijl',
  },
  {
    text: 'Na 5 jaar zelfstandig fitnessen liep ik vast. Bij MAE werd er aandacht gegeven aan hoe ik in mijn vel zat, niet alleen aan resultaten. Aan te bevelen voor beginner én gevorderd.',
    author: 'Jodie Van Hek',
    tag: 'Zelfbeeld',
  },
];

interface ReviewCardProps {
  text: string;
  author: string;
  tag: string;
}

const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOXL0frrsiugcngnYD9TKzoJjmCFtk1r6hFr4Vw13AN8ohrXHxyZw4DjqsdgofjgipVpLVXkIR6eJ42B5N8FoL9EWB6BQmXE4rSmPiealtE06X7Ddi0zv8mvSZwnUp9pcdgBWxWM%3D&q=M.A.E.+Coaching+en+Fysiotherapie+Reviews';

function ReviewCard({ text, author, tag }: ReviewCardProps) {
  const initial = author.charAt(0).toUpperCase();

  return (
    <a
      href={GOOGLE_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.reviewCard}
    >
      <p className={`${styles.reviewText} par`}>{text}</p>
      <div className={styles.reviewAuthorRow}>
        <div className={styles.reviewInitial}>{initial}</div>
        <span className={styles.reviewAuthor}>{author}</span>
        <span className={styles.reviewTag}>{tag}</span>
      </div>
    </a>
  );
}

/* ── Mobile: draggable marquee with momentum ── */
function DraggableMarquee({ reviews, direction }: { reviews: typeof fysioReviews; direction: 'left' | 'right' }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only init on mobile
    if (window.innerWidth >= 768) return;

    const wrapper = wrapperRef.current;
    const collection = collectionRef.current;
    const list = listRef.current;
    if (!wrapper || !collection || !list) return;

    const duration = 80;
    const multiplier = 35;
    const sensitivity = 0.01;

    const wrapperWidth = wrapper.getBoundingClientRect().width;
    const listWidth = list.scrollWidth || list.getBoundingClientRect().width;
    if (!wrapperWidth || !listWidth) return;

    // Clone lists to fill viewport
    const minRequiredWidth = wrapperWidth + listWidth + 2;
    while (collection.scrollWidth < minRequiredWidth) {
      const clone = list.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      collection.appendChild(clone);
    }

    const wrapX = gsap.utils.wrap(-listWidth, 0);
    gsap.set(collection, { x: 0 });

    const marqueeLoop = gsap.to(collection, {
      x: -listWidth,
      duration,
      ease: 'none',
      repeat: -1,
      onReverseComplete() { marqueeLoop.progress(1); },
      modifiers: {
        x: (x: string) => wrapX(parseFloat(x)) + 'px',
      },
    });

    const baseDirection = direction === 'right' ? -1 : 1;
    const timeScale = { value: baseDirection };

    if (baseDirection < 0) marqueeLoop.progress(1);

    function applyTimeScale() {
      marqueeLoop.timeScale(timeScale.value);
    }
    applyTimeScale();

    const observer = Observer.create({
      target: wrapper,
      type: 'pointer,touch',
      preventDefault: true,
      debounce: false,
      onChangeX(obs) {
        let velocityTimeScale = obs.velocityX * -sensitivity;
        velocityTimeScale = gsap.utils.clamp(-multiplier, multiplier, velocityTimeScale);
        gsap.killTweensOf(timeScale);
        const restingDirection = velocityTimeScale < 0 ? -1 : 1;
        gsap.timeline({ onUpdate: applyTimeScale })
          .to(timeScale, { value: velocityTimeScale, duration: 0.1, overwrite: true })
          .to(timeScale, { value: restingDirection, duration: 1.0 });
      },
    });

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top bottom',
      end: 'bottom top',
      onEnter() { marqueeLoop.resume(); applyTimeScale(); observer.enable(); },
      onEnterBack() { marqueeLoop.resume(); applyTimeScale(); observer.enable(); },
      onLeave() { marqueeLoop.pause(); observer.disable(); },
      onLeaveBack() { marqueeLoop.pause(); observer.disable(); },
    });

    return () => {
      marqueeLoop.kill();
      observer.kill();
      st.kill();
      collection.querySelectorAll('[aria-hidden]').forEach((el) => el.remove());
    };
  }, [direction]);

  return (
    <div ref={wrapperRef} className={styles.draggableMarquee}>
      <div ref={collectionRef} className={styles.draggableCollection}>
        <div ref={listRef} className={styles.draggableList}>
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Desktop: auto-scrolling marquee with skew ── */
interface MarqueeRowProps {
  reviews: typeof fysioReviews;
  direction: 'left' | 'right';
  speed?: number;
  scrollSpeed?: number;
}

function MarqueeRow({ reviews, direction, speed = 25, scrollSpeed = 10 }: MarqueeRowProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const marqueeScroll = scrollRef.current;
    const marqueeContent = collectionRef.current;

    if (!marquee || !marqueeScroll || !marqueeContent) return;

    const marqueeDirectionAttr = direction === 'right' ? 1 : -1;
    const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
    const marqueeSpeed = speed * (marqueeContent.offsetWidth / window.innerWidth) * speedMultiplier;

    // Set scroll container styles
    marqueeScroll.style.marginLeft = `${scrollSpeed * -1}%`;
    marqueeScroll.style.width = `${(scrollSpeed * 2) + 100}%`;

    // Duplicate content
    for (let i = 0; i < 2; i++) {
      const clone = marqueeContent.cloneNode(true) as HTMLElement;
      marqueeScroll.appendChild(clone);
    }

    // Get all collections
    const marqueeItems = marquee.querySelectorAll(`.${styles.marqueeCollection}`);

    // GSAP animation
    const animation = gsap.to(marqueeItems, {
      xPercent: -100,
      repeat: -1,
      duration: marqueeSpeed,
      ease: 'linear'
    }).totalProgress(0.5);

    // Set initial position
    gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 });
    animation.timeScale(marqueeDirectionAttr);
    animation.play();

    // Set initial status
    marquee.setAttribute('data-marquee-status', 'normal');

    // ScrollTrigger for direction inversion and skew effect
    let currentSkew = 0;
    const maxSkew = 8;

    const st = ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const isInverted = self.direction === 1;
        const currentDirection = isInverted ? -marqueeDirectionAttr : marqueeDirectionAttr;
        animation.timeScale(currentDirection);
        marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted');

        // Skew effect based on scroll velocity (inverted for 'right' direction)
        const velocity = self.getVelocity();
        const skewDirection = direction === 'right' ? -1 : 1;
        const targetSkew = gsap.utils.clamp(-maxSkew, maxSkew, (velocity / 300) * skewDirection);
        currentSkew += (targetSkew - currentSkew) * 0.1;

        gsap.set(marqueeScroll, { skewX: currentSkew });
      }
    });

    // Extra scroll speed effect
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: marquee,
        start: '0% 100%',
        end: '100% 0%',
        scrub: 0
      }
    });

    const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeed : -scrollSpeed;
    const scrollEnd = -scrollStart;

    tl.fromTo(marqueeScroll, { x: `${scrollStart}vw` }, { x: `${scrollEnd}vw`, ease: 'none' });

    return () => {
      st.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [direction, speed, scrollSpeed]);

  return (
    <div
      ref={marqueeRef}
      className={styles.marquee}
      data-marquee-direction={direction}
    >
      <div ref={scrollRef} className={styles.marqueeScroll}>
        <div ref={collectionRef} className={styles.marqueeCollection}>
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection({ type }: ReviewsSectionProps) {
  const reviews = type === 'fysio' ? fysioReviews : leefstijlReviews;
  const direction = type === 'fysio' ? 'left' : 'right';
  const sectionClasses = type === 'leefstijl'
    ? `${styles.section} ${styles.sectionNoPaddingBottom}`
    : styles.section;

  return (
    <section className={sectionClasses}>
      <div className={`${styles.marqueeWrapper} ${styles.desktopOnly}`}>
        <MarqueeRow reviews={reviews} direction={direction} />
      </div>
      <div className={`${styles.marqueeWrapper} ${styles.mobileOnly}`}>
        <DraggableMarquee reviews={reviews} direction={direction} />
      </div>
    </section>
  );
}
