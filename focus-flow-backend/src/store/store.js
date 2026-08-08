import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user-slice';
import projectsReducer from './slices/projects-slice';
import timerReducer from './slices/timer-slice';
import timeSessionsReducer from './slices/time-sessions-slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectsReducer,
    timer: timerReducer,
    timeSessions: timeSessionsReducer,
  },
});