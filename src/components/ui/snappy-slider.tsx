"use client";

import { useMemo } from "react";
import styles from "./snappy-slider.module.css";

interface SnappySliderProps {
  id: string;
  label: string;
  value: number;
  values: number[];
  min: number;
  max: number;
  step: number;
  tone?: "light" | "dark";
  onChange: (value: number) => void;
}

const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SnappySlider({
  id,
  label,
  value,
  values,
  min,
  max,
  step,
  tone = "light",
  onChange,
}: SnappySliderProps) {
  const snapPoints = useMemo(
    () => [...new Set([min, ...values, max])].filter((point) => point >= min && point <= max).sort((a, b) => a - b),
    [max, min, values],
  );

  const percentage = ((value - min) / (max - min)) * 100;
  const snapThreshold = Math.max(step, (max - min) * 0.018);

  function normalize(nextValue: number, snap = true) {
    const steppedValue = Math.round(clamp(nextValue, min, max) / step) * step;

    if (!snap) return clamp(steppedValue, min, max);

    const closestPoint = snapPoints.reduce((closest, point) =>
      Math.abs(point - steppedValue) < Math.abs(closest - steppedValue) ? point : closest,
    );

    return Math.abs(closestPoint - steppedValue) <= snapThreshold ? closestPoint : clamp(steppedValue, min, max);
  }

  function commitDraft(input: HTMLInputElement) {
    const rawValue = input.value;
    const parsedValue = Number(rawValue.replace(/\D/g, ""));

    if (!Number.isFinite(parsedValue) || rawValue.trim() === "") {
      input.value = String(value);
      return;
    }

    onChange(normalize(parsedValue, false));
  }

  return (
    <div className={`${styles.slider}${tone === "dark" ? ` ${styles.dark}` : ""}`}>
      <div className={styles.header}>
        <label className={styles.label} htmlFor={id}>{label}</label>
        <div className={styles.valueField}>
          <span aria-hidden="true">R$</span>
          <input
            key={value}
            aria-label={`${label} em reais`}
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            type="number"
            defaultValue={value}
            onBlur={(event) => commitDraft(event.currentTarget)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
          />
        </div>
      </div>

      <div className={styles.trackArea}>
        <div className={styles.track} aria-hidden="true">
          <span className={styles.progress} style={{ width: `${percentage}%` }} />
          {snapPoints.map((point) => (
            <span
              className={styles.mark}
              key={point}
              style={{ left: `${((point - min) / (max - min)) * 100}%` }}
            />
          ))}
        </div>

        <input
          id={id}
          className={styles.range}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={currency.format(value)}
          onChange={(event) => onChange(normalize(Number(event.target.value)))}
        />

        <div className={styles.thumb} style={{ left: `${percentage}%` }} aria-hidden="true">
          <span className={styles.thumbArrow} />
          <span className={styles.thumbSquare} />
          <span className={styles.thumbValue}>{currency.format(value)}</span>
        </div>
      </div>

      <div className={styles.ends} aria-hidden="true">
        <span>R$ {integer.format(min)}</span>
        <span>R$ {integer.format(max)}+</span>
      </div>
    </div>
  );
}
