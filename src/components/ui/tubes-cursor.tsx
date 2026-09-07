"use client";

import { useEffect, useRef } from "react";
import styles from "./tubes-cursor.module.css";

type TubesCursorInstance = {
  dispose: () => void;
  tubes?: {
    setColors: (colors: string[]) => void;
    setLightsColors: (colors: string[]) => void;
  };
};

const precisePointerQuery = "(hover: hover) and (pointer: fine)";
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

const orangePalettes = [
  {
    tubes: ["#ff9a1f", "#ff6b00", "#e94f00"],
    lights: ["#ffd08a", "#ffad42", "#ff7a00", "#f15300"],
  },
  {
    tubes: ["#ffc15a", "#ff7a00", "#df4100"],
    lights: ["#ffe0aa", "#ffb347", "#ff6b00", "#c93400"],
  },
  {
    tubes: ["#ffb347", "#ff6200", "#cc3500"],
    lights: ["#ffd7a0", "#ff941f", "#f15300", "#ff6b00"],
  },
] as const;

export default function TubesCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<TubesCursorInstance | null>(null);

  useEffect(() => {
    const hasPrecisePointer = window.matchMedia(precisePointerQuery).matches;
    const prefersReducedMotion = window.matchMedia(reducedMotionQuery).matches;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowPowerDevice =
      (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency < 4) ||
      (typeof deviceMemory === "number" && deviceMemory < 4);

    if (!hasPrecisePointer || prefersReducedMotion || lowPowerDevice) return;

    let cancelled = false;
    let paletteIndex = 0;

    const cycleOrangePalette = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !appRef.current?.tubes) return;

      paletteIndex = (paletteIndex + 1) % orangePalettes.length;
      const palette = orangePalettes[paletteIndex];
      appRef.current.tubes.setColors([...palette.tubes]);
      appRef.current.tubes.setLightsColors([...palette.lights]);
    };

    const initTimer = window.setTimeout(async () => {
      try {
        const { default: createTubesCursor } = await import(
          "threejs-components/build/cursors/tubes1.min.js"
        );

        if (cancelled || !canvasRef.current) return;

        const palette = orangePalettes[0];
        appRef.current = createTubesCursor(canvasRef.current, {
          bloom: {
            threshold: 0.18,
            strength: 0.72,
            radius: 0.28,
          },
          tubes: {
            count: 3,
            minRadius: 0.003,
            maxRadius: 0.015,
            colors: [...palette.tubes],
            lights: {
              intensity: 92,
              colors: [...palette.lights],
            },
          },
        });

        window.addEventListener("pointerdown", cycleOrangePalette, { passive: true });
      } catch (error) {
        console.error("Não foi possível iniciar o efeito do cursor:", error);
      }
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(initTimer);
      window.removeEventListener("pointerdown", cycleOrangePalette);
      appRef.current?.dispose();
      appRef.current = null;
    };
  }, []);

  return (
    <div className={styles.layer} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        data-testid="tubes-cursor"
      />
    </div>
  );
}
