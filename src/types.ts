export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "KRW" | "AUD" | "RMB";

export type Recommendation = "YES" | "WARNING" | "NO";

export type RiskPresetKey = "optimistic" | "standard" | "conservative";

export interface ModelParameters {
  platform_take_rate: number;
  logistics_cost: number;
  target_profit: number;
  category_multiplier: number;
  volume_penalty: number;
  exchange_rate: number;
}

export interface ProductInput {
  sku: string;
  retail_price_foreign: number;
  currency: CurrencyCode;
  exchange_rate: number;
  purchase_cost: number;
}

export interface ProductResult extends ProductInput {
  retail_price_rmb: number;
  payout_estimate: number;
  logistics_cost_total: number;
  max_allowed_purchase_price: number;
  profit_estimate: number;
  recommendation: Recommendation;
  risk_note: string;
}

export interface BatchSummary {
  total: number;
  yes: number;
  warning: number;
  no: number;
  averageProfit: number;
}
