'use client';

import { useEffect, useRef, useState } from 'react';
import { usePanel, type PanelType } from '@/context/PanelContext';
import { useOverlayThemeColor } from '@/hooks/useOverlayThemeColor';
import SlidePanel from './SlidePanel';
import MeetPanel from './panels/MeetPanel';
import StartNuPanel from './panels/StartNuPanel';
import styles from './GlobalPanel.module.css';

export default function GlobalPanel() {
  const { activePanel, panelVariant, openPanel, closePanel, onBack, panelStep } = usePanel();
  const navBarRef = useRef<HTMLDivElement>(null);

  useOverlayThemeColor(activePanel !== null);
  const [panelPhase, setPanelPhase] = useState(1);

  // Remember the last opened panel so its content stays mounted during the
  // exit animation. Adjusting state during render is cheaper than an effect:
  // React re-runs this component before committing, without an extra paint.
  const [lastPanel, setLastPanel] = useState<PanelType>(null);
  const [trackedPanel, setTrackedPanel] = useState<PanelType>(null);
  if (activePanel !== trackedPanel) {
    setTrackedPanel(activePanel);
    setPanelPhase(1);
    if (activePanel !== null) setLastPanel(activePanel);
  }

  // Observe data-panel-phase attribute changes from SlidePanel
  useEffect(() => {
    // Find the panel element (parent of navBar)
    const panelEl = navBarRef.current?.closest('[data-panel-phase]') as HTMLElement | null;
    if (!panelEl) return;

    const observer = new MutationObserver(() => {
      const phase = parseInt(panelEl.getAttribute('data-panel-phase') || '1', 10);
      setPanelPhase(phase);
    });
    observer.observe(panelEl, { attributes: true, attributeFilter: ['data-panel-phase'] });
    return () => observer.disconnect();
  }, [activePanel]);

  // Use activePanel if open, otherwise use last panel for exit animation
  const panelToRender = activePanel ?? lastPanel;

  const renderPanelContent = () => {
    switch (panelToRender) {
      case 'meet-maarten':
        return <MeetPanel key="maarten" person="maarten" />;
      case 'meet-merel':
        return <MeetPanel key="merel" person="merel" />;
      case 'start-nu':
        return <StartNuPanel />;
      default:
        return null;
    }
  };

  const isMeetPanel = panelToRender === 'meet-maarten' || panelToRender === 'meet-merel';
  const isStartNu = panelToRender === 'start-nu';
  const showStartTraject = isMeetPanel && panelPhase === 2;
  const isMerel = panelToRender === 'meet-merel' || (isStartNu && (panelVariant === 'leefstijl' || lastPanel === 'meet-merel'));
  const meetName = isMerel ? 'Meet Merel' : 'Meet Maarten';
  const meetPanel = isMerel ? 'meet-merel' : 'meet-maarten';
  const startVariant = isMerel ? 'leefstijl' : 'fysio';

  const navBar = (
    <div ref={navBarRef} className={styles.navBar}>
      <button
        className={`${styles.navTab} ${isMeetPanel ? styles.navTabActive : ''} ${isMeetPanel ? styles.navTabMaarten : ''}`}
        onClick={() => openPanel(meetPanel as 'meet-maarten' | 'meet-merel')}
      >
        <span>{meetName}</span>
        <span className={styles.navTabNumber}>[{isMeetPanel ? panelStep : '00'}]</span>
      </button>
      {onBack && (
        <button className={`${styles.backButton} ${isStartNu ? styles.backButtonActive : ''}`} onClick={onBack}>
          <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeMiterlimit="10" style={{ transform: 'scaleX(-1)' }}>
            <path d="M14 19L21 12L14 5" />
            <path d="M21 12H2" />
          </svg>
        </button>
      )}
      <button
        className={`${styles.navTab} ${isStartNu ? styles.navTabActive : ''} ${isMeetPanel ? styles.navTabStartNu : ''}`}
        onClick={() => openPanel('start-nu', startVariant as 'fysio' | 'leefstijl')}
      >
        <span>{showStartTraject ? 'Start Traject' : 'Start Nu'}</span>
        <span className={styles.navTabNumber}>[{isStartNu ? panelStep : '00'}]</span>
      </button>
    </div>
  );

  return (
    <SlidePanel isOpen={activePanel !== null} onClose={closePanel} header={navBar} dark>
      {renderPanelContent()}
    </SlidePanel>
  );
}
