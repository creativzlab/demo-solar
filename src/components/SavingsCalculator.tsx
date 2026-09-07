"use client";

import { useMemo, useState } from "react";
import { SnappySlider } from "@/components/ui/snappy-slider";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}
export function SavingsCalculator({ variant = "section" }: { variant?: "section" | "hero" }) {
  const [bill, setBill] = useState(850);
  const estimate = useMemo(() => {
    const monthly = Math.max(0, bill * 0.84);
    return { monthly, annual: monthly * 12, horizon: monthly * 12 * 25 };
  }, [bill]);

  return (
    <div className={`calculator-card${variant === "hero" ? " calculator-card--hero" : ""}`}>
      <h3 className="calculator-card__question">Qual é a média da sua conta de luz?</h3>
      <SnappySlider
        id="bill-range"
        label="Valor da conta de luz"
        min={200}
        max={5000}
        step={50}
        values={[200, 400, 700, 1000, 1500, 2000, 3000, 4000, 5000]}
        value={bill}
        tone={variant === "hero" ? "dark" : "light"}
        onChange={setBill}
      />
      <div className="savings-output">
        <div><span>Economia estimada/mês</span><strong>{money(estimate.monthly)}</strong></div>
        <div><span>Economia estimada/ano</span><strong>{money(estimate.annual)}</strong></div>
      </div>
      <div className="savings-horizon">
        <span>Potencial ilustrativo em 25 anos</span>
        <strong>{money(estimate.horizon)}</strong>
      </div>
    </div>
  );
}
