import { atom, onMount } from "nanostores";

type size =
  | {
      width: number;
      height: number;
    }
  | undefined;

// Initialize with current window dimensions
const getInitialState = (): size => {
  if (typeof window === "undefined") return undefined;
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const windowSize = atom<size>(getInitialState());

// Set up resize listener when store is first subscribed
onMount(windowSize, () => {
  if (typeof window === "undefined") return;

  const handleResize = () => {
    windowSize.set({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  window.addEventListener("resize", handleResize);

  // Cleanup function - removes listener when store is no longer subscribed
  return () => {
    window.removeEventListener("resize", handleResize);
  };
});
