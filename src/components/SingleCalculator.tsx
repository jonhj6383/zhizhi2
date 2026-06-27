import { useMemo, useState } from "react";
import type { CurrencyCode, ModelParameters, ProductInput } from "../types";
import { calculateProduct } from "../utils/calculator";
import { CurrencySelect } from "./shared/CurrencySelect";
import { RecommendationBadge } from "./shared/RecommendationBadge";

interface SingleCalculatorProps {
  parameters: ModelParameters;
}

export function SingleCalculator({ parameters }: SingleCalculatorProps) {
  const [product, setProduct] = useState<ProductInput>({
    sku: "SKU-001",
    retail_price_foreign: 2.99,
    currency: "USD",
    exchange_rate: parameters.exchange_rate,
    purchase_cost: 6,
  });

  const result = useMemo(() => calculateProduct(product, parameters), [product, parameters]);

  function update<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setProduct((current) => ({ ...current, [key]: value }));
  }

  function updateCurrency(currency: CurrencyCode) {
    setProduct((current) => ({
      ...current,
      currency,
      exchange_rate: currency === "RMB" ? 1 : current.exchange_rate || parameters.exchange_rate,
    }));
  }

  return (
    <section className="panel">
      <div className="section-title">
        <span>单品验证</span>
        <RecommendationBadge value={result.recommendation} />
      </div>

      <div className="single-grid">
        <label className="field">
          <span>SKU名称</span>
          <input value={product.sku} onChange={(event) => update("sku", event.target.value)} />
        </label>
        <label className="field">
          <span>Temu售价</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={product.retail_price_foreign}
            onChange={(event) => update("retail_price_foreign", Number(event.target.value))}
          />
        </label>
        <label className="field">
          <span>币种</span>
          <CurrencySelect value={product.currency} onChange={updateCurrency} />
        </label>
        <label className="field">
          <span>汇率</span>
          <input
            type="number"
            min="0"
            step="0.0001"
            value={product.exchange_rate}
            disabled={product.currency === "RMB"}
            onChange={(event) => update("exchange_rate", Number(event.target.value))}
          />
        </label>
        <label className="field">
          <span>1688进货价 RMB</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={product.purchase_cost}
            onChange={(event) => update("purchase_cost", Number(event.target.value))}
          />
        </label>
      </div>

      <div className="metric-grid">
        <Metric label="换算人民币" value={`¥${result.retail_price_rmb.toFixed(2)}`} />
        <Metric label="估算结算价" value={`¥${result.payout_estimate.toFixed(2)}`} />
        <Metric label="物流+体积成本" value={`¥${result.logistics_cost_total.toFixed(2)}`} />
        <Metric label="最大安全1688进货价" value={`¥${result.max_allowed_purchase_price.toFixed(2)}`} />
        <Metric label="预计单件利润" value={`¥${result.profit_estimate.toFixed(2)}`} highlight />
      </div>

      <p className="risk-copy">{result.risk_note}</p>
    </section>
  );
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={highlight ? "metric metric-highlight" : "metric"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
