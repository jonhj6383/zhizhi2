import { useMemo, useState } from "react";
import { BatchTable } from "./components/BatchTable";
import { FooterNote } from "./components/FooterNote";
import { ParameterPanel } from "./components/ParameterPanel";
import { SingleCalculator } from "./components/SingleCalculator";
import { DEFAULT_PARAMETERS } from "./utils/calculator";
import type { ModelParameters } from "./types";

export default function App() {
  const [parameters, setParameters] = useState<ModelParameters>(DEFAULT_PARAMETERS);

  const headerStats = useMemo(
    () => [
      { label: "平台扣点", value: `${Math.round(parameters.platform_take_rate * 100)}%` },
      { label: "默认汇率", value: parameters.exchange_rate.toFixed(2) },
      { label: "目标利润", value: `¥${parameters.target_profit.toFixed(2)}` },
    ],
    [parameters],
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">静态网页 · 无后端 · 可部署 Pages</p>
          <h1>Temu 全托选品利润计算器</h1>
          <p className="subtitle">输入外币售价、汇率和1688进货价，快速反推安全成本与上架风险。</p>
        </div>
        <div className="header-stats" aria-label="当前模型概览">
          {headerStats.map((stat) => (
            <div className="stat" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </header>

      <main className="layout">
        <ParameterPanel parameters={parameters} onChange={setParameters} />
        <div className="workspace">
          <SingleCalculator parameters={parameters} />
          <BatchTable parameters={parameters} />
        </div>
      </main>

      <FooterNote />
    </div>
  );
}
