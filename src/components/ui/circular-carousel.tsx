"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import styles from "./circular-carousel.module.css";

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
  icon?: LucideIcon;
}

export interface CircularCarouselProps {
  items: CarouselItem[];
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  media?: ReactNode;
}

const VISIBLE_COUNT = 5;

function getItemPosition(index: number, activeIndex: number, total: number, compact: boolean) {
  const offset = index - activeIndex;
  const half = Math.floor(VISIBLE_COUNT / 2);
  let adjustedOffset = offset;

  if (offset > half) adjustedOffset = offset - total;
  if (offset < -half) adjustedOffset = offset + total;

  const radiusX = compact ? 124 : 210;
  const radiusY = compact ? 80 : 106;
  const angle = (adjustedOffset / VISIBLE_COUNT) * Math.PI;
  const distance = Math.abs(adjustedOffset);

  return {
    x: Math.sin(angle) * radiusX,
    y: -Math.cos(angle) * radiusY,
    scale: Math.max(compact ? 0.78 : 0.72, 1 - distance * (compact ? 0.09 : 0.11)),
    opacity: Math.max(0.38, 1 - distance * 0.25),
    zIndex: VISIBLE_COUNT - distance,
  };
}

export function CircularCarousel({
  items,
  activeIndex: controlledIndex,
  onActiveChange,
  autoPlay = true,
  autoPlayInterval = 4000,
  className = "",
  media,
}: CircularCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [compact, setCompact] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const activeIndex = controlledIndex ?? internalIndex;
  const total = items.length;

  const goTo = useCallback((index: number) => {
    if (!total) return;
    const nextIndex = ((index % total) + total) % total;
    if (controlledIndex === undefined) setInternalIndex(nextIndex);
    onActiveChange?.(nextIndex);
  }, [controlledIndex, onActiveChange, total]);

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 520));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoPlay || reduceMotion || isHovered || isFocused || total < 2) return;
    const interval = window.setInterval(next, autoPlayInterval);
    return () => window.clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isFocused, isHovered, next, reduceMotion, total]);

  if (!total) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Carrossel das etapas do processo de energia solar"
      aria-roledescription="carousel"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") previous();
        if (event.key === "ArrowRight") next();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsFocused(false);
      }}
      className={`${styles.carousel} ${compact ? styles.compact : ""} ${className}`.trim()}
    >
      <div className={styles.stage} role="listbox" aria-label="Cinco etapas do processo">
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            const position = getItemPosition(index, activeIndex, total, compact);
            const isActive = index === activeIndex;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                type="button"
                role="option"
                aria-label={`${item.title}: ${item.description}`}
                aria-selected={isActive}
                data-testid="process-carousel-card"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
                animate={{
                  x: position.x,
                  y: position.y,
                  scale: reduceMotion ? 1 : position.scale,
                  opacity: position.opacity,
                  zIndex: position.zIndex,
                }}
                transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => goTo(index)}
                className={`${styles.card} ${isActive ? styles.activeCard : ""}`.trim()}
              >
                <span className={styles.cardTopline}>
                  <span className={styles.stepTag}>{item.tag ?? `Etapa ${index + 1}`}</span>
                  <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                </span>
                <span className={styles.cardHeading}>
                  {Icon && <span className={styles.icon}><Icon aria-hidden="true" /></span>}
                  <span className={styles.title}>{item.title}</span>
                </span>
                <span className={styles.description}>{item.description}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>

      </div>

      {media && <div className={styles.media}>{media}</div>}

      <div className={styles.controls}>
        <motion.button
          type="button"
          whileHover={reduceMotion ? undefined : { scale: 1.08 }}
          whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          onClick={previous}
          aria-label="Etapa anterior"
          className={styles.arrowButton}
        >
          <ChevronLeft aria-hidden="true" />
        </motion.button>

        <div className={styles.dots} role="tablist" aria-label="Selecionar etapa">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Ir para etapa ${index + 1}: ${item.title}`}
              onClick={() => goTo(index)}
              className={index === activeIndex ? styles.activeDot : ""}
            />
          ))}
        </div>

        <motion.button
          type="button"
          whileHover={reduceMotion ? undefined : { scale: 1.08 }}
          whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          onClick={next}
          aria-label="Próxima etapa"
          className={styles.arrowButton}
        >
          <ChevronRight aria-hidden="true" />
        </motion.button>
      </div>
    </div>
  );
}
