import type { ReactNode } from "react";
import styles from "./radial-glow-background.module.css";

type RadialGlowBackgroundProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function RadialGlowBackground({ children, className = "", id }: RadialGlowBackgroundProps) {
  return (
    <section id={id} className={`${styles.root} ${className}`.trim()}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
    </section>
  );
}
