import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

import { apiSlice } from "./api/apiSlice";
import uiReducer from "./slices/uiSlice";
import cartReducer from "./slices/cartSlice";
import modalReducer from "./slices/modalSlice";

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  ui: uiReducer,
  cart: cartReducer,
  modal: modalReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["ui", "cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: false,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ["payload.onConfirm", "payload.onCancel"],
        ignoredPaths: ["modal.onConfirm", "modal.onCancel"],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
