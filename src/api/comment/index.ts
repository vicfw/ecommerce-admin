import { apiClient, type AxiosResponse } from "../axios";
import type { ListParams, ListResponse } from "../types";

export const getComments = async (params: ListParams) => {
  const response = await apiClient.get<
    AxiosResponse<unknown[]> & { total?: number }
  >("/comment/admin", { params });
  const items = response.data?.data || [];
  return {
    data: items,
    total: response.data?.total ?? items.length,
  } satisfies ListResponse;
};

export const updateComment = async (
  id: string | number,
  payload: Record<string, unknown>,
) => {
  const response = await apiClient.patch<AxiosResponse<unknown>>(
    `/comment/${id}`,
    payload,
  );
  return response.data?.data || response.data;
};

export const deleteComment = async (id: string | number) => {
  await apiClient.delete(`/comment/${id}`);
};
