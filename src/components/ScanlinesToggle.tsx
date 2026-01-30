import { useStore } from "@nanostores/react";
import { scanlinesUserPreference } from "../stores/crtStore";

export default function ScanlinesToggle() {
  const enabled = useStore(scanlinesUserPreference);

  return (
    <label className="crt-toggle">
      <span>Scanlines</span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => scanlinesUserPreference.set(e.target.checked)}
      />
      <span className="toggle-switch" />
    </label>
  );
}
