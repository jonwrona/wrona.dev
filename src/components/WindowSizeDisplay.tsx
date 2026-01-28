import { useStore } from "@nanostores/react";
import { windowSize } from "../stores/windowSizeStore";

export default function WindowSizeDisplay() {
  const size = useStore(windowSize);

  return (
    <div className="window-size-display">
      <span className="label">Window Size:</span>
      <span className="dimensions">
        {size ? (
          <>
            <span>{size.width}px</span> × <span>{size.height}px</span>
          </>
        ) : (
          <>
            <span>-</span> × <span>-</span>
          </>
        )}
      </span>
    </div>
  );
}
