import { createSlice } from "@reduxjs/toolkit";
import { router } from "expo-router";

const initialState = {
  keyword: "",
  inputValue: "",
  activeTab: "store",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchState: (state, action) => {
      state.keyword = action.payload.keyword;
      state.inputValue = action.payload.inputValue;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearSearchState: (state) => {
      state.keyword = initialState.keyword;
      state.inputValue = initialState.inputValue;
      state.activeTab = initialState.activeTab;
      router.replace("/(tabs)");
    },
  },
});

export const { setSearchState, setActiveTab, clearSearchState } =
  searchSlice.actions;

export default searchSlice.reducer;
