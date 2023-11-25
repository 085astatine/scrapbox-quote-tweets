import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { TrashboxElement } from '~/lib/clipboard';
import { Tweet } from '~/lib/tweet';
import { TweetSort } from './lib/sort-tweets';

// state
export interface State {
  tweets: Tweet[];
  selectedTweets: Tweet[];
  trashbox: TrashboxElement[];
  tweetSort: TweetSort;
}

const initialState: State = {
  tweets: [],
  selectedTweets: [],
  trashbox: [],
  tweetSort: {
    key: 'timestamp',
    order: 'desc',
  },
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
      state.tweets = [...action.payload.tweets];
      state.trashbox = [...action.payload.trashbox];
    },
    selectTweet(state: State, action: PayloadAction<Tweet>): void {
      if (
        !state.selectedTweets.find((tweet) => tweet.id === action.payload.id)
      ) {
        state.selectedTweets.push(action.payload);
      } else {
        state.selectedTweets.splice(
          state.selectedTweets.findIndex(
            (tweet) => tweet.id === action.payload.id,
          ),
          1,
        );
      }
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
