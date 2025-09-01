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
    toggleInterest: builder.mutation({
      query: (storeId) => ({
        url: `/store/interest/${storeId}`,
        method: "POST",
      }),
      async onQueryStarted(storeId, { dispatch, queryFulfilled, getState }) {
        const state = getState();
        const activeSearchQuery = Object.values(state.api.queries).find(
          (query) =>
            query.endpointName === "searchStores" &&
            query.status === "fulfilled"
        );

        if (!activeSearchQuery) {
          return;
        }

        const { originalArgs } = activeSearchQuery;

        // searchStores 캐시를 직접 업데이트합니다.
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "searchStores", // 업데이트할 엔드포인트
            originalArgs, // 해당 엔드포인트의 인자
            (draft) => {
              const store = draft.content.find((s) => s.storeId == storeId);
              if (store) {
                // '좋아요' 상태를 반전시킵니다.
                store.interest = !store.interest;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, storeId) => [
        { type: "Store", id: storeId },
      ],
    }),

    cancelOrder: builder.mutation({
      query: ({ orderId, reason }) => ({
        url: `/order/orders/${orderId}/cancel`,
        method: "POST",
        data: { cancelReason: reason },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Orders", id: orderId },
        { type: "Orders", id: "LIST" },
      ],
    }),

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
    //키워드로 상점내 검색 api
    getProductsInStore: builder.query({
      query: ({ storeId, keyword, page = 0, size = 10 }) => ({
        url: `/product/list`,
        method: "GET",
        params: { storeId, keyword, page, size },
      }),
      transformResponse: (response) => response.data,
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
        // page를 제외한 인자(storeId, keyword)가 같으면 같은 쿼리로 취급합니다.
        return rest;
      },
      merge: (currentCache, newItems) => {
        // 새로운 페이지의 데이터를 기존 content 배열에 추가합니다.
        if (newItems.content) {
          currentCache.content.push(...newItems.content);
        }
        // 마지막 페이지 여부를 업데이트합니다.
        currentCache.last = newItems.last;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
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
      refetchOnFocus: true,
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 0) {
          return newItems;
        }
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
      // 1. 상세 페이지에 들어올 때마다 항상 최신 정보를 가져옵니다.
      refetchOnMountOrArgChange: true,
      // 2. 다른 앱을 보다가 다시 돌아왔을 때도 최신 정보를 가져옵니다.
      refetchOnFocus: true,
      // 3. 화면을 보고 있는 동안 15초마다 자동으로 정보를 업데이트합니다.
      pollingInterval: 15000,
    }),

    //
    searchStores: builder.query({
      query: ({ keyword, lat, lng, page = 0, size = 10 }) => ({
        url: `/store/near`,
        method: "GET",
        params: { keyword, lat, lng, page, size },
      }),
      transformResponse: (response) => {
        if (Array.isArray(response.data)) {
          return {
            content: response.data,
            last: true,
          };
        }
        return response.data;
      },

      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ storeId }) => ({
                type: "Store",
                id: storeId,
              })),
              { type: "Search", id: "LIST" },
            ]
          : [{ type: "Search", id: "LIST" }],

      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
        return rest;
      },

      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 0) {
          return newItems;
        }

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
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.keyword !== previousArg?.keyword
        );
      },
    }),
    searchProducts: builder.query({
      query: ({ keyword, lat, lng, page = 0, size = 10 }) => ({
        url: `/product/search/es`,
        method: "GET",
        params: { keyword, latitude: lat, longitude: lng, page, size },
      }),

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
        const existingProductIds = new Set(
          currentCache.content.map((product) => product.productId)
        );
        const uniqueNewItems = newItems.content.filter(
          (product) => !existingProductIds.has(product.productId)
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
  useSearchProductsQuery,
  useToggleInterestMutation,
  useGetProductsInStoreQuery,
  useCancelOrderMutation,
} = apiSlice;
