import type { CurrencyCode } from "../../types";

const currencies: CurrencyCode[] = ["USD", "EUR", "GBP", "JPY", "KRW", "AUD", "RMB"];

export function CurrencySelect({
  value,
  onChange,
}: {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
}) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as CurrencyCode)}>
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
}
