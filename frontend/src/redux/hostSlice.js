import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  host: null,
  openSignIn: false,
  openSignUp: false,
  otpDialogOpen: false,
};

const hostSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    setHost: (state, action) => {
      state.host = action.payload;
    },
    setSignInOpen: (state, action) => {
      state.openSignIn = action.payload;
    },
    setSignUpOpen: (state, action) => {
      state.openSignUp = action.payload;
    },
    setOtpDialogOpen: (state, action) => {
      state.otpDialogOpen = action.payload;
    },
  },
});

export const { setHost } = hostSlice.actions;
export default hostSlice.reducer;
