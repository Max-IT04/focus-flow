import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
  currentProject: null, 
  isRunning: false, 
  seconds: 0,
  startTime: null, 
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProjectId = action.payload;
    },
    startTimer: (state) => {
      state.isRunning = true;
      state.startTime = Date.now() - state.seconds * 1000;
    },
    pauseTimer: (state) => {
      state.isRunning = false; 
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.seconds = 0;
      state.startTime = null;
    },
    tick: (state) => {
      if (state.isRunning) {
        state.seconds = Math.floor((Date.now() - state.startTime)/ 1000);
      }
    },
  },
});

export const { 
  setCurrentProject, 
  startTimer, 
  pauseTimer, 
  resetTimer, 
  tick 
} = timerSlice.actions;

export default timerSlice.reducer;