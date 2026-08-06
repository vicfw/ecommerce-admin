import type { DataProvider } from "react-admin";
import { QueryClient } from "@tanstack/react-query";
import { getCatalogList, getCatalogOne } from "../api/catalog";
import { deleteComment, getComments, updateComment } from "../api/comment";
import { getOrder, getOrders, updateOrderStatus } from "../api/order";
import {
  createResource,
  deleteResource,
  getResourceList,
  getResourceOne,
  updateResource,
} from "../api/resource";
import { getUser, getUsers, updateUser } from "../api/users";
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

const invalidateResource = (resource: string, id?: string | number) => {
  queryClient.invalidateQueries({ queryKey: [resource] });
  if (id !== undefined) {
    queryClient.invalidateQueries({
      queryKey: [resource, "getOne", id],
    });
  }
};

export const axiosDataProvider = (): DataProvider => {
  const baseProvider: DataProvider = {
    getList: async (resource, params) => {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field, order } = params.sort || {};

      return queryClient.fetchQuery({
        queryKey: [resource, "getList", params],
        queryFn: () =>
          getResourceList(resource, {
            page,
            perPage,
            sort: field,
            order,
            ...params.filter,
          }),
      });
    },

    getOne: async (resource, params) => {
      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getOne", params.id],
        queryFn: () => getResourceOne(resource, params.id),
      });
      return { data };
    },

    getMany: async (resource, params) => {
      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getMany", params.ids],
        queryFn: async () => {
          const fetchOne = (id: string | number) => {
            if (resource === "order") return getOrder(id);
            if (isAdminCatalogResource(resource)) {
              return getCatalogOne(resource, id);
            }
            return getResourceOne(resource, id);
          };
          return Promise.all(params.ids.map(fetchOne));
        },
      });

      return { data };
    },

    getManyReference: async (resource, params) => {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field, order } = params.sort || {};
      const listParams = {
        [params.target]: params.id,
        page,
        perPage,
        sort: field,
        order,
        ...params.filter,
      };

      return queryClient.fetchQuery({
        queryKey: [resource, "getManyReference", params],
        queryFn: () =>
          isAdminCatalogResource(resource)
            ? getCatalogList(resource, listParams)
            : getResourceList(resource, listParams),
      });
    },

    create: async (resource, params) => {
      const data = await createResource(resource, params.data);
      invalidateResource(resource);
      return { data };
    },

    update: async (resource, params) => {
      const data = await updateResource(resource, params.id, params.data);
      invalidateResource(resource, params.id);
      return { data };
    },

    updateMany: async (resource, params) => {
      await Promise.all(
        params.ids.map((id) => updateResource(resource, id, params.data)),
      );
      invalidateResource(resource);
      return { data: params.ids };
    },

    delete: async (resource, params) => {
      const data = await deleteResource(resource, params.id);
      invalidateResource(resource);
      queryClient.removeQueries({
        queryKey: [resource, "getOne", params.id],
      });
      return { data: data as any };
    },

    deleteMany: async (resource, params) => {
      await Promise.all(params.ids.map((id) => deleteResource(resource, id)));
      invalidateResource(resource);
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
      const listParams = {
        page,
        perPage,
        sort: field,
        order,
        ...params.filter,
      };

      if (resource === "order") {
        return getOrders(listParams);
      }

      if (resource === "comment") {
        return getComments({
          page,
          perPage,
          ...normalizeIsApprovedFilter(params.filter),
        });
      }

      if (resource === "users") {
        return getUsers({ page, perPage, ...params.filter });
      }

      if (isAdminCatalogResource(resource)) {
        return getCatalogList(resource, listParams);
      }

      return baseProvider.getList(resource, params);
    },

    getOne: async (resource, params) => {
      if (resource === "order") {
        return { data: await getOrder(params.id) };
      }
      if (resource === "users") {
        return { data: await getUser(params.id) };
      }
      if (isAdminCatalogResource(resource)) {
        return { data: await getCatalogOne(resource, params.id) };
      }
      return baseProvider.getOne(resource, params);
    },

    update: async (resource, params) => {
      if (resource === "order") {
        const data = await updateOrderStatus(params.id, params.data.status);
        invalidateResource(resource, params.id);
        return { data };
      }
      if (resource === "users") {
        const data = await updateUser(params.id, {
          isAdmin: params.data.isAdmin,
          point: params.data.point,
        });
        invalidateResource(resource, params.id);
        return { data };
      }
      if (resource === "comment") {
        const data = await updateComment(
          params.id,
          buildCommentUpdatePayload(params.data),
        );
        invalidateResource(resource);
        return { data };
      }
      return baseProvider.update(resource, params);
    },

    delete: async (resource, params) => {
      if (resource === "comment") {
        await deleteComment(params.id);
        invalidateResource(resource);
        return { data: { id: params.id } as any };
      }
      return baseProvider.delete(resource, params);
    },

    deleteMany: async (resource, params) => {
      if (resource === "comment") {
        await Promise.all(params.ids.map((id) => deleteComment(id)));
        invalidateResource(resource);
        return { data: params.ids };
      }
      return baseProvider.deleteMany(resource, params);
    },
  };
};
