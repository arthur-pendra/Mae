'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Simulates "stick to the bottom of the viewport, clamped inside the container"
 * for an absolutely positioned banner.
 *
 * Below 768px every section pins the banner with `!important` in CSS, so the
 * scroll handler is skipped there entirely.
 *
 * Element heights are cached and only refreshed on resize — reading
 * offsetHeight inside a scroll handler forces a layout on every frame.
 */
export function useStickyBanner(
  sectionRef: RefObject<HTMLElement | null>,
  bannerRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const section = sectionRef.current;
    const banner = bannerRef.current;
    if (!section || !banner) return;

    const mobile = window.matchMedia(MOBILE_QUERY);
    let teardown: (() => void) | null = null;

    const setup = () => {
      if (mobile.matches) return;

      const container = (banner.offsetParent as HTMLElement | null) ?? section;

      // CSS-defined top value, read once as the minimum offset (0.5em in the
      // correct font-size context).
      const initialTop = parseFloat(getComputedStyle(banner).top) || 0;

      let bannerHeight = banner.offsetHeight;
      let viewportHeight = window.innerHeight;
      let lastTop: number | null = null;

      const measure = () => {
        bannerHeight = banner.offsetHeight;
        viewportHeight = window.innerHeight;
      };

      banner.style.bottom = 'auto';

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom bottom',
        onUpdate: () => {
          const containerRect = container.getBoundingClientRect();
          const desiredTop = viewportHeight - bannerHeight - containerRect.top;
          const maxTop = containerRect.height - bannerHeight - initialTop;
          const top = Math.max(initialTop, Math.min(desiredTop, maxTop));

          if (top !== lastTop) {
            lastTop = top;
            banner.style.top = `${top}px`;
          }
        },
      });

      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(banner);
      window.addEventListener('resize', measure);

      teardown = () => {
        trigger.kill();
        resizeObserver.disconnect();
        window.removeEventListener('resize', measure);
        banner.style.top = '';
        banner.style.bottom = '';
      };
    };

    // Crossing the mobile breakpoint swaps who owns the banner position.
    const handleBreakpoint = () => {
      teardown?.();
      teardown = null;
      setup();
    };

    setup();
    mobile.addEventListener('change', handleBreakpoint);

    return () => {
      mobile.removeEventListener('change', handleBreakpoint);
      teardown?.();
    };
  }, [sectionRef, bannerRef]);
}
