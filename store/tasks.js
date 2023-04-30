import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'Tasks',
  initialState: {
    tasks: []
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload.tasks);
    },
    removeTask: (state, action) => {
      state.tasks.splice(state.tasks.indexOf(action.payload.tasks), 1);
    }
  }
});

export const addTask = tasksSlice.actions.addTask;
export const removeTask = tasksSlice.actions.removeTask;
export default tasksSlice.reducer;