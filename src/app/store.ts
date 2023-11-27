import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { DeletedTweets, Tweet, TweetSort } from '~/lib/tweet';
import { toArray } from '~/lib/utility';

// state
export interface State {
  tweets: Tweet[];
  trashbox: DeletedTweets[];
  selectedTweets: Tweet[];
  selectedDeletedTweets: Tweet[];
  tweetSort: TweetSort;
}

const initialState: State = {
  tweets: [],
  trashbox: [],
  selectedTweets: [],
  selectedDeletedTweets: [],
  tweetSort: {
    key: 'timestamp',
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
        timestamp: action.payload,
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
    updateTweetSort(state: State, action: PayloadAction<TweetSort>): void {
      state.tweetSort = action.payload;
    },
  },
});

// actions
export const {
  initialize: initializeAction,
  selectTweet: selectTweetAction,
  unselectTweet: unselectTweetAction,
  selectAllTweets: selectAllTweetsAction,
  unselectAllTweets: unselectAllTweetsAction,
  moveToTrashbox: moveToTrashboxAction,
  selectDeletedTweet: selectDeletedTweetAction,
  unselectDeletedTweet: unselectDeletedTweetAction,
  updateTweetSort: updateTweetSortAction,
} = slice.actions;

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
