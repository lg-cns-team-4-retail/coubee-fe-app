import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProducts: null,
  isQRCodeModalVisible: false,
  qrCodeOrderId: null,
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
    openQRCodeModal: (state, action) => {
      state.isQRCodeModalVisible = true;
      state.qrCodeOrderId = action.payload;
    },
    closeQRCodeModal: (state) => {
      state.isQRCodeModalVisible = false;
      state.qrCodeOrderId = null;
    },
  },
});

export const {
  selectProducts,
  clearSelectedProducts,
  openQRCodeModal,
  closeQRCodeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
