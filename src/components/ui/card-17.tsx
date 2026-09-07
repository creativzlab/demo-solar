"use client";

import Image from "next/image";
import type { MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import styles from "./card-17.module.css";

interface SolarBenefitCardProps {
  icon: ReactNode;
  text: string;
  imageUrl: string;
  className?: string;
}

export function SolarBenefitCard({
  icon,
  text,
  imageUrl,
  className = "",
}: SolarBenefitCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 210, damping: 22, mass: 0.55 });
  const mouseYSpring = useSpring(y, { stiffness: 210, damping: 22, mass: 0.55 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      className={`${styles.card} ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className={styles.surface}
        style={{ transform: "translateZ(32px)" }}
      >
        <Image
          className={styles.image}
          src={imageUrl}
          alt=""
          fill
          sizes="(max-width: 760px) calc(100vw - 46px), (max-width: 1040px) 44vw, 30vw"
        />
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.accent} aria-hidden="true" />
        <div className={styles.content} style={{ transform: "translateZ(42px)" }}>
          <span className={styles.icon} aria-hidden="true">{icon}</span>
          <h3>{text}</h3>
        </div>
      </div>
    </motion.article>
  );
}
