import { apiClient, type AxiosResponse } from "../axios";

export type DeliveryCost = {
  id: number;
  cost: number;
  createdAt: string;
  updatedAt: string;
};

export const getLatestDeliveryCost = async () => {
  const response =
    await apiClient.get<AxiosResponse<DeliveryCost | undefined>>("/deliveryCost");
  return response.data.data ?? null;
};

export const getAllDeliveryCosts = async () => {
  const response =
    await apiClient.get<AxiosResponse<DeliveryCost[]>>("/deliveryCost/all");
  return response.data.data ?? [];
};

export const createDeliveryCost = async (cost: number) => {
  const response = await apiClient.post<AxiosResponse<DeliveryCost>>(
    "/deliveryCost",
    { cost }
  );
  return response.data.data;
};

export type DashboardStats = {
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  totalRevenue: number;
  totalUsers: number;
  pendingComments: number;
  lowStockProducts: Array<{ id: number; prName: string; quantity: number }>;
  recentOrders: Array<{
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    user: {
      id: number;
      phoneNumber: string;
      name: string | null;
      lastName: string | null;
    };
  }>;
};

export const getDashboardStats = async () => {
  const response =
    await apiClient.get<AxiosResponse<DashboardStats>>("/admin/dashboard");
  return response.data.data;
};
