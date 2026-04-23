import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  session: null,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.session = null;
      state.user = null;
    },
  },
});

export const { setSession, setUser, logout } = userSlice.actions;
export const selectUserSession = (state) => state.user.session;
export const selectUser = (state) => state.user.user;

export default userSlice.reducer;