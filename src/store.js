import { configureStore } from "@reduxjs/toolkit";
import citiesReducer from "./slices/cities";

const reducer = {
  data: citiesReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
