import { useStore } from "@nanostores/react";
import { crtUserPreference } from "../stores/crtStore";

export default function CRTToggle() {
  const enabled = useStore(crtUserPreference);

  return (
    <label className="crt-toggle">
      <span>CRT Effect</span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => crtUserPreference.set(e.target.checked)}
      />
      <span className="toggle-switch" />
    </label>
  );
}
