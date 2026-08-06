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

/** Generic resource CRUD for standard `/${resource}` endpoints */
export const getResourceList = async (
  resource: string,
  params: ListParams,
) => {
  const response = await apiClient.get(`/${resource}`, { params });
  return normalizeList(response.data);
};

export const getResourceOne = async (
  resource: string,
  id: string | number,
) => {
  const response = await apiClient.get<AxiosResponse<unknown>>(
    `/${resource}/${id}`,
  );
  return response.data?.data || response.data;
};

export const createResource = async (
  resource: string,
  data: unknown,
) => {
  const response = await apiClient.post<AxiosResponse<unknown>>(
    `/${resource}`,
    data,
  );
  return response.data?.data || response.data;
};

export const updateResource = async (
  resource: string,
  id: string | number,
  data: unknown,
) => {
  const response = await apiClient.patch<AxiosResponse<unknown>>(
    `/${resource}/${id}`,
    data,
  );
  return response.data?.data || response.data;
};

export const deleteResource = async (
  resource: string,
  id: string | number,
) => {
  const response = await apiClient.delete<AxiosResponse<unknown>>(
    `/${resource}/${id}`,
  );
  return response.data?.data || response.data || { id };
};
