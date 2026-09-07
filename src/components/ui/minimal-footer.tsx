import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import styles from "./minimal-footer.module.css";

const navigation = [
  { title: "Economia", href: "#economia" },
  { title: "Como funciona", href: "#processo" },
  { title: "Clientes", href: "#clientes" },
  { title: "Perguntas frequentes", href: "#faq" },
] as const;

const transparency = [
  { title: "Política de privacidade", href: "/privacidade" },
  { title: "Termos de uso", href: "/termos" },
] as const;

export function MinimalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.frame}>
        <div className={styles.glow} aria-hidden="true" />

        <div className={styles.grid} data-reveal>
          <div className={styles.brandColumn}>
            <a className={styles.brandLink} href="#top" aria-label="Demanda Solar Infinita — voltar ao início">
              <BrandMark inverse />
            </a>
            <p>
              Uma experiência demonstrativa de energia solar criada para apresentar
              captação, qualificação e atendimento em funcionamento.
            </p>
            <span className={styles.demoNote}>Dados, avaliações, certificações e resultados são demonstrativos.</span>
          </div>

          <nav className={styles.linkColumn} aria-label="Navegação do rodapé">
            <span className={styles.columnTitle}>Navegação</span>
            {navigation.map((item) => (
              <a href={item.href} key={item.href}>{item.title}</a>
            ))}
          </nav>

          <div className={styles.linkColumn}>
            <span className={styles.columnTitle}>Transparência</span>
            {transparency.map((item) => (
              <a href={item.href} key={item.href}>{item.title}</a>
            ))}
            <a className={styles.topLink} href="#top">
              Voltar ao topo
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={styles.bottom} data-reveal="soft">
          <p>© {year} Demanda Solar Infinita — demonstração</p>
          <p>demosolar.creativzlab.com</p>
        </div>
      </div>
    </footer>
  );
}
