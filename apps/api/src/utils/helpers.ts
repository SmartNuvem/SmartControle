export function formatCurrency(value: number): string {
  return value.toFixed(2);
}

export function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  return Number(value);
}

export function parseBool(value?: string): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}



