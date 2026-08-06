import type { ListResponse } from "./types";

export const normalizeListResponse = (data: unknown): ListResponse => {
  if (Array.isArray(data)) {
    return { data, total: data.length };
  }

  const body = data as {
    data?: unknown[];
    items?: unknown[];
    total?: number;
    pagination?: { total?: number };
  };

  const items = body?.data || body?.items || [];
  const total = body?.total || body?.pagination?.total || items.length;
  return { data: items, total };
};
