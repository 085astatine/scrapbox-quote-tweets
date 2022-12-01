import { configureStore } from '@reduxjs/toolkit';
import { stateSlice } from './state';

export const store = configureStore({
  reducer: stateSlice.reducer,
});
