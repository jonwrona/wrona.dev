import { atom, computed, onMount } from 'nanostores';

// User's manual preference (persisted to localStorage)
const getInitialUserPreference = (): boolean => {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem('crt-enabled');
  return saved === null ? true : saved === 'true';
};

export const crtUserPreference = atom<boolean>(getInitialUserPreference());

// Zoom detection state (computed, not persisted)
export const isZoomed = atom<boolean>(false);

// Actual CRT enabled state (computed from both)
export const crtEnabled = computed(
  [crtUserPreference, isZoomed],
  (preference, zoomed) => preference && !zoomed
);

// Persist only user preference
if (typeof window !== 'undefined') {
  crtUserPreference.subscribe((value) => {
    localStorage.setItem('crt-enabled', value.toString());
  });
}

// Set up zoom detection with lifecycle management
onMount(isZoomed, () => {
  if (typeof window === 'undefined') return;

  const checkZoom = (): void => {
    let scale = 1;

    // Primary: visualViewport API (best for all zoom types)
    if (window.visualViewport) {
      scale = window.visualViewport.scale;
    } else {
      // Fallback: devicePixelRatio comparison
      const initialDPR = window.devicePixelRatio || 1;
      const storedInitialDPR = parseFloat(
        sessionStorage.getItem('initial-dpr') || initialDPR.toString()
      );
      if (!sessionStorage.getItem('initial-dpr')) {
        sessionStorage.setItem('initial-dpr', initialDPR.toString());
      }
      scale = initialDPR / storedInitialDPR;
    }

    // ANY zoom above 100% triggers disable
    isZoomed.set(scale > 1.0);
  };

  // Check on initial mount
  checkZoom();

  // Listen for zoom changes
  const handleViewportChange = () => checkZoom();
  const handleResize = () => checkZoom();

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportChange);
    window.visualViewport.addEventListener('scroll', handleViewportChange);
  }

  window.addEventListener('resize', handleResize);

  // Cleanup
  return () => {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', handleViewportChange);
      window.visualViewport.removeEventListener('scroll', handleViewportChange);
    }
    window.removeEventListener('resize', handleResize);
  };
});
