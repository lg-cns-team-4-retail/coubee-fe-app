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
      // action.payload에 반드시 availableStock (가용 재고)이 포함.
      const { hotdeal, ...newItemData } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === newItemData.productId
      );

      if (existingItem) {
        //  이미 상품이 있을 경우, 재고를 넘지 않도록 수량을 제한합니다.
        const newQuantity = existingItem.quantity + newItemData.quantity;
        // 기존 상품의 availableStock을 사용해야 하므로, 처음 추가 시 저장되는지 확인.
        existingItem.quantity = Math.min(
          newQuantity,
          existingItem.availableStock
        );
      } else {
        //  새 상품을 추가할 때도 재고를 넘지 않도록 합니다.
        const quantityToAdd = Math.min(
          newItemData.quantity,
          newItemData.availableStock
        );
        state.items.push({ ...newItemData, quantity: quantityToAdd });
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

      // 수량 증가 시, 저장된 availableStock과 비교하여 재고를 초과하지 못하게.
      if (item && item.quantity < item.availableStock) {
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
      const { hotdeal, ...newItemData } = action.payload;
      // 다른 가게 상품으로 교체할 때도 재고 확인.
      const quantityToAdd = Math.min(
        newItemData.quantity,
        newItemData.availableStock
      );

      state.items = [{ ...newItemData, quantity: quantityToAdd }];
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
export const selectTotalQuantity = (state) => state.cart.totalQuantity;
