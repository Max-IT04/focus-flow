import { createSlice } from '@reduxjs/toolkit';

const initialState = { projects: [], loading: false };

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    }, 
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.projects[index] = action.payload;
    },
    removeProject: (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { 
  setProjects, 
  addProject, 
  updateProject, 
  removeProject, 
  setLoading 
} = projectsSlice.actions;
export default projectsSlice.reducer;