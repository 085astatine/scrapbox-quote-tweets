import { configureStore } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { StorageListenerArguments } from '~/lib/storage/listener';
import { loadSettings } from '~/lib/storage/settings';
import { loadTrashbox, loadTweetsNotInTrashbox } from '~/lib/storage/trashbox';
import { loadTrashboxSort, loadTweetSort } from '~/lib/storage/tweet-sort';
import {
  settingsActions,
  settingsReducer,
  settingsStorageListener,
} from './settings';
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
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...middlewares),
});

export type Store = typeof store;

export type State = ReturnType<typeof store.getState>;

export const actions = {
  tweet: tweetActions,
  settings: settingsActions,
} as const;

export const storageListener = (args: StorageListenerArguments): void => {
  tweetStorageListener(args, store.dispatch);
  settingsStorageListener(args, store.dispatch);
};

// Initialize store with data loaded from storage
export const initializeStoreWithStorage = async (): Promise<void> => {
  // initialize tweet
  const tweets = await loadTweetsNotInTrashbox();
  const trashbox = await loadTrashbox();
  const tweetSort = await loadTweetSort();
  const trashboxSort = await loadTrashboxSort();
  store.dispatch(
    actions.tweet.initialize({
      tweets,
      trashbox,
      ...(tweetSort !== null && { tweetSort }),
      ...(trashboxSort !== null && { trashboxSort }),
    }),
  );
  // initialize settings
  const settings = await loadSettings();
  store.dispatch(actions.settings.initialize(settings));
};
