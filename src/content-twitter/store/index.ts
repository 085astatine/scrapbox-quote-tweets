import { configureStore } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { tweet, tweetActions } from './tweet';

// store
const middlewares: Middleware[] = [];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(
    createLogger({
      collapsed: true,
      diff: true,
    }),
  );
}

export const store = configureStore({
  reducer: {
    tweet: tweet.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...middlewares),
});

export type Store = typeof store;

export type State = ReturnType<typeof store.getState>;

// action
export const actions = {
  tweet: tweetActions,
} as const;
