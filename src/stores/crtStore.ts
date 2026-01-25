import { atom } from 'nanostores';

// Initialize from localStorage if available, otherwise default to true
const getInitialState = (): boolean => {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem('crt-enabled');
  return saved === null ? true : saved === 'true';
};

export const crtEnabled = atom<boolean>(getInitialState());

// Subscribe to changes and persist to localStorage
if (typeof window !== 'undefined') {
  crtEnabled.subscribe((value) => {
    localStorage.setItem('crt-enabled', value.toString());
  });
}
