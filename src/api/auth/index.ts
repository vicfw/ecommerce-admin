import { apiClient, type AxiosResponse } from "../axios";
import type { AdminLoginResponse, AuthUser } from "./types";

export type { AdminLoginResponse, AuthUser } from "./types";
export {
  clearSession,
  getStoredUser,
  storeSession,
  updateStoredUser,
  TOKEN_KEY,
} from "./session";

export const requestOtp = async (phoneNumber: string) => {
  const response = await apiClient.post<
    AxiosResponse<unknown> & { code?: string }
  >("/admin/request-otp", { phoneNumber });
  return response.data;
};

export const adminLogin = async (phoneNumber: string, code: string) => {
  const response = await apiClient.post<AxiosResponse<AdminLoginResponse>>(
    "/admin/login",
    { phoneNumber, code }
  );
  return response.data.data;
};

export const getMe = async () => {
  const response = await apiClient.get<AxiosResponse<AuthUser>>("/users/me");
  return response.data.data;
};
