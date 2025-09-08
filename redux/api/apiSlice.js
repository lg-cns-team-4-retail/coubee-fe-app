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
        let searchPatchResult;
        let interestStorePatchResult;

        const state = getState();
        const activeSearchQuery = Object.values(state.api.queries).find(
          (query) =>
            query.endpointName === "searchStores" &&
            query.status === "fulfilled"
        );

        if (activeSearchQuery) {
          const { originalArgs } = activeSearchQuery;
          searchPatchResult = dispatch(
            apiSlice.util.updateQueryData(
              "searchStores",
              originalArgs,
              (draft) => {
                const store = draft.content.find((s) => s.storeId == storeId);
                if (store) {
                  store.interest = !store.interest;
                }
              }
            )
          );
        }

        const activeInterestQuery = Object.values(state.api.queries).find(
          (query) =>
            query.endpointName === "getInterestStore" &&
            query.status === "fulfilled"
        );

        if (activeInterestQuery) {
          interestStorePatchResult = dispatch(
            apiSlice.util.updateQueryData(
              "getInterestStore",
              undefined,
              (draft) => {
                const storeIndex = draft.findIndex((s) => s.storeId == storeId);
                if (storeIndex !== -1) {
                  draft.splice(storeIndex, 1);
                }
              }
            )
          );
        }
        try {
          await queryFulfilled;
        } catch {
          //실패시 undo용
          searchPatchResult?.undo();
          interestStorePatchResult?.undo();
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
        return rest;
      },
      merge: (currentCache, newItems) => {
        if (newItems.content) {
          currentCache.content.push(...newItems.content);
        }
        currentCache.last = newItems.last;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),
    //오더 조회 전체
    getOrders: builder.query({
      query: ({ page, size, keyword }) => ({
        url: `/order/users/me/orders`,
        method: "GET",
        params: { page, size, keyword },
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

      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { page, ...rest } = queryArgs;
        return `${endpointName}-${JSON.stringify(rest)}`;
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
        return currentArg !== previousArg;
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
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
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
    //
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

      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 0) {
          return newItems;
        }
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
    //최종 금액 할인율 보여주기
    getTotalDiscount: builder.query({
      query: (productId) => ({
        url: `/order/users/me/summary`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) => [{ type: "Product", id: result }],
    }),
    //아이테 추천 personalize base
    getRecommendedProduct: builder.query({
      query: (productId) => ({
        url: `/product/personalize/recommend`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) => [{ type: "Product", id: result }],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }),
    //관심 매장 조회용
    getInterestStore: builder.query({
      query: (productId) => ({
        url: `/store/interest/my`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) => [{ type: "Store", id: result }],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }),
    //비로그인용 주변 가장 많이 팔린 물품목록
    getPopularProduct: builder.query({
      query: ({ keyword, lat, lng, page = 0, size = 10 }) => ({
        url: `/order/products/bestsellers-nearby`,
        method: "GET",
        params: { latitude: lat, longitude: lng, page, size },
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

      /*       merge: (currentCache, newItems) => {
        currentCache.content.push(...newItems.content);
        currentCache.last = newItems.last;
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      }, */
    }),
    //유저 주변에 인기 있는 매장용
    getPopularInterestStore: builder.query({
      query: ({ lat, lng }) => ({
        url: `/store/near/interest`,
        method: "GET",
        params: { lat, lng },
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) => [{ type: "Store", id: result }],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
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
  useGetTotalDiscountQuery,
  useGetRecommendedProductQuery,
  useGetInterestStoreQuery,
  useGetPopularProductQuery,
  useGetPopularInterestStoreQuery,
} = apiSlice;
