export type OrderLineItem = {
  quantity: number;
  itemPrice: number;
  product?: { prName?: string; enName?: string };
};

export const parseOrderItems = (value: unknown): OrderLineItem[] => {
  if (Array.isArray(value)) {
    return value as OrderLineItem[];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};
