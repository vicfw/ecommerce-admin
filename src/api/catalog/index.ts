import { apiClient, type AxiosResponse } from "../axios";
import { normalizeListResponse } from "../normalizeList";
import type { ListParams, ListResponse } from "../types";

/** Admin catalog resources: product, brand, badge, colorImage */
export const getCatalogList = async (
  resource: string,
  params: ListParams,
): Promise<ListResponse> => {
  const response = await apiClient.get(`/${resource}/admin`, { params });
  return normalizeListResponse(response.data);
};

export const getCatalogOne = async (
  resource: string,
  id: string | number,
): Promise<any> => {
  const response = await apiClient.get<AxiosResponse<any>>(
    `/${resource}/admin/${id}`,
  );
  return response.data?.data || response.data;
};
