import type {
  BatchSummary,
  ModelParameters,
  ProductInput,
  ProductResult,
  Recommendation,
  RiskPresetKey,
} from "../types";

export const DEFAULT_PARAMETERS: ModelParameters = {
  platform_take_rate: 0.6,
  logistics_cost: 1.5,
  target_profit: 1.0,
  category_multiplier: 1.0,
  volume_penalty: 0.3,
  exchange_rate: 7.2,
};

export const RISK_PRESETS: Record<RiskPresetKey, Pick<ModelParameters, "platform_take_rate" | "logistics_cost" | "volume_penalty">> = {
  optimistic: {
    platform_take_rate: 0.55,
    logistics_cost: 1.2,
    volume_penalty: 0.1,
  },
  standard: {
    platform_take_rate: 0.6,
    logistics_cost: 1.5,
    volume_penalty: 0.3,
  },
  conservative: {
    platform_take_rate: 0.65,
    logistics_cost: 1.8,
    volume_penalty: 0.5,
  },
};

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function getRetailPriceRmb(retailPriceForeign: number, exchangeRate: number): number {
  return retailPriceForeign * exchangeRate;
}

export function calculateProduct(product: ProductInput, parameters: ModelParameters): ProductResult {
  const exchangeRate = product.currency === "RMB" ? 1 : product.exchange_rate;
  const retailPriceRmb = getRetailPriceRmb(product.retail_price_foreign, exchangeRate);
  const effectiveTakeRate = parameters.platform_take_rate * parameters.category_multiplier;
  const payout = retailPriceRmb * (1 - effectiveTakeRate);
  const maxAllowedPurchasePrice =
    payout - parameters.logistics_cost - parameters.volume_penalty - parameters.target_profit;
  const profit = payout - parameters.logistics_cost - parameters.volume_penalty - product.purchase_cost;
  const recommendation = getRecommendation(profit, parameters.target_profit);

  return {
    ...product,
    exchange_rate: exchangeRate,
    retail_price_rmb: roundMoney(retailPriceRmb),
    payout_estimate: roundMoney(payout),
    logistics_cost_total: roundMoney(parameters.logistics_cost + parameters.volume_penalty),
    max_allowed_purchase_price: roundMoney(maxAllowedPurchasePrice),
    profit_estimate: roundMoney(profit),
    recommendation,
    risk_note: getRiskNote(recommendation),
  };
}

export function calculateBatch(products: ProductInput[], parameters: ModelParameters): ProductResult[] {
  return products.map((product) => calculateProduct(product, parameters));
}

export function summarizeBatch(results: ProductResult[]): BatchSummary {
  const total = results.length;
  const yes = results.filter((item) => item.recommendation === "YES").length;
  const warning = results.filter((item) => item.recommendation === "WARNING").length;
  const no = results.filter((item) => item.recommendation === "NO").length;
  const averageProfit =
    total === 0 ? 0 : roundMoney(results.reduce((sum, item) => sum + item.profit_estimate, 0) / total);

  return { total, yes, warning, no, averageProfit };
}

function getRecommendation(profit: number, targetProfit: number): Recommendation {
  if (profit >= targetProfit) {
    return "YES";
  }

  if (profit >= 0) {
    return "WARNING";
  }

  return "NO";
}

function getRiskNote(recommendation: Recommendation): string {
  if (recommendation === "YES") {
    return "达到目标利润，适合进入候选池继续验证。";
  }

  if (recommendation === "WARNING") {
    return "可测试但不适合放量。";
  }

  return "存在亏损风险。";
}
