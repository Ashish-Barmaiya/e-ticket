import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import hostReducer from "./hostSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    host: hostReducer,
  },
});

export default store;
