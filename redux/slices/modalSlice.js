import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  title: "",
  message: "",
  onConfirm: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.onConfirm = action.payload.onConfirm;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = "";
      state.message = "";
      state.onConfirm = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export const selectOnConfirm = (state) => state.modal.onConfirm;

export default modalSlice.reducer;
