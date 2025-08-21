import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../app/services/api";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: "", // Base URL is already set in the axiosInstance
  }),
  tagTypes: ["Store", "Products"],
  endpoints: (builder) => ({
    getStoreDetail: builder.query({
      query: (storeId) => ({
        url: `/store/detail/${storeId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, storeId) => [{ type: "Store", id: storeId }],
    }),
    getProducts: builder.query({
      query: ({ storeId, page = 0, size = 10 }) => ({
        url: `/product/list`,
        method: "GET",
        params: { storeId, page, size },
      }),
      transformResponse: (response) => response.data,
      // Group all paginated requests for the same storeId under one cache entry
      serializeQueryArgs: ({ queryArgs }) => {
        const { storeId } = queryArgs;
        return { storeId };
      },
      // Merge new pages into the existing cache
      merge: (currentCache, newItems, { arg }) => {
        // If it's the first page, replace the cache
        if (arg.page === 0) {
          return newItems;
        }
        // Otherwise, append the new items
        // Make sure to handle potential duplicates if items can be re-fetched
        const currentContent = currentCache.content || [];
        const newContent = newItems.content || [];

        return {
          ...newItems,
          content: [...currentContent, ...newContent],
        };
      },
      providesTags: (result, error, { storeId }) => [
        { type: "Products", id: storeId },
      ],
    }),
  }),
});

export const { useGetStoreDetailQuery, useGetProductsQuery } = apiSlice;
