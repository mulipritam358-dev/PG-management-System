import { configureStore } from "@reduxjs/toolkit";
import CounterSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    Counter: CounterSlice,
  },
});