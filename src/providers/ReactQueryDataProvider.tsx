import type { DataProvider } from "react-admin";
import { fetchUtils } from "react-admin";
import { QueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/axios";

// Create a query client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Custom data provider that uses React Query and Axios
 * This bridges React Admin's DataProvider interface with React Query's caching
 *
 * Features:
 * - Automatic caching via React Query
 * - Automatic cache invalidation on mutations
 * - Uses Axios for HTTP requests
 * - Handles authentication tokens automatically
 */
export const reactQueryDataProvider = (
  apiUrl: string,
  httpClient = fetchUtils.fetchJson
): DataProvider => {
  return {
    getList: async (resource, params) => {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field, order } = params.sort || {};
      const query = {
        ...fetchUtils.flattenObject(params.filter),
        _sort: field,
        _order: order,
        _start: (page - 1) * perPage,
        _end: page * perPage,
      };

      // Use React Query to fetch and cache
      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getList", query],
        queryFn: async () => {
          const { json } = await httpClient(`${apiUrl}/${resource}`, {
            method: "GET",
            // Convert query params to URL search params
            // Note: Your backend might need different query param structure
          });
          return json;
        },
        staleTime: 30000, // 30 seconds
      });

      // Transform response to React Admin format
      // Adjust this based on your actual API response structure
      const items = Array.isArray(data)
        ? data
        : data?.data || data?.items || [];
      const total = data?.total || items.length;

      return {
        data: items,
        total,
      };
    },

    getOne: async (resource, params) => {
      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getOne", params.id],
        queryFn: async () => {
          const { json } = await httpClient(
            `${apiUrl}/${resource}/${params.id}`
          );
          return json;
        },
      });

      return {
        data: data?.data || data,
      };
    },

    getMany: async (resource, params) => {
      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getMany", params.ids],
        queryFn: async () => {
          // Fetch all items in parallel
          const promises = params.ids.map((id) =>
            httpClient(`${apiUrl}/${resource}/${id}`).then(
              ({ json }) => json?.data || json
            )
          );
          return Promise.all(promises);
        },
      });

      return {
        data,
      };
    },

    getManyReference: async (resource, params) => {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field, order } = params.sort || {};
      const query = {
        ...fetchUtils.flattenObject(params.filter),
        [params.target]: params.id,
        _sort: field,
        _order: order,
        _start: (page - 1) * perPage,
        _end: page * perPage,
      };

      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getManyReference", query],
        queryFn: async () => {
          const { json } = await httpClient(`${apiUrl}/${resource}`, {
            method: "GET",
          });
          return json;
        },
      });

      const items = Array.isArray(data)
        ? data
        : data?.data || data?.items || [];
      const total = data?.total || items.length;

      return {
        data: items,
        total,
      };
    },

    create: async (resource, params) => {
      const { json } = await httpClient(`${apiUrl}/${resource}`, {
        method: "POST",
        body: JSON.stringify(params.data),
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [resource] });

      return {
        data: json?.data || json,
      };
    },

    update: async (resource, params) => {
      const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(params.data),
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [resource] });
      queryClient.invalidateQueries({
        queryKey: [resource, "getOne", params.id],
      });

      return {
        data: json?.data || json,
      };
    },

    updateMany: async (resource, params) => {
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "PATCH",
          body: JSON.stringify(params.data),
        })
      );

      await Promise.all(promises);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [resource] });

      return {
        data: params.ids,
      };
    },

    delete: async (resource, params) => {
      const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "DELETE",
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [resource] });
      queryClient.removeQueries({ queryKey: [resource, "getOne", params.id] });

      return {
        data: json?.data || json || { id: params.id },
      };
    },

    deleteMany: async (resource, params) => {
      const promises = params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "DELETE",
        })
      );

      await Promise.all(promises);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [resource] });
      params.ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: [resource, "getOne", id] });
      });

      return {
        data: params.ids,
      };
    },
  };
};

/**
 * Recommended: Data provider using Axios directly with React Query
 * This is the preferred implementation as it uses the configured apiClient
 * with interceptors for auth tokens and error handling
 */
export const axiosDataProvider = (_apiUrl: string): DataProvider => {
  return {
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

      // Transform response to React Admin format
      // Adjust based on your API response structure
      const items = Array.isArray(data)
        ? data
        : data?.data || data?.items || [];
      const total = data?.total || data?.pagination?.total || items.length;

      return {
        data: items,
        total,
      };
    },

    getOne: async (resource, params) => {
      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getOne", params.id],
        queryFn: async () => {
          const response = await apiClient.get(`/${resource}/${params.id}`);
          return response.data;
        },
      });

      return {
        data: data?.data || data,
      };
    },

    getMany: async (resource, params) => {
      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getMany", params.ids],
        queryFn: async () => {
          const promises = params.ids.map((id) =>
            apiClient
              .get(`/${resource}/${id}`)
              .then((res) => res.data?.data || res.data)
          );
          return Promise.all(promises);
        },
      });

      return {
        data,
      };
    },

    getManyReference: async (resource, params) => {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field, order } = params.sort || {};

      const data = await queryClient.fetchQuery({
        queryKey: [resource, "getManyReference", params],
        queryFn: async () => {
          const response = await apiClient.get(`/${resource}`, {
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

      return {
        data: items,
        total,
      };
    },

    create: async (resource, params) => {
      const response = await apiClient.post(`/${resource}`, params.data);

      // Invalidate related queries to refresh the list
      queryClient.invalidateQueries({ queryKey: [resource] });

      return {
        data: response.data?.data || response.data,
      };
    },

    update: async (resource, params) => {
      const response = await apiClient.patch(
        `/${resource}/${params.id}`,
        params.data
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [resource] });
      queryClient.invalidateQueries({
        queryKey: [resource, "getOne", params.id],
      });

      return {
        data: response.data?.data || response.data,
      };
    },

    updateMany: async (resource, params) => {
      const promises = params.ids.map((id) =>
        apiClient.patch(`/${resource}/${id}`, params.data)
      );

      await Promise.all(promises);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [resource] });

      return {
        data: params.ids,
      };
    },

    delete: async (resource, params) => {
      const response = await apiClient.delete(`/${resource}/${params.id}`);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [resource] });
      queryClient.removeQueries({ queryKey: [resource, "getOne", params.id] });

      return {
        data: (response.data?.data ||
          response.data || { id: params.id }) as any,
      };
    },

    deleteMany: async (resource, params) => {
      const promises = params.ids.map((id) =>
        apiClient.delete(`/${resource}/${id}`)
      );
      await Promise.all(promises);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [resource] });
      params.ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: [resource, "getOne", id] });
      });

      return {
        data: params.ids,
      };
    },
  };
};
