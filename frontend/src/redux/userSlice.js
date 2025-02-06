import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  openSignIn: false,
  openSignUp: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setSignInOpen: (state, action) => {
      state.openSignIn = action.payload;
    },
    setSignUpOpen: (state, action) => {
      state.openSignUp = action.payload;
    },
  },
});

export const { setUser, setSignInOpen, setSignUpOpen } = userSlice.actions;
export default userSlice.reducer;
