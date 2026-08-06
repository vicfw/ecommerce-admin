import { apiClient, type AxiosResponse } from "../axios";
import type { ListParams, ListResponse } from "../types";

export const getComments = async (
  params: ListParams,
): Promise<ListResponse> => {
  const response = await apiClient.get<
    AxiosResponse<unknown[]> & { total?: number }
  >("/comment/admin", { params });
  const items = response.data?.data || [];
  return {
    data: items,
    total: response.data?.total ?? items.length,
  };
};

export const updateComment = async (
  id: string | number,
  payload: Record<string, unknown>,
): Promise<any> => {
  const response = await apiClient.patch<AxiosResponse<any>>(
    `/comment/${id}`,
    payload,
  );
  return response.data?.data || response.data;
};

export const deleteComment = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/comment/${id}`);
};
