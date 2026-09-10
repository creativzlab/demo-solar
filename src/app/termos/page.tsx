import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="legal-page shell">
      <Link href="/"><ArrowLeft size={16} /> Voltar</Link>
      <p className="eyebrow">Demonstração</p>
      <h1>Termos de uso</h1>
      <p>Demanda Infinita é uma demonstração. Este site não vende, instala ou dimensiona sistemas fotovoltaicos e não representa uma empresa real.</p>
      <h2>Indicadores e garantias</h2>
      <p>Economia, prazo, satisfação, certificações, garantias e avaliações são exemplos de apresentação. Em um projeto real, todo dado deve ser substituído por evidência verificável e condições contratuais da integradora.</p>
      <h2>Uso do formulário</h2>
      <p>Use apenas dados sintéticos durante a demonstração. Não envie dados de terceiros sem autorização.</p>
    </main>
  );
}
