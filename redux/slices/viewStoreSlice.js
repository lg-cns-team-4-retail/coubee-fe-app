import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/services/api";

export const viewStoreDetail = createAsyncThunk(
  "store/viewStoreDetail",
  async (storeId, { rejectWithValue }) => {
    console.log(storeId);
    try {
      const response = await axiosInstance.get(`/store/detail/${storeId}`);
      if (response.data.code === "OK") {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "상점 정보 조회 실패");
      }
    } catch (error) {
      console.error("API Error Response:", error.response.data);
      return rejectWithValue(
        error.response.data.message || "상점 정보 조회 중 오류 발생"
      );
    }
  }
);

const viewStoreSlice = createSlice({
  name: "viewStore",
  initialState: {
    loading: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
    storeData: null,
    error: null,
    message: "",
  },
  reducers: {
    resetViewStoreStatus: (state) => {
      state.loading = "idle";
      state.storeData = null;
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(viewStoreDetail.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(viewStoreDetail.fulfilled, (state, action) => {
        console.log(action.payload, "slice check");
        state.loading = "succeeded";
        state.storeData = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(viewStoreDetail.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetViewStoreStatus } = viewStoreSlice.actions;

export default viewStoreSlice.reducer;
