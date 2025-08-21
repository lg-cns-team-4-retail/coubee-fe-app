import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProducts: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    selectProducts: (state, action) => {
      state.selectedProducts = action.payload;
    },
    clearSelectedProducts: (state) => {
      state.selectedProducts = null;
    },
  },
});

export const { selectProducts, clearSelectedProducts } = uiSlice.actions;

export default uiSlice.reducer;
