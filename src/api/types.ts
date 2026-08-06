export type ListParams = {
  page?: number;
  perPage?: number;
  sort?: string;
  order?: string;
  [key: string]: unknown;
};

export type ListResponse<T = any> = {
  data: T[];
  total: number;
};
