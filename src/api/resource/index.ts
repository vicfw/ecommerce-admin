import { apiClient, type AxiosResponse } from "../axios";
import { normalizeListResponse } from "../normalizeList";
import type { ListParams, ListResponse } from "../types";

/** Generic resource CRUD for standard `/${resource}` endpoints */
export const getResourceList = async (
  resource: string,
  params: ListParams,
): Promise<ListResponse> => {
  const response = await apiClient.get(`/${resource}`, { params });
  return normalizeListResponse(response.data);
};

export const getResourceOne = async (
  resource: string,
  id: string | number,
): Promise<any> => {
  const response = await apiClient.get<AxiosResponse<any>>(
    `/${resource}/${id}`,
  );
  return response.data?.data || response.data;
};

export const createResource = async (
  resource: string,
  data: unknown,
): Promise<any> => {
  const response = await apiClient.post<AxiosResponse<any>>(
    `/${resource}`,
    data,
  );
  return response.data?.data || response.data;
};

export const updateResource = async (
  resource: string,
  id: string | number,
  data: unknown,
): Promise<any> => {
  const response = await apiClient.patch<AxiosResponse<any>>(
    `/${resource}/${id}`,
    data,
  );
  return response.data?.data || response.data;
};

export const deleteResource = async (
  resource: string,
  id: string | number,
): Promise<any> => {
  const response = await apiClient.delete<AxiosResponse<any>>(
    `/${resource}/${id}`,
  );
  return response.data?.data || response.data || { id };
};
