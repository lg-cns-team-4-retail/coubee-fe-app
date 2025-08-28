import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  title: "",
  message: "",
  type: "default", // 'success', 'error', 'warning'
  onConfirm: null,
  onCancel: null,
  confirmText: "확인",
  cancelText: "취소",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { payload } = action;
      state.isOpen = true;
      state.title = payload.title;
      state.message = payload.message;
      state.onConfirm = payload.onConfirm;
      state.type = payload.type || initialState.type;
      state.onCancel = payload.onCancel || initialState.onCancel;
      state.confirmText = payload.confirmText || initialState.confirmText;
      state.cancelText = payload.cancelText || initialState.cancelText;
    },
    closeModal: (state) => {
      state.isOpen = false;
      Object.assign(state, { ...initialState, isOpen: false });
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export const selectOnConfirm = (state) => state.modal.onConfirm;

export default modalSlice.reducer;
