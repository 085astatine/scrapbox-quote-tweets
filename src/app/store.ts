import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { DeletedTweets } from '~/lib/tweet/deleted-tweets';
import { DeletedTweetsSort, TweetSort } from '~/lib/tweet/sort-tweets';
import { Tweet } from '~/lib/tweet/tweet';
import { toArray } from '~/lib/utility';

// state
export interface State {
  tweets: Tweet[];
  trashbox: DeletedTweets[];
  selectedTweets: Tweet[];
  selectedDeletedTweets: Tweet[];
  tweetSort: TweetSort;
  deletedTweetsSort: DeletedTweetsSort;
}

const initialState: State = {
  tweets: [],
  trashbox: [],
  selectedTweets: [],
  selectedDeletedTweets: [],
  tweetSort: {
    key: 'created_time',
    order: 'desc',
  },
  deletedTweetsSort: {
    key: 'deleted_time',
    order: 'desc',
  },
};

export interface Initializer {
  tweets: Tweet[];
  trashbox: DeletedTweets[];
}

const slice = createSlice({
  name: 'clipboard',
  initialState,
  reducers: {
    initialize(state: State, action: PayloadAction<Initializer>): void {
      state.tweets = [...action.payload.tweets];
      state.trashbox = [...action.payload.trashbox];
    },
    selectTweet(state: State, action: PayloadAction<Tweet>): void {
      const exist = state.selectedTweets.find(
        (tweet) => tweet.id === action.payload.id,
      );
      if (!exist) {
        state.selectedTweets.push(action.payload);
      }
    },
    unselectTweet(state: State, action: PayloadAction<Tweet>): void {
      const index = state.selectedTweets.findIndex(
        (tweet) => tweet.id === action.payload.id,
      );
      if (index !== -1) {
        state.selectedTweets.splice(index, 1);
      }
    },
    selectAllTweets(state: State): void {
      state.selectedTweets = [...state.tweets];
    },
    unselectAllTweets(state: State): void {
      state.selectedTweets = [];
    },
    moveToTrashbox(state: State, action: PayloadAction<number>): void {
      // remove from tweets
      state.selectedTweets.forEach((target) => {
        const index = state.tweets.findIndex((tweet) => tweet.id === target.id);
        if (index !== -1) {
          state.tweets.splice(index, 1);
        }
      });
      // add to trashbox
      state.trashbox.push({
        deleted_at: action.payload,
        tweets: [...state.selectedTweets],
      });
      // clear selected tweets
      state.selectedTweets = [];
    },
    selectDeletedTweet(
      state: State,
      action: PayloadAction<Tweet | Tweet[]>,
    ): void {
      toArray(action.payload).forEach((selectedTweet) => {
        const exist = state.selectedDeletedTweets.find(
          (tweet) => tweet.id === selectedTweet.id,
        );
        if (!exist) {
          state.selectedDeletedTweets.push(selectedTweet);
        }
      });
    },
    unselectDeletedTweet(
      state: State,
      action: PayloadAction<Tweet | Tweet[]>,
    ): void {
      toArray(action.payload).forEach((selectedTweet) => {
        const index = state.selectedDeletedTweets.findIndex(
          (tweet) => tweet.id === selectedTweet.id,
        );
        if (index !== -1) {
          state.selectedDeletedTweets.splice(index, 1);
        }
      });
    },
    selectAllDeletedTweets(state: State) {
      state.selectedDeletedTweets = state.trashbox
        .map((deletedTweets) => deletedTweets.tweets)
        .flat();
    },
    unselectAllDeletedTweets(state: State) {
      state.selectedDeletedTweets = [];
    },
    restoreSelectedDeletedTweets(state: State): void {
      // restore to tweets
      state.tweets.push(...state.selectedDeletedTweets);
      // remove from trashbox
      state.trashbox = state.trashbox.reduce<DeletedTweets[]>(
        (result, element) => {
          element.tweets = element.tweets.filter((tweet) =>
            state.selectedDeletedTweets.every(
              (selected) => selected.id !== tweet.id,
            ),
          );
          if (element.tweets.length > 0) {
            result.push(element);
          }
          return result;
        },
        [],
      );
      // clear selected deleted tweets
      state.selectedDeletedTweets = [];
    },
    deleteSelectedDeletedTweets(state: State): void {
      // remove from trashbox
      state.trashbox = state.trashbox.reduce<DeletedTweets[]>(
        (result, element) => {
          element.tweets = element.tweets.filter((tweet) =>
            state.selectedDeletedTweets.every(
              (selected) => selected.id !== tweet.id,
            ),
          );
          if (element.tweets.length > 0) {
            result.push(element);
          }
          return result;
        },
        [],
      );
      // clear selected deleted tweets
      state.selectedDeletedTweets = [];
    },
    updateTweetSort(state: State, action: PayloadAction<TweetSort>): void {
      state.tweetSort = action.payload;
    },
    updateDeletedTweetsSort(
      state: State,
      action: PayloadAction<DeletedTweetsSort>,
    ): void {
      state.deletedTweetsSort = action.payload;
    },
  },
});

// actions
export const actions: Readonly<typeof slice.actions> = slice.actions;

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

export type Store = typeof store;
