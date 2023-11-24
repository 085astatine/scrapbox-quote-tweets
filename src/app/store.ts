import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { TrashboxElement } from '~/lib/clipboard';
import { Tweet } from '~/lib/tweet';

// state
export type TweetSortKey = 'timestamp' | 'username';
export type SortOrder = 'asc' | 'desc';

export interface TweetSort {
  key: TweetSortKey;
  order: SortOrder;
}

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
      state.tweets.sort(tweetSortFunction(state.tweetSort));
    },
    selectTweet(state: State, action: PayloadAction<Tweet>): void {
      if (
        !state.selectedTweets.find((tweet) => tweet.id === action.payload.id)
      ) {
        state.selectedTweets.push(action.payload);
        state.selectedTweets.sort(tweetSortFunction(state.tweetSort));
      } else {
        state.selectedTweets.splice(
          state.selectedTweets.findIndex(
            (tweet) => tweet.id === action.payload.id,
          ),
          1,
        );
      }
    },
  },
});

// actions
export const { initialize: initializeAction, selectTweet: selectTweetAction } =
  slice.actions;

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

// sort tweets
const tweetSortFunction = ({
  key,
  order,
}: TweetSort): ((lhs: Tweet, rhs: Tweet) => number) => {
  const sign = order === 'asc' ? +1 : -1;
  switch (key) {
    case 'timestamp':
      return (lhs: Tweet, rhs: Tweet) => sign * (lhs.timestamp - rhs.timestamp);
    case 'username': {
      const compareString = new Intl.Collator().compare;
      return (lhs: Tweet, rhs: Tweet) => {
        const compareUsername = compareString(
          lhs.author.username,
          rhs.author.username,
        );
        // if the usenames are equal, the newest first
        return compareUsername !== 0
          ? sign * compareUsername
          : rhs.timestamp - lhs.timestamp;
      };
    }
    default: {
      const _: never = key;
      return _;
    }
  }
};
