import axios from "axios";
import type { AuthProvider } from "react-admin";
import {
  adminLogin,
  clearSession,
  getMe,
  getStoredUser,
  storeSession,
  TOKEN_KEY,
  updateStoredUser,
} from "../api/auth";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const getStatus = (error: unknown): number | undefined =>
  (error as { status?: number })?.status ??
  (error as { response?: { status?: number } })?.response?.status;

const getErrorUrl = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.config?.url ?? "";
  }

  return (
    (error as { config?: { url?: string } })?.config?.url ??
    (error as { request?: { responseURL?: string } })?.request?.responseURL ??
    ""
  );
};

const isAuthRelated403 = (error: unknown) => {
  const url = getErrorUrl(error);
  return (
    url.includes("/users/me") ||
    url.includes("/admin/login") ||
    url.includes("/admin/request-otp")
  );
};

export const authProvider: AuthProvider = {
  login: async ({ phoneNumber, code }) => {
    try {
      const data = await adminLogin(phoneNumber, code);
      storeSession(data);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(
        new Error(getErrorMessage(error, "Login failed"))
      );
    }
  },

  logout: () => {
    clearSession();
    return Promise.resolve();
  },

  checkAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return Promise.reject();
    }

    try {
      const user = await getMe();

      if (!user.isAdmin) {
        clearSession();
        return Promise.reject();
      }

      updateStoredUser(user);
      return Promise.resolve();
    } catch {
      clearSession();
      return Promise.reject();
    }
  },

  checkError: (error) => {
    const status = getStatus(error);

    if (status === 401 || (status === 403 && isAuthRelated403(error))) {
      clearSession();
      return Promise.reject();
    }

    return Promise.resolve();
  },

  getIdentity: async () => {
    const stored = getStoredUser();
    if (stored) {
      return {
        id: stored.id,
        fullName: stored.phoneNumber,
      };
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return Promise.reject();
    }

    try {
      const user = await getMe();
      if (!user.isAdmin) {
        clearSession();
        return Promise.reject();
      }

      updateStoredUser(user);
      return {
        id: user.id,
        fullName: user.phoneNumber,
      };
    } catch {
      clearSession();
      return Promise.reject();
    }
  },

  getPermissions: async () => {
    const stored = getStoredUser();
    if (stored?.isAdmin) {
      return Promise.resolve("admin");
    }

    try {
      const user = await getMe();
      if (user.isAdmin) {
        updateStoredUser(user);
        return Promise.resolve("admin");
      }
    } catch {
      // fall through to reject
    }

    return Promise.reject();
  },
};
