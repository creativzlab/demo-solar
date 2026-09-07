"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { wrap } from "@motionone/utils";
import styles from "./marquee-effect.module.css";

type MarqueeAnimationProps = {
  children: string;
  className?: string;
  baseVelocity?: number;
  testId?: string;
};

export function MarqueeAnimation({
  children,
  className = "",
  baseVelocity = 0.018,
  testId = "scroll-marquee",
}: MarqueeAnimationProps) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    damping: 48,
    stiffness: 420,
    mass: 0.22,
  });
  const x = useTransform(smoothScrollY, (value) =>
    reduceMotion ? "0%" : `${wrap(-25, 0, -value * baseVelocity)}%`,
  );

  return (
    <div
      className={`${styles.ribbon} ${className}`.trim()}
      aria-label={children}
      data-testid={testId}
      data-reveal="soft"
    >
      <motion.div className={styles.track} style={{ x }} aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span className={styles.item} key={index}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
