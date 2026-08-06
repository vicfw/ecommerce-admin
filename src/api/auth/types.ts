export type AuthUser = {
  id: number;
  phoneNumber: string;
  isAdmin: boolean;
  name?: string | null;
  lastName?: string | null;
};

export type AdminLoginResponse = AuthUser & {
  token: string;
};
