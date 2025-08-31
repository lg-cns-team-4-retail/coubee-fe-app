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
  tagTypes: ["Store", "Products", "Product", "Orders"],

  endpoints: (builder) => ({
    toggleInterest: builder.mutation({
      query: (storeId) => ({
        url: `/store/interest/${storeId}`,
        method: "POST",
      }),
      //  기존 invalidatesTags 대신 onQueryStarted를 사용합니다.
      async onQueryStarted(storeId, { dispatch, queryFulfilled, getState }) {
        // 현재 활성화된 searchStores 쿼리의 인자(arguments)를 찾습니다.
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
              // 캐시를 어떻게 업데이트할지에 대한 로직
              // 캐시된 데이터에서 현재 상점을 찾습니다.
              const store = draft.content.find((s) => s.storeId == storeId);
              if (store) {
                // '좋아요' 상태를 반전시킵니다.
                store.interest = !store.interest;
              }
            }
          )
        );

        try {
          // 뮤테이션이 성공적으로 완료되기를 기다립니다.
          await queryFulfilled;
        } catch {
          // 실패 시, Optimistic Update를 되돌립니다.
          patchResult.undo();
        }
      },
      // 목록 캐시는 직접 업데이트하므로, 상세 정보 캐시만 무효화합니다.
      invalidatesTags: (result, error, storeId) => [
        { type: "Store", id: storeId },
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
} = apiSlice;
