import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { TrashboxElement } from '~/lib/clipboard';
import { Tweet, TweetSort } from '~/lib/tweet';

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
