import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  storeId: null,
  totalOriginPrice: 0,
  totalSalePrice: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      // ... (기존 addItem 로직은 그대로 유지) ...
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === newItem.productId
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push({ ...newItem });
      }

      // 합계 재계산 로직
      const recalculateTotals = (s) => {
        s.totalQuantity = s.items.reduce((sum, item) => sum + item.quantity, 0);
        s.totalOriginPrice = s.items.reduce(
          (sum, item) => sum + item.originPrice * item.quantity,
          0
        );
        s.totalSalePrice = s.items.reduce(
          (sum, item) => sum + item.salePrice * item.quantity,
          0
        );
        if (s.items.length === 0) {
          s.storeId = null;
        }
      };

      state.storeId = newItem.storeId;
      recalculateTotals(state);
    },

    removeItem: (state, action) => {
      const { productId } = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);

      // 합계 재계산
      const recalculateTotals = (s) => {
        s.totalQuantity = s.items.reduce((sum, item) => sum + item.quantity, 0);
        s.totalOriginPrice = s.items.reduce(
          (sum, item) => sum + item.originPrice * item.quantity,
          0
        );
        s.totalSalePrice = s.items.reduce(
          (sum, item) => sum + item.salePrice * item.quantity,
          0
        );
        if (s.items.length === 0) {
          s.storeId = null;
        }
      };
      recalculateTotals(state);
    },

    increaseQuantity: (state, action) => {
      const { productId } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity++;
        state.totalQuantity++;
        state.totalOriginPrice += item.originPrice;
        state.totalSalePrice += item.salePrice;
      }
    },

    decreaseQuantity: (state, action) => {
      const { productId } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item && item.quantity > 1) {
        item.quantity--;
        state.totalQuantity--;
        state.totalOriginPrice -= item.originPrice;
        state.totalSalePrice -= item.salePrice;
      }
    },

    clearCart: (state) => {
      // initialState를 반환하여 완전히 초기화
      return initialState;
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
// selector 로직 수정
export const selectTotalQuantity = (state) => state.cart.totalQuantity;
