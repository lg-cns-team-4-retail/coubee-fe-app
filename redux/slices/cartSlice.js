import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  storeId: null,
  totalOriginPrice: 0,
  totalSalePrice: 0,
  totalQuantity: 0,
  hotdeal: null,
};

const recalculateTotals = (state) => {
  state.totalQuantity = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  state.totalOriginPrice = state.items.reduce(
    (sum, item) => sum + item.originPrice * item.quantity,
    0
  );
  state.totalSalePrice = state.items.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );
  if (state.items.length === 0) {
    state.storeId = null;
    state.hotdeal = null;
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { hotdeal, ...newItemData } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === newItemData.productId
      );

      if (existingItem) {
        existingItem.quantity += newItemData.quantity;
      } else {
        state.items.push({ ...newItemData });
      }

      state.storeId = newItemData.storeId;
      state.hotdeal = hotdeal;
      recalculateTotals(state);
    },

    removeItem: (state, action) => {
      const { productId } = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
      recalculateTotals(state);
    },
    increaseQuantity: (state, action) => {
      const { productId } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity++;
        recalculateTotals(state);
      }
    },
    decreaseQuantity: (state, action) => {
      const { productId } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item && item.quantity > 1) {
        item.quantity--;
        recalculateTotals(state);
      }
    },
    clearCart: (state) => {
      return initialState;
    },

    replaceCart: (state, action) => {
      // addItem과 동일한 로직을 적용합니다.
      const { hotdeal, ...newItemData } = action.payload;

      state.items = [{ ...newItemData }];
      state.storeId = newItemData.storeId;
      state.hotdeal = hotdeal;
      recalculateTotals(state);
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  replaceCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
// selector 로직 수정
export const selectTotalQuantity = (state) => state.cart.totalQuantity;
