'use client';

import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EXTRA_OFFSET = 50;

/**
 * Deck-of-cards reveal: an overlay plus each row start stacked above the
 * viewport and slide into place as the wrapper scrolls in.
 *
 * Desktop only — on mobile everything is shown statically.
 */
export function useStackedRows(wrapperRef: RefObject<HTMLDivElement | null>) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement[]>([]);
  const shadowsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;
    const rows = rowsRef.current.filter(Boolean);
    const shadows = shadowsRef.current;

    if (!wrapper || !overlay || rows.length === 0) return;

    if (window.matchMedia('(max-width: 767px)').matches) {
      overlay.style.display = 'none';
      shadows.forEach((s) => s && (s.style.display = 'none'));
      return;
    }

    // Order from top: overlay (z-4), then each row behind it.
    const allElements = [overlay, ...rows];
    const heights = allElements.map((el) => el.offsetHeight);

    let stackedOffset = 0;
    allElements.forEach((el, index) => {
      if (index === 0) return;
      stackedOffset += heights[index - 1];
      gsap.set(el, {
        y: -(stackedOffset + EXTRA_OFFSET),
        rotation: -3 - (index - 1) * 1.5,
        transformOrigin: 'right top',
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
      },
    });

    allElements.forEach((el, index) => {
      if (index === 0) return;
      const delay = (index - 1) * 0.1;
      const duration = 1 + (index - 1) * 0.6;

      tl.to(el, { y: 0, rotation: 0, ease: 'power1.inOut', duration }, delay);

      if (shadows[index - 1]) {
        tl.to(shadows[index - 1], { opacity: 0, ease: 'power1.inOut', duration }, delay);
      }
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(allElements, { clearProps: 'transform' });
    };
  }, [wrapperRef]);

  return { overlayRef, rowsRef, shadowsRef };
}
