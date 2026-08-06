import { apiClient, type AxiosResponse } from "../axios";
import type { ListParams, ListResponse } from "../types";

export const getOrders = async (
  params: ListParams,
): Promise<ListResponse> => {
  const response = await apiClient.get<
    AxiosResponse<unknown[]> & { total?: number }
  >("/order/admin", { params });
  const items = response.data?.data || [];
  return {
    data: items,
    total: response.data?.total ?? items.length,
  };
};

export const getOrder = async (id: string | number): Promise<any> => {
  const response = await apiClient.get<AxiosResponse<any>>(
    `/order/admin/${id}`,
  );
  return response.data?.data || response.data;
};

export const updateOrderStatus = async (
  id: string | number,
  status: string,
): Promise<any> => {
  const response = await apiClient.patch<AxiosResponse<any>>(
    `/order/admin/${id}/status`,
    { status },
  );
  return response.data?.data || response.data;
};
