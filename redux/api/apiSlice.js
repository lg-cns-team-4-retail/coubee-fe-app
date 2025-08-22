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
    baseUrl: "",
  }),
  tagTypes: ["Store", "Products", "Product"],
  endpoints: (builder) => ({
    getStoreDetail: builder.query({
      query: (storeId) => ({
        url: `/store/detail/${storeId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, storeId) => [
        { type: "Store", id: storeId },
      ],
    }),
    getProductDetail: builder.query({
      query: (productId) => ({
        url: `/product/detail/${productId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),
    getProducts: builder.query({
      query: ({ storeId, page, size }) => ({
        url: `/product/list`,
        method: "GET",
        params: { storeId, page, size },
      }),
      transformResponse: (response) => response.data,
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs; // page를 제외한 { storeId, size }를 키로 사용
        return rest;
      },
      merge: (currentCache, newItems) => {
        const existingProductIds = new Set(
          currentCache.content.map((p) => p.productId)
        );

        const uniqueNewItems = newItems.content.filter(
          (p) => !existingProductIds.has(p.productId)
        );

        currentCache.content.push(...uniqueNewItems);

        currentCache.last = newItems.last;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const {
  useGetStoreDetailQuery,
  useGetProductsQuery,
  useGetProductDetailQuery,
} = apiSlice;
