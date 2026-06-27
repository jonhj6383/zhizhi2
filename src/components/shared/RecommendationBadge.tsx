import type { Recommendation } from "../../types";

export function RecommendationBadge({ value }: { value: Recommendation }) {
  return <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>;
}
