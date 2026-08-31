'use client';

import { useEffect } from 'react';

const DEFAULT_COLOR = '#ffffff';
const OVERLAY_COLOR = '#272727';

/**
 * The nav tile and the slide panel each run for 1s and are trailed by their
 * green accent (0.12s and 0.15s). Restoring earlier would flash the bar white
 * while the overlay is still on screen.
 */
const OVERLAY_EXIT_MS = 1150;

// There is one meta tag, so ownership is shared: the nav menu and the slide
// panel can both be open, and whichever closes last restores the colour.
let claims = 0;
let restoreTimer: ReturnType<typeof setTimeout> | null = null;

const apply = (color: string) => {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
};

/**
 * Tints the iOS browser chrome for as long as a full-screen overlay is up.
 *
 * Both overlays sweep a saturated green accent across a viewport edge, which
 * Safari otherwise picks up in its translucent top and bottom bars.
 */
export function useOverlayThemeColor(active: boolean) {
  useEffect(() => {
    if (!active) return;

    claims += 1;
    if (restoreTimer) {
      clearTimeout(restoreTimer);
      restoreTimer = null;
    }
    apply(OVERLAY_COLOR);

    return () => {
      claims -= 1;
      if (claims > 0) return;

      restoreTimer = setTimeout(() => {
        restoreTimer = null;
        if (claims === 0) apply(DEFAULT_COLOR);
      }, OVERLAY_EXIT_MS);
    };
  }, [active]);
}
