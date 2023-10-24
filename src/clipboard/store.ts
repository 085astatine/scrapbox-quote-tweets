import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { TrashboxElement } from '~/lib/clipboard';
import { Tweet } from '~/lib/tweet';

export interface State {
  tweets: Tweet[];
  trashbox: TrashboxElement[];
}

const initialState: State = {
  tweets: [],
  trashbox: [],
};

export interface Initializer {
  tweets: Tweet[];
  trashbox: TrashboxElement[];
}

const slice = createSlice({
  name: 'clipboard',
  initialState,
  reducers: {
    initialize(state: State, action: PayloadAction<Initializer>): void {
      state.tweets = action.payload.tweets;
      state.trashbox = action.payload.trashbox;
    },
  },
});

// actions
export const { initialize: initializeAction } = slice.actions;

// store
const middlewares: Middleware<State>[] = [];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(
    createLogger({
      collapsed: true,
      diff: true,
    }),
  );
}

export const store = configureStore({
  reducer: slice.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...middlewares),
});
