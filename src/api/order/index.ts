import { apiClient, type AxiosResponse } from "../axios";
import type { ListParams, ListResponse } from "../types";

export const getOrders = async (params: ListParams) => {
  const response = await apiClient.get<
    AxiosResponse<unknown[]> & { total?: number }
  >("/order/admin", { params });
  const items = response.data?.data || [];
  return {
    data: items,
    total: response.data?.total ?? items.length,
  } satisfies ListResponse;
};

export const getOrder = async (id: string | number) => {
  const response = await apiClient.get<AxiosResponse<unknown>>(
    `/order/admin/${id}`,
  );
  return response.data?.data || response.data;
};

export const updateOrderStatus = async (
  id: string | number,
  status: string,
) => {
  const response = await apiClient.patch<AxiosResponse<unknown>>(
    `/order/admin/${id}/status`,
    { status },
  );
  return response.data?.data || response.data;
};
