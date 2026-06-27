import { useMemo, useState } from "react";
import type { CurrencyCode, ModelParameters, ProductInput } from "../types";
import { calculateBatch, summarizeBatch } from "../utils/calculator";
import { CurrencySelect } from "./shared/CurrencySelect";
import { RecommendationBadge } from "./shared/RecommendationBadge";

interface BatchTableProps {
  parameters: ModelParameters;
}

const initialRows: ProductInput[] = [
  { sku: "A-美元候选", retail_price_foreign: 2.99, currency: "USD", exchange_rate: 7.2, purchase_cost: 6 },
  { sku: "B-低价风险", retail_price_foreign: 15, currency: "RMB", exchange_rate: 1, purchase_cost: 5 },
  { sku: "C-欧元高客单", retail_price_foreign: 4.99, currency: "EUR", exchange_rate: 7.8, purchase_cost: 12 },
];

export function BatchTable({ parameters }: BatchTableProps) {
  const [rows, setRows] = useState<ProductInput[]>(initialRows);
  const results = useMemo(() => calculateBatch(rows, parameters), [rows, parameters]);
  const summary = useMemo(() => summarizeBatch(results), [results]);

  function updateRow<K extends keyof ProductInput>(index: number, key: K, value: ProductInput[K]) {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)));
  }

  function updateCurrency(index: number, currency: CurrencyCode) {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, currency, exchange_rate: currency === "RMB" ? 1 : row.exchange_rate || parameters.exchange_rate }
          : row,
      ),
    );
  }

  function addRow() {
    setRows((current) => [
      ...current,
      {
        sku: `SKU-${current.length + 1}`,
        retail_price_foreign: 0,
        currency: "USD",
        exchange_rate: parameters.exchange_rate,
        purchase_cost: 0,
      },
    ]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  }

  return (
    <section className="panel">
      <div className="section-title">
        <span>批量选品</span>
        <button className="primary-button" type="button" onClick={addRow}>
          新增SKU
        </button>
      </div>

      <div className="summary-grid">
        <Summary label="SKU总数" value={summary.total} />
        <Summary label="YES" value={summary.yes} tone="yes" />
        <Summary label="WARNING" value={summary.warning} tone="warning" />
        <Summary label="NO" value={summary.no} tone="no" />
        <Summary label="平均利润" value={`¥${summary.averageProfit.toFixed(2)}`} />
      </div>

      <div className="table-scroll" role="region" aria-label="批量选品结果表格" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Temu售价</th>
              <th>币种</th>
              <th>汇率</th>
              <th>换算人民币</th>
              <th>估算结算价</th>
              <th>1688进货价</th>
              <th>最大安全进货价</th>
              <th>预计利润</th>
              <th>建议</th>
              <th>风险说明</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={`${result.sku}-${index}`}>
                <td>
                  <input value={rows[index].sku} onChange={(event) => updateRow(index, "sku", event.target.value)} />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={rows[index].retail_price_foreign}
                    onChange={(event) => updateRow(index, "retail_price_foreign", Number(event.target.value))}
                  />
                </td>
                <td>
                  <CurrencySelect value={rows[index].currency} onChange={(value) => updateCurrency(index, value)} />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.0001"
                    value={rows[index].exchange_rate}
                    disabled={rows[index].currency === "RMB"}
                    onChange={(event) => updateRow(index, "exchange_rate", Number(event.target.value))}
                  />
                </td>
                <td>¥{result.retail_price_rmb.toFixed(2)}</td>
                <td>¥{result.payout_estimate.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={rows[index].purchase_cost}
                    onChange={(event) => updateRow(index, "purchase_cost", Number(event.target.value))}
                  />
                </td>
                <td>¥{result.max_allowed_purchase_price.toFixed(2)}</td>
                <td className={result.profit_estimate < 0 ? "negative" : "positive"}>
                  ¥{result.profit_estimate.toFixed(2)}
                </td>
                <td>
                  <RecommendationBadge value={result.recommendation} />
                </td>
                <td className="risk-note">{result.risk_note}</td>
                <td>
                  <button className="icon-button" type="button" onClick={() => removeRow(index)} aria-label="删除SKU">
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Summary({ label, value, tone }: { label: string; value: number | string; tone?: "yes" | "warning" | "no" }) {
  return (
    <div className={tone ? `summary-card ${tone}` : "summary-card"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
