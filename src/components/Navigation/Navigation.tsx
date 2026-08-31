'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/components/SmoothScroll';
import styles from './Navigation.module.css';

type DotLottieElement = HTMLElement & {
  dotLottie?: { setMode: (mode: 'forward' | 'reverse') => void; play: () => void };
};

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Home', target: 'top', tagLeft: 'info@moveadaptevolve.nl', tagRight: 'Instagram', linkLeft: 'mailto:info@moveadaptevolve.nl', linkRight: 'https://www.instagram.com/m.a.e.coaching.fysiotherapie/' },
  { label: 'Fysio', target: 'herstel-section', tagLeft: 'Meet Maarten', tagRight: 'Meer info', linkLeft: 'herstel-section', linkRight: 'herstel-section' },
  { label: 'Leefstijl', target: 'leefstijl-section', tagLeft: 'Meet Merel', tagRight: 'Meer info', linkLeft: 'leefstijl-section', linkRight: 'leefstijl-section' },
  { label: 'FAQ', target: 'faq-section', tagLeft: 'Veelgestelde vragen', tagRight: 'Meer info', linkLeft: 'faq-section', linkRight: 'faq-section' },
  { label: 'Contact', target: 'cta-section', accent: true, tagLeft: 'info@moveadaptevolve.nl', tagRight: 'Neem contact op', linkLeft: 'mailto:info@moveadaptevolve.nl', linkRight: 'cta-section' },
];

// Browser chrome colour on iOS. The green accent panel collapses toward the
// top edge on close, which is exactly where Safari samples, so the value is
// only restored once that animation has finished.
const THEME_COLOR_DEFAULT = '#ffffff';
const THEME_COLOR_MENU_OPEN = '#272727';
// .tile runs 1s, .tileAccent trails it by 0.12s.
const MENU_CLOSE_MS = 1120;

const sectionColors: { id: string; bg: string }[] = [
  { id: 'mae-section', bg: '#d7d7d7' },
  { id: 'herstel-section', bg: '#3a3a3a' },
  { id: 'herstel-image', bg: '#d7d7d7' },
  { id: 'leefstijl-content', bg: '#3a3a3a' },
  { id: 'leefstijl-image', bg: '#d7d7d7' },
  { id: 'faq-section', bg: '#d7d7d7' },
  { id: 'cta-section', bg: '#d7d7d7' },
  { id: 'footer-section', bg: '#3a3a3a' },
];

export default function Navigation() {
  const [active, setActive] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const pathname = usePathname();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const lottieRef = useRef<DotLottieElement>(null);
  const tagLeftRef = useRef<HTMLButtonElement>(null);
  const tagRightRef = useRef<HTMLButtonElement>(null);
  const menuItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const hoveredIndexRef = useRef(0);
  const lenis = useLenis();

  // Only the hero delays the navigation. Pages without one (privacy,
  // stylesheet) never fire the event, so they must not wait for it.
  const visible = introReady || pathname !== '/';

  // Keep the iOS browser bar in step with the menu
  const hasOpenedRef = useRef(false);
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;

    if (active) {
      hasOpenedRef.current = true;
      meta.setAttribute('content', THEME_COLOR_MENU_OPEN);
      return;
    }

    if (!hasOpenedRef.current) {
      meta.setAttribute('content', THEME_COLOR_DEFAULT);
      return;
    }

    const timer = setTimeout(
      () => meta.setAttribute('content', THEME_COLOR_DEFAULT),
      MENU_CLOSE_MS
    );
    return () => clearTimeout(timer);
  }, [active]);

  // Listen for hero intro complete event
  useEffect(() => {
    const handleIntroComplete = () => setIntroReady(true);
    window.addEventListener('heroIntroComplete', handleIntroComplete);
    return () => window.removeEventListener('heroIntroComplete', handleIntroComplete);
  }, []);

  const open = useCallback(() => {
    setActive(true);
    lenis?.stop();
    setTimeout(() => {
      const el = lottieRef.current;
      if (el?.dotLottie) {
        el.dotLottie.setMode('forward');
        el.dotLottie.play();
      }
    }, 500);
  }, [lenis]);

  const close = useCallback(() => {
    setActive(false);
    lenis?.start();
    const el = lottieRef.current;
    if (el?.dotLottie) {
      el.dotLottie.setMode('reverse');
      el.dotLottie.play();
    }
  }, [lenis]);

  const toggle = useCallback(() => {
    if (active) close();
    else open();
  }, [active, open, close]);

  const scrollTo = useCallback((target: string) => {
    close();
    requestAnimationFrame(() => {
      if (target === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }, [close]);

  // ESC key closes navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && active) close();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [active, close]);

  // Click outside tile closes navigation
  useEffect(() => {
    if (!active) return;
    const handleClick = (e: MouseEvent) => {
      const tile = document.querySelector(`.${styles.tile}`);
      const hamburger = document.querySelector(`.${styles.hamburger}`);
      if (tile && !tile.contains(e.target as Node) && hamburger && !hamburger.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [active, close]);

  // Scroll closes navigation
  useEffect(() => {
    if (!active) return;
    const handleScroll = () => close();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active, close]);

  const handleTagClick = useCallback((side: 'left' | 'right') => {
    const item = navItems[hoveredIndexRef.current];
    const link = side === 'left' ? item.linkLeft : item.linkRight;
    if (link.startsWith('mailto:') || link.startsWith('http')) {
      window.open(link, link.startsWith('http') ? '_blank' : '_self');
    } else {
      scrollTo(link);
    }
  }, [scrollTo]);

  // Tags follow hovered menu item (desktop only)
  const handleMenuEnter = useCallback((index: number) => {
    hoveredIndexRef.current = index;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (isMobile) return;

    if (tagLeftRef.current) tagLeftRef.current.textContent = `[${navItems[index].tagLeft}]`;
    if (tagRightRef.current) tagRightRef.current.textContent = `[${navItems[index].tagRight}]`;

    const item = menuItemRefs.current[index];
    const tile = item?.closest(`.${styles.tile}`) as HTMLElement;
    if (!item || !tile) return;

    const tileRect = tile.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const itemCenterY = itemRect.top + itemRect.height / 2 - tileRect.top;

    const targets = [tagLeftRef.current, tagRightRef.current].filter(Boolean);
    gsap.to(targets, {
      top: itemCenterY,
      yPercent: -50,
      duration: 0.4,
      ease: 'power3.out',
    });
  }, []);

  const handleMenuLeave = useCallback(() => {
    // Tags blijven op de laatst gehoverде positie met de laatst getoonde tekst
  }, []);

  // Hamburger + page logo color adapts to current section
  useEffect(() => {
    const btn = hamburgerRef.current;
    if (!btn) return;

    const heroColor = '#3a3a3a';
    btn.style.backgroundColor = heroColor;

    const triggers = sectionColors.map(({ id, bg }, index) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const prevColor = index === 0
        ? heroColor
        : sectionColors[index - 1].bg;

      return ScrollTrigger.create({
        trigger: el,
        start: 'top top+=80',
        end: 'bottom top+=80',
        onEnter: () => { btn.style.backgroundColor = bg; },
        onEnterBack: () => { btn.style.backgroundColor = bg; },
        onLeave: () => {},
        onLeaveBack: () => { btn.style.backgroundColor = prevColor; },
      });
    });

    return () => {
      triggers.forEach(t => t?.kill());
    };
  }, []);

  return (
    <nav
      className={styles.nav}
      data-navigation-status={active ? 'active' : 'not-active'}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.8s ease',
      }}
    >
      {/* Hamburger */}
      <button
        ref={hamburgerRef}
        className={styles.hamburger}
        onClick={toggle}
        aria-label={active ? 'Close menu' : 'Open menu'}
      >
        <span className={styles.hamburgerBar} />
        <span className={styles.hamburgerBar} />
      </button>

      {/* Green accent flash behind tile */}
      <div className={styles.tileAccent} />
      {/* Fullscreen overlay */}
      <div className={styles.tile}>
        {/* Logo top-left */}
        <button className={styles.logo} onClick={() => scrollTo('top')} aria-label="Home">
          <dotlottie-wc
            ref={lottieRef}
            src="https://lottie.host/f0906274-5272-4bff-a63b-12216f8152d3/7pJjJ1FQcj.lottie"
          />
        </button>

        <ul className={styles.menuList} onMouseLeave={handleMenuLeave}>
          {navItems.map((item, index) => (
            <li
              key={item.target}
              className={styles.menuItem}
              ref={(el) => { menuItemRefs.current[index] = el; }}
              onMouseEnter={() => handleMenuEnter(index)}
            >
              <button
                className={`${styles.menuLink} ${item.accent ? styles.menuLinkAccent : ''}`}
                onClick={() => scrollTo(item.target)}
              >
                {item.label.split('').map((char, i) =>
                  char.toLowerCase() === 'a' || char.toLowerCase() === 'v'
                    ? <span key={i} className={styles.menuLinkAlt}>{char}</span>
                    : char
                )}
              </button>
            </li>
          ))}
        </ul>

        <button ref={tagLeftRef} className={`${styles.menuTag} ${styles.menuTagLeft}`} onClick={() => handleTagClick('left')}>[info@moveadaptevolve.nl]</button>
        <button ref={tagRightRef} className={`${styles.menuTag} ${styles.menuTagRight}`} onClick={() => handleTagClick('right')}>[Instagram]</button>
      </div>
    </nav>
  );
}
