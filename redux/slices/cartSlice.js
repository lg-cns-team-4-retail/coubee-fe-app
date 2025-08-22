import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  storeId: null,
  originPrice: 0,
  salePrice: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * 장바구니에 상품을 추가합니다. 이미 있는 상품이면 수량을 더합니다.
     * @param payload {{ productId: number, quantity: number }}
     */
    addItem: (state, action) => {
      const item = {
        productId: action.payload.productId,
        productName: action.payload.productName,
        description: action.payload.description,
        productImg: action.payload.productImg,
        quantity: action.payload.quantity,
      };

      const productExists =
        state.items.length > 0
          ? state.items.find(
              (item) => item.productId === action.payload.productId
            )
          : null;

      if (productExists) {
        productExists.quantity += action.payload.quantity;
      } else {
        state.items.push(item);
      }

      state.storeId = action.payload.storeId;
      state.originPrice += action.payload.originPrice;
      state.salePrice += action.payload.salePrice;
      state.totalQuantity += action.payload.quantity;
    },
    /**
     * 장바구니에서 상품을 완전히 제거합니다.
     * @param payload {{ productId: number }}
     */
    removeItem: (state, action) => {
      const { productId } = action.payload;
      delete state.items[productId];
    },
    /**
     * 특정 상품의 수량을 1 증가시킵니다.
     * @param payload {{ productId: number }}
     */
    increaseQuantity: (state, action) => {
      const { productId } = action.payload;
      if (state.items[productId]) {
        state.items[productId]++;
      }
    },

    decreaseQuantity: (state, action) => {
      const { productId } = action.payload;
      if (state.items[productId]) {
        state.items[productId]--;
        if (state.items[productId] <= 0) {
          delete state.items[productId];
        }
      }
    },
    clearCart: (state) => {
      state.items = {};
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
export const selectTotalQuantity = (state) => {
  return Object.values(state.cart.items).reduce(
    (total, quantity) => total + quantity,
    0
  );
};
