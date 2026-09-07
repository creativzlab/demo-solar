import Image from "next/image";
import styles from "./logo-scroller.module.css";

export type CertificationLogo = {
  src: string;
  alt: string;
};

type LogoScrollerProps = {
  logos: readonly CertificationLogo[];
};

export default function LogoScroller({ logos }: LogoScrollerProps) {
  if (logos.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="certifications-heading">
      <div className={styles.inner} data-reveal="soft">
        <h2 id="certifications-heading">100% certificados</h2>

        <div className={styles.logoRow} data-testid="certification-logo-track">
          {logos.map((logo) => (
            <div className={styles.logoItem} key={logo.src}>
              <Image
                className={styles.logo}
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="(max-width: 640px) 36px, (max-width: 1024px) 56px, 68px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
