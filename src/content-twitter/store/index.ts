import { configureStore } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import type browser from 'webextension-polyfill';
import { logger } from '~/lib/logger';
import { onChangedTweet } from '~/lib/storage/tweet';
import { tweetActions, tweetReducer, tweetStorageListener } from './tweet';

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
    tweet: tweetReducer,
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

// storage listener
export const storageListener = (
  changes: browser.Storage.StorageAreaOnChangedChangesType,
): void => {
  logger.debug('storage changes', changes);
  const args = {
    ...onChangedTweet(changes),
  };
  logger.debug('listener arguments', args);
  // tweet
  tweetStorageListener(args, store.dispatch);
};
