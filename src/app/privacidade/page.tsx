import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="legal-page shell">
      <Link href="/"><ArrowLeft size={16} /> Voltar</Link>
      <p className="eyebrow">Demonstração</p>
      <h1>Política de Privacidade</h1>
      <p>Este ambiente demonstra como um formulário de orçamento pode coletar e encaminhar informações para um CRM. Não envie documentos, contas de luz ou dados sensíveis.</p>
      <h2>Dados coletados</h2>
      <p>Nome, WhatsApp, bairro, tipo de imóvel, valor e faixa da conta de energia, tipo de telhado, prazo desejado para instalação e registro da solicitação de contato.</p>
      <h2>Finalidade</h2>
      <p>Demonstrar cadastro, qualificação e organização comercial. Os dados de teste devem ser fictícios e podem ser removidos após a apresentação.</p>
      <h2>Contato</h2>
      <p>Para dúvidas sobre esta demonstração, use os canais oficiais da CreativzLab.</p>
    </main>
  );
}
