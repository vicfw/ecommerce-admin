import type { DataProvider } from "react-admin";
import { QueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/axios";
import { normalizeIsApprovedFilter } from "../lib/commentFilters";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const buildCommentUpdatePayload = (data: Record<string, unknown>) => {
  const payload: Record<string, unknown> = {};
  if (data.isApproved !== undefined) payload.isApproved = data.isApproved;
  if (data.image !== undefined) payload.image = data.image;
  return payload;
};

const ADMIN_CATALOG_RESOURCES = new Set([
  "product",
  "brand",
  "badge",
  "colorImage",
]);

const isAdminCatalogResource = (resource: string) =>
  ADMIN_CATALOG_RESOURCES.has(resource);

export const axiosDataProvider = (): DataProvider => {
  const baseProvider: DataProvider = {
    getList: async (resource, params) => {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field, order } = params.sort || {};

      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getList", params],
        queryFn: async () => {
          const response = await apiClient.get(`/${resource}`, {
            params: {
              page,
              perPage,
              sort: field,
              order,
              ...params.filter,
            },
          });
          return response.data;
        },
      });

      const items = Array.isArray(data)
        ? data
        : data?.data || data?.items || [];
      const total = data?.total || data?.pagination?.total || items.length;

      return { data: items, total };
    },

    getOne: async (resource, params) => {
      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getOne", params.id],
        queryFn: async () => {
          const response = await apiClient.get(`/${resource}/${params.id}`);
          return response.data;
        },
      });

      return { data: data?.data || data };
    },

    getMany: async (resource, params) => {
      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getMany", params.ids],
        queryFn: async () => {
          const fetchOne = async (id: string | number) => {
            if (resource === "order") {
              const response = await apiClient.get(`/order/admin/${id}`);
              return response.data?.data || response.data;
            }
            if (isAdminCatalogResource(resource)) {
              const response = await apiClient.get(`/${resource}/admin/${id}`);
              return response.data?.data || response.data;
            }
            const response = await apiClient.get(`/${resource}/${id}`);
            return response.data?.data || response.data;
          };
          return Promise.all(params.ids.map(fetchOne));
        },
      });

      return { data };
    },

    getManyReference: async (resource, params) => {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field, order } = params.sort || {};

      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getManyReference", params],
        queryFn: async () => {
          const path = isAdminCatalogResource(resource)
            ? `/${resource}/admin`
            : `/${resource}`;
          const response = await apiClient.get(path, {
            params: {
              [params.target]: params.id,
              page,
              perPage,
              sort: field,
              order,
              ...params.filter,
            },
          });
          return response.data;
        },
      });

      const items = Array.isArray(data)
        ? data
        : data?.data || data?.items || [];
      const total = data?.total || data?.pagination?.total || items.length;

      return { data: items, total };
    },

    create: async (resource, params) => {
      const response = await apiClient.post(`/${resource}`, params.data);
      queryClient.invalidateQueries({ queryKey: [resource] });
      return { data: response.data?.data || response.data };
    },

    update: async (resource, params) => {
      const response = await apiClient.patch(
        `/${resource}/${params.id}`,
        params.data,
      );
      queryClient.invalidateQueries({ queryKey: [resource] });
      queryClient.invalidateQueries({
        queryKey: [resource, "getOne", params.id],
      });
      return { data: response.data?.data || response.data };
    },

    updateMany: async (resource, params) => {
      await Promise.all(
        params.ids.map((id) =>
          apiClient.patch(`/${resource}/${id}`, params.data),
        ),
      );
      queryClient.invalidateQueries({ queryKey: [resource] });
      return { data: params.ids };
    },

    delete: async (resource, params) => {
      const response = await apiClient.delete(`/${resource}/${params.id}`);
      queryClient.invalidateQueries({ queryKey: [resource] });
      queryClient.removeQueries({ queryKey: [resource, "getOne", params.id] });
      return {
        data: (response.data?.data ||
          response.data || { id: params.id }) as any,
      };
    },

    deleteMany: async (resource, params) => {
      await Promise.all(
        params.ids.map((id) => apiClient.delete(`/${resource}/${id}`)),
      );
      queryClient.invalidateQueries({ queryKey: [resource] });
      params.ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: [resource, "getOne", id] });
      });
      return { data: params.ids };
    },
  };

  return {
    ...baseProvider,
    getList: async (resource, params) => {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field, order } = params.sort || {};

      if (resource === "order") {
        const response = await apiClient.get("/order/admin", {
          params: { page, perPage, sort: field, order, ...params.filter },
        });
        const data = response.data;
        const items = data?.data || [];
        return { data: items, total: data?.total ?? items.length };
      }

      if (resource === "comment") {
        const response = await apiClient.get("/comment/admin", {
          params: {
            page,
            perPage,
            ...normalizeIsApprovedFilter(params.filter),
          },
        });
        const data = response.data;
        const items = data?.data || [];
        return { data: items, total: data?.total ?? items.length };
      }

      if (resource === "users") {
        const response = await apiClient.get("/users", {
          params: { page, perPage, ...params.filter },
        });
        const data = response.data;
        const items = data?.data || [];
        return { data: items, total: data?.total ?? items.length };
      }

      if (isAdminCatalogResource(resource)) {
        const response = await apiClient.get(`/${resource}/admin`, {
          params: {
            page,
            perPage,
            sort: field,
            order,
            ...params.filter,
          },
        });
        const data = response.data;
        const items = Array.isArray(data)
          ? data
          : data?.data || data?.items || [];
        const total = data?.total || data?.pagination?.total || items.length;
        return { data: items, total };
      }

      return baseProvider.getList(resource, params);
    },

    getOne: async (resource, params) => {
      if (resource === "order") {
        const response = await apiClient.get(`/order/admin/${params.id}`);
        return { data: response.data?.data || response.data };
      }
      if (resource === "users") {
        const response = await apiClient.get(`/users/${params.id}`);
        return { data: response.data?.data || response.data };
      }
      if (isAdminCatalogResource(resource)) {
        const response = await apiClient.get(`/${resource}/admin/${params.id}`);
        return { data: response.data?.data || response.data };
      }
      return baseProvider.getOne(resource, params);
    },

    update: async (resource, params) => {
      if (resource === "order") {
        const response = await apiClient.patch(
          `/order/admin/${params.id}/status`,
          { status: params.data.status },
        );
        queryClient.invalidateQueries({ queryKey: [resource] });
        queryClient.invalidateQueries({
          queryKey: [resource, "getOne", params.id],
        });
        return { data: response.data?.data || response.data };
      }
      if (resource === "users") {
        const response = await apiClient.patch(`/users/${params.id}`, {
          isAdmin: params.data.isAdmin,
          point: params.data.point,
        });
        queryClient.invalidateQueries({ queryKey: [resource] });
        queryClient.invalidateQueries({
          queryKey: [resource, "getOne", params.id],
        });
        return { data: response.data?.data || response.data };
      }
      if (resource === "comment") {
        const response = await apiClient.patch(
          `/comment/${params.id}`,
          buildCommentUpdatePayload(params.data),
        );
        queryClient.invalidateQueries({ queryKey: [resource] });
        return { data: response.data?.data || response.data };
      }
      return baseProvider.update(resource, params);
    },

    delete: async (resource, params) => {
      if (resource === "comment") {
        await apiClient.delete(`/comment/${params.id}`);
        queryClient.invalidateQueries({ queryKey: [resource] });
        return { data: { id: params.id } as any };
      }
      return baseProvider.delete(resource, params);
    },

    deleteMany: async (resource, params) => {
      if (resource === "comment") {
        await Promise.all(
          params.ids.map((id) => apiClient.delete(`/comment/${id}`)),
        );
        queryClient.invalidateQueries({ queryKey: [resource] });
        return { data: params.ids };
      }
      return baseProvider.deleteMany(resource, params);
    },
  };
};
