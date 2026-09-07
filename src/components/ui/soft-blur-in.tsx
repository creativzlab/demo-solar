"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export interface SoftBlurInProps {
  children: string;
  className?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Per-character stagger, in milliseconds. */
  stagger?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.9;
const MS = 1000;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function SoftBlurIn({
  children,
  className = "",
  delay = 0,
  stagger = 25,
  triggerOnView = false,
}: SoftBlurInProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;
  const tokens = children.split(/(\s+)/);
  const tokenOffsets = tokens.map((_, tokenIndex) =>
    Array.from(tokens.slice(0, tokenIndex).join("")).length,
  );

  return (
    <span aria-label={children} className={className} ref={ref}>
      {tokens.map((token, tokenIndex) => {
        if (/^\s+$/.test(token)) {
          return <span key={`space-${tokenIndex}`}> </span>;
        }

        const wordOffset = tokenOffsets[tokenIndex];
        const characters = Array.from(token);

        return (
          <span aria-hidden="true" key={`word-${tokenIndex}`} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {characters.map((char, index) => (
              <motion.span
                animate={play ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 16, filter: "blur(12px)" }
                }
                key={`${char}-${index}`}
                style={{ display: "inline-block" }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: DURATION_S,
                        delay: delay / MS + ((wordOffset + index) * stagger) / MS,
                        ease: EASE,
                      }
                }
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
