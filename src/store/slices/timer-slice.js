import { createSlice } from '@reduxjs/toolkit';

const saveStateToLocalStorage = (state) => {
  localStorage.setItem('timerState', JSON.stringify({
    currentProjectId: state.currentProjectId,
    isRunning: state.isRunning,
    seconds: state.seconds,
    startTime: state.startTime, 
  }));
};

export const loadTimerState = () => {
  const saved = localStorage.getItem('timerState');
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
}

const initialState = { 
  currentProjectId: null, 
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
      saveStateToLocalStorage(state);
    },
    startTimer: (state) => {
      state.isRunning = true;
      state.startTime = Date.now() - state.seconds * 1000;
      saveStateToLocalStorage(state);
    },
    pauseTimer: (state) => {
      state.isRunning = false;
      saveStateToLocalStorage(state); 
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.seconds = 0;
      state.startTime = null;
      localStorage.removeItem('timerState');
    },
    tick: (state) => {
      if (state.isRunning) {
        state.seconds = Math.floor((Date.now() - state.startTime)/ 1000);
        saveStateToLocalStorage(state);
      }
    },
    restoreTimer: (state, action) => {
      return { ...state, ...action.payload };
    },
    syncTimer: (state, action) => {
      state.seconds = action.payload; 
      state.startTime = Date.now() - state.seconds * 1000;
      saveStateToLocalStorage(state);
    },
  },
});

export const { 
  setCurrentProject, 
  startTimer, 
  pauseTimer, 
  resetTimer, 
  tick,
  restoreTimer, 
  syncTimer,
} = timerSlice.actions;

export default timerSlice.reducer;