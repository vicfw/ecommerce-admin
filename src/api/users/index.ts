import { apiClient, type AxiosResponse } from "../axios";
import type { ListParams, ListResponse } from "../types";

export type UpdateUserPayload = {
  isAdmin?: boolean;
  point?: number;
};

export const getUsers = async (
  params: ListParams,
): Promise<ListResponse> => {
  const response = await apiClient.get<
    AxiosResponse<unknown[]> & { total?: number }
  >("/users", { params });
  const items = response.data?.data || [];
  return {
    data: items,
    total: response.data?.total ?? items.length,
  };
};

export const getUser = async (id: string | number): Promise<any> => {
  const response = await apiClient.get<AxiosResponse<any>>(`/users/${id}`);
  return response.data?.data || response.data;
};

export const updateUser = async (
  id: string | number,
  payload: UpdateUserPayload,
): Promise<any> => {
  const response = await apiClient.patch<AxiosResponse<any>>(
    `/users/${id}`,
    payload,
  );
  return response.data?.data || response.data;
};
