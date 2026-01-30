import { useStore } from "@nanostores/react";
import { useEffect, useRef, type ReactNode } from "react";
import { crtEnabled, crtUserPreference, scanlinesEnabled } from "../stores/crtStore";

interface CRTProps {
  children: ReactNode;
  scale?: number;
  slope?: number;
  intercept?: number;
}

export default function CRT({
  children,
  scale = 100,
  slope = 0.8,
  intercept = 0.1
}: CRTProps) {
  const enabled = useStore(crtEnabled);
  const scanlines = useStore(scanlinesEnabled);
  const screenRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside CRT screen to toggle preference
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (screenRef.current && !screenRef.current.contains(e.target as Node)) {
        crtUserPreference.set(!crtUserPreference.get());
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {/* SVG Filter - conditionally rendered */}
      <svg
        id="crt-filter-svg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          display: enabled ? "block" : "none"
        }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <filter
            id="fisheye-filter"
            x="0"
            y="0"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              xlinkHref="/fisheye.png"
              result="displacementRaw"
              preserveAspectRatio="xMidYMid slice"
            />
            <feComponentTransfer in="displacementRaw" result="displacement">
              <feFuncR type="linear" slope={slope} intercept={intercept} />
              <feFuncG type="linear" slope={slope} intercept={intercept} />
            </feComponentTransfer>
            <feDisplacementMap
              in="SourceGraphic"
              in2="displacement"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* CRT Screen */}
      <div
        ref={screenRef}
        className={`crt-screen ${enabled ? "crt-filter-enabled" : ""}`}
      >
        <div className={`crt-content ${scanlines ? "crt-scanlines" : ""}`}>
          {children}
        </div>
      </div>
    </>
  );
}
