
import { useEffect } from "react";

export default function BackgroundFX() {
  return (
    <div className="bgRoot" aria-hidden>
      <div className="bgAurora" />
      <div className="bgGrid" />
      <div className="bgVignette" />
      <div className="bgNoise" />
    </div>
  );
}


