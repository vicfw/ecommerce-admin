import { apiClient, type AxiosResponse } from "../axios";
import type { ListParams, ListResponse } from "../types";

const normalizeList = (data: unknown): ListResponse => {
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

/** Admin catalog resources: product, brand, badge, colorImage */
export const getCatalogList = async (
  resource: string,
  params: ListParams,
) => {
  const response = await apiClient.get(`/${resource}/admin`, { params });
  return normalizeList(response.data);
};

export const getCatalogOne = async (
  resource: string,
  id: string | number,
) => {
  const response = await apiClient.get<AxiosResponse<unknown>>(
    `/${resource}/admin/${id}`,
  );
  return response.data?.data || response.data;
};
