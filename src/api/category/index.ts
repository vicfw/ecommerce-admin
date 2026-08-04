import { apiClient, type AxiosResponse } from "../axios";
import type { CreateCategoryPayload, CreateCategoryResponse } from "./types";

export const createMainCategory = async (payload: CreateCategoryPayload) => {
  const response = await apiClient.post<AxiosResponse<CreateCategoryResponse>>(
    "/category/parent",
    payload
  );

  return response.data;
};

export const createChildCategory = async (payload: CreateCategoryPayload) => {
  const response = await apiClient.post<AxiosResponse<CreateCategoryResponse>>(
    "/category/parent",
    payload
  );

  return response.data;
};

export const createSubChildCategory = async (
  payload: CreateCategoryPayload
) => {
  const response = await apiClient.post<AxiosResponse<CreateCategoryResponse>>(
    "/category/parent",
    payload
  );

  return response.data;
};
