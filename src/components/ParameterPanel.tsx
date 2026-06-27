import type { ModelParameters, RiskPresetKey } from "../types";
import { DEFAULT_PARAMETERS, RISK_PRESETS } from "../utils/calculator";

interface ParameterPanelProps {
  parameters: ModelParameters;
  onChange: (next: ModelParameters) => void;
}

const fields: Array<{ key: keyof ModelParameters; label: string; step: string; min: number }> = [
  { key: "platform_take_rate", label: "平台综合扣点", step: "0.01", min: 0 },
  { key: "logistics_cost", label: "物流履约成本", step: "0.1", min: 0 },
  { key: "target_profit", label: "目标最低利润", step: "0.1", min: 0 },
  { key: "category_multiplier", label: "类目系数", step: "0.01", min: 0 },
  { key: "volume_penalty", label: "体积惩罚系数", step: "0.1", min: 0 },
  { key: "exchange_rate", label: "默认汇率", step: "0.0001", min: 0 },
];

const presetLabels: Record<RiskPresetKey, string> = {
  optimistic: "乐观模型",
  standard: "标准模型",
  conservative: "保守模型",
};

export function ParameterPanel({ parameters, onChange }: ParameterPanelProps) {
  function updateField(key: keyof ModelParameters, value: number) {
    onChange({ ...parameters, [key]: Number.isFinite(value) ? value : 0 });
  }

  function applyPreset(key: RiskPresetKey) {
    onChange({ ...parameters, ...RISK_PRESETS[key] });
  }

  return (
    <aside className="panel parameter-panel">
      <div className="section-title">
        <span>模型参数</span>
        <button className="ghost-button" type="button" onClick={() => onChange(DEFAULT_PARAMETERS)}>
          重置
        </button>
      </div>

      <div className="preset-grid" aria-label="风险分层模型">
        {(Object.keys(RISK_PRESETS) as RiskPresetKey[]).map((key) => (
          <button className="preset-button" type="button" key={key} onClick={() => applyPreset(key)}>
            {presetLabels[key]}
          </button>
        ))}
      </div>

      <div className="field-grid">
        {fields.map((field) => (
          <label className="field" key={field.key}>
            <span>{field.label}</span>
            <input
              type="number"
              min={field.min}
              step={field.step}
              value={parameters[field.key]}
              onChange={(event) => updateField(field.key, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
    </aside>
  );
}
