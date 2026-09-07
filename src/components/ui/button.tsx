import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
}

export function Component({
  title,
  subtitle,
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`${styles.button} ${styles[size]} ${className}`.trim()}
    >
      <span className={styles.movingGradient} aria-hidden="true" />
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.content}>
        <span className={styles.copy}>
          <span className={styles.title}>{title}</span>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </span>
      </span>
    </button>
  );
}
