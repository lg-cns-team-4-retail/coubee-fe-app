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
  tagTypes: ["Store", "Products", "Product", "Orders", "Search"],

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
    //
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
    //
    getProducts: builder.query({
      query: ({ storeId, page, size }) => ({
        url: `/product/list`,
        method: "GET",
        params: { storeId, page, size },
      }),
      transformResponse: (response) => response.data,
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
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
    //
    getOrders: builder.query({
      query: ({ page, size }) => ({
        url: `/order/users/me/orders`,
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ orderId }) => ({
                type: "Orders",
                id: orderId,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        const existingOrderIds = new Set(
          currentCache.content.map((order) => order.orderId)
        );
        const uniqueNewItems = newItems.content.filter(
          (order) => !existingOrderIds.has(order.orderId)
        );

        currentCache.content.push(...uniqueNewItems);

        currentCache.last = newItems.last;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),
    //
    getOrderDetail: builder.query({
      query: (orderId) => ({
        url: `/order/orders/${orderId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, orderId) => [
        { type: "Orders", id: orderId },
      ],
    }),
    //
    searchStores: builder.query({
      query: ({ keyword, lat, lng, page = 0, size = 10 }) => ({
        url: `/store/near`,
        method: "GET",
        params: { keyword, lat, lng, page, size },
      }),

      // 응답 데이터 가공: 페이지네이션을 대비하여 응답 형식을 통일합니다.
      // 현재는 배열만 오므로, 이를 { content: [...] } 형태로 감싸줍니다.
      // 추후 API에서 last 프로퍼티를 주면 자동으로 처리됩니다.
      transformResponse: (response) => {
        if (Array.isArray(response.data)) {
          return {
            content: response.data,
            last: true,
          };
        }
        return response.data;
      },

      providesTags: (result) => [{ type: "Search", id: "LIST" }],

      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
        return rest;
      },

      merge: (currentCache, newItems) => {
        const existingStoreIds = new Set(
          currentCache.content.map((store) => store.storeId)
        );
        const uniqueNewItems = newItems.content.filter(
          (store) => !existingStoreIds.has(store.storeId)
        );
        currentCache.content.push(...uniqueNewItems);
        currentCache.last = newItems.last;
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),
  }),
});

export const {
  useGetStoreDetailQuery,
  useGetProductsQuery,
  useGetProductDetailQuery,
  useGetOrdersQuery,
  useGetOrderDetailQuery,
  useSearchStoresQuery,
} = apiSlice;
