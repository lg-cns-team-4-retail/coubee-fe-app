import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/services/api";
// ---------------- AsyncThunk 정의 ----------------
// 'products/fetchProducts' 라는 액션 타입을 가집니다.
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  // thunk가 받는 인자: { storeId, page }. 컴포넌트에서 dispatch할 때 전달합니다.
  async ({ storeId, page, size }, { rejectWithValue }) => {
    try {
      // 실제 API 엔드포인트로 수정해주세요.
      const response = await axiosInstance.get(
        `/product/list?storeId=${storeId}&page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  products: [], // 상품 목록을 담을 배열
  loading: "idle", // 로딩 상태 ('idle' | 'pending' | 'succeeded' | 'failed')
  error: null, // 에러 메시지
  currentPage: 0, // 현재 페이지 번호
  isLastPage: false, // 마지막 페이지 여부
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.currentPage = 0;
      state.isLastPage = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = "succeeded";

        if (action.meta.arg.page === 0) {
          state.products = action.payload.content;
        } else {
          state.products.push(...action.payload.content);
        }
        state.currentPage = action.payload.number;
        state.isLastPage = action.payload.last;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload || "데이터를 불러오는데 실패했습니다.";
      });
  },
});

export const { clearProducts } = productsSlice.actions;

export default productsSlice.reducer;
