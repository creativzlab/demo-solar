"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";
import styles from "./process-timeline.module.css";

export interface ProcessTimelineItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ProcessTimelineProps {
  items: readonly ProcessTimelineItem[];
}

export function ProcessTimeline({ items }: ProcessTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 68%", "end 48%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    mass: 0.22,
  });

  return (
    <div
      ref={timelineRef}
      className={styles.timeline}
      role="region"
      aria-label="Linha do tempo das etapas do processo de energia solar"
    >
      <div className={styles.rail} aria-hidden="true">
        <span className={styles.railBase} />
        <motion.span
          className={styles.railProgress}
          data-testid="process-timeline-progress"
          style={{ scaleY: reduceMotion ? 1 : smoothProgress }}
        />
      </div>

      <ol className={styles.list}>
        {items.map((item, index) => {
          const Icon = item.icon;
          const stepNumber = item.tag.replace(/[^0-9]/g, "") || String(index + 1).padStart(2, "0");

          return (
            <motion.li
              className={styles.item}
              data-testid="process-timeline-item"
              key={item.id}
              initial={reduceMotion ? false : "idle"}
              whileInView="active"
              viewport={{ amount: 0.5, margin: "-12% 0px -28%" }}
            >
              <div className={styles.nodeColumn} aria-hidden="true">
                <motion.span
                  className={styles.node}
                  variants={{
                    idle: { backgroundColor: "#171719", borderColor: "rgba(255,255,255,.18)", scale: 0.9 },
                    active: { backgroundColor: "#ff6b00", borderColor: "#ffb05b", scale: 1 },
                  }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                >
                  {index + 1}
                </motion.span>
              </div>

              <motion.div
                className={styles.stepLabel}
                variants={{
                  idle: { color: "rgba(255,255,255,.38)", x: -8 },
                  active: { color: "#ff8a00", x: 0 },
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <span>Etapa</span>
                <strong>{stepNumber}</strong>
              </motion.div>

              <motion.article
                className={styles.card}
                aria-labelledby={`process-step-${item.id}`}
                variants={{
                  idle: { opacity: 0.28, y: 18, filter: "blur(10px)" },
                  active: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={styles.icon} aria-hidden="true"><Icon /></span>
                <div>
                  <h3 id={`process-step-${item.id}`}>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.article>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
