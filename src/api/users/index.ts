import { apiClient, type AxiosResponse } from "../axios";
import type { ListParams, ListResponse } from "../types";

export type UpdateUserPayload = {
  isAdmin?: boolean;
  point?: number;
};

export const getUsers = async (params: ListParams) => {
  const response = await apiClient.get<
    AxiosResponse<unknown[]> & { total?: number }
  >("/users", { params });
  const items = response.data?.data || [];
  return {
    data: items,
    total: response.data?.total ?? items.length,
  } satisfies ListResponse;
};

export const getUser = async (id: string | number) => {
  const response = await apiClient.get<AxiosResponse<unknown>>(
    `/users/${id}`,
  );
  return response.data?.data || response.data;
};

export const updateUser = async (
  id: string | number,
  payload: UpdateUserPayload,
) => {
  const response = await apiClient.patch<AxiosResponse<unknown>>(
    `/users/${id}`,
    payload,
  );
  return response.data?.data || response.data;
};
