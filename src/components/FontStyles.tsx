import basePath from '@/lib/basePath';

export default function FontStyles() {
  const p = basePath;
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @font-face {
        font-family: 'Helvetica Neue';
        src: url('${p}/fonts/HelveticaNeueLight.woff2') format('woff2');
        font-weight: 300;
        font-style: normal;
        font-display: swap;
        ascent-override: 95%;
        descent-override: 25%;
        line-gap-override: 0%;
      }
      @font-face {
        font-family: 'Helvetica Neue';
        src: url('${p}/fonts/HelveticaNeueRoman.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
        ascent-override: 95%;
        descent-override: 25%;
        line-gap-override: 0%;
      }
      @font-face {
        font-family: 'Helvetica Neue';
        src: url('${p}/fonts/HelveticaNeueMedium.woff2') format('woff2');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
        ascent-override: 95%;
        descent-override: 25%;
        line-gap-override: 0%;
      }
      @font-face {
        font-family: 'Helvetica Neue';
        src: url('${p}/fonts/HelveticaNeueBold.woff2') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
        ascent-override: 95%;
        descent-override: 25%;
        line-gap-override: 0%;
      }
      @font-face {
        font-family: 'Plaid Mono';
        src: url('${p}/fonts/PlaidMono.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Chaney';
        src: url('${p}/fonts/CHANEY-Regular.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Chaney';
        src: url('${p}/fonts/CHANEY-Wide.otf') format('opentype');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Chaney';
        src: url('${p}/fonts/CHANEY-Extended.otf') format('opentype');
        font-weight: 600;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Chaney';
        src: url('${p}/fonts/CHANEY-UltraExtended.otf') format('opentype');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Chaney Regular';
        src: url('${p}/fonts/CHANEY-Regular.otf') format('opentype');
        font-display: swap;
      }
      @font-face {
        font-family: 'Chaney Wide';
        src: url('${p}/fonts/CHANEY-Wide.otf') format('opentype');
        font-display: swap;
      }
      @font-face {
        font-family: 'Chaney Extended';
        src: url('${p}/fonts/CHANEY-Extended.otf') format('opentype');
        font-display: swap;
      }
      @font-face {
        font-family: 'Chaney UltraExtended';
        src: url('${p}/fonts/CHANEY-UltraExtended.otf') format('opentype');
        font-display: swap;
      }
    `}} />
  );
}
