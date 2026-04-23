import { createSlice } from '@reduxjs/toolkit';

const initialState = { currentProject: null, isRunning: false, seconds: 0 };

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {},
});

export default timerSlice.reducer;