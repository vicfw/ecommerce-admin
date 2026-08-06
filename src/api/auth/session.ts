import type { AuthUser, AdminLoginResponse } from "./types";

export const TOKEN_KEY = "token";
export const USER_KEY = "user";

export const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const updateStoredUser = (user: AuthUser) => {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: user.id,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      name: user.name,
      lastName: user.lastName,
    })
  );
};

export const storeSession = (data: AdminLoginResponse) => {
  localStorage.setItem(TOKEN_KEY, data.token);
  updateStoredUser(data);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
