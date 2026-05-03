import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessions: [],
  loading: false,
};

const timeSessionsSlice = createSlice({
  name: 'timeSessions',
  initialState,
  reducers: {
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    addSession: (state, action) => {
      state.sessions.push(action.payload);
    },
    removeSession: (state, action) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { 
  setSessions, 
  addSession,
  removeSession,
  setLoading
} = timeSessionsSlice.actions;
export default timeSessionsSlice.reducer;