import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './tasks'

export const store = configureStore({
  reducer: {
    tasks: taskReducer
  }
});