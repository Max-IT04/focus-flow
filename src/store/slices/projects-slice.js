import { createSlice } from '@reduxjs/toolkit';

const initialState = { projects: [], loading: false };

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
});

export default projectsSlice.reducer;