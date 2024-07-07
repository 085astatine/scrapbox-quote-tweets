import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { StorageListenerArguments } from '~/lib/storage/listener';
import { TrashboxSort } from '~/lib/trashbox';
import {
  DeletedTweet,
  DeletedTweetID,
  Tweet,
  TweetID,
  TweetSort,
} from '~/lib/tweet/types';
import { ArrayOr, toArray } from '~/lib/utility';

export interface TweetState {
  tweets: Tweet[];
  trashbox: DeletedTweet[];
  selectedTweets: Tweet[];
  selectedDeletedTweets: Tweet[];
  tweetSort: TweetSort;
  trashboxSort: TrashboxSort;
}

const initialTweetState = (): TweetState => {
  return {
    tweets: [],
    trashbox: [],
    selectedTweets: [],
    selectedDeletedTweets: [],
    tweetSort: {
      key: 'created_time',
      order: 'desc',
    },
    trashboxSort: {
      key: 'deleted_time',
      order: 'desc',
    },
  };
};

type Initializer = Pick<TweetState, 'tweets' | 'trashbox'> &
  Partial<Pick<TweetState, 'tweetSort' | 'trashboxSort'>>;

const tweet = createSlice({
  name: 'tweet',
  initialState: initialTweetState(),
  reducers: {
    initialize(state: TweetState, action: PayloadAction<Initializer>): void {
      state.tweets = [...action.payload.tweets];
      state.trashbox = [...action.payload.trashbox];
      state.selectedTweets = [];
      state.selectedDeletedTweets = [];
      if (action.payload.tweetSort !== undefined) {
        state.tweetSort = action.payload.tweetSort;
      }
      if (action.payload.trashboxSort !== undefined) {
        state.trashboxSort = action.payload.trashboxSort;
      }
    },
    addTweet(state: TweetState, action: PayloadAction<Tweet[]>): void {
      addTweetToTweets(state.tweets, action.payload);
    },
    deleteTweet(state: TweetState, action: PayloadAction<Tweet[]>): void {
      const targets = action.payload.map((tweet) => tweet.id);
      state.tweets = removeTweetFromTweets(state.tweets, targets);
      state.trashbox = removeTweetFromDeletedTweets(state.trashbox, targets);
      state.selectedTweets = removeTweetFromTweets(
        state.selectedTweets,
        targets,
      );
      state.selectedDeletedTweets = removeTweetFromTweets(
        state.selectedDeletedTweets,
        targets,
      );
    },
    selectTweet(state: TweetState, action: PayloadAction<Tweet>): void {
      addTweetToTweets(state.selectedTweets, action.payload);
    },
    unselectTweet(state: TweetState, action: PayloadAction<Tweet>): void {
      state.selectedTweets = removeTweetFromTweets(
        state.selectedTweets,
        action.payload.id,
      );
    },
    selectAllTweets(state: TweetState): void {
      state.selectedTweets = [...state.tweets];
    },
    unselectAllTweets(state: TweetState): void {
      state.selectedTweets = [];
    },
    addToTrashbox(
      state: TweetState,
      action: PayloadAction<DeletedTweetID[]>,
    ): void {
      // seach tweet by ID
      const targets = action.payload.reduce<DeletedTweet[]>(
        (tweets, deletedTweetID) => {
          const tweet = state.tweets.find(
            (tweet) => tweet.id === deletedTweetID.tweet_id,
          );
          if (tweet !== undefined) {
            tweets.push({ deleted_at: deletedTweetID.deleted_at, tweet });
          }
          return tweets;
        },
        [],
      );
      // remove from tweets & selected tweets
      state.tweets = removeTweetFromTweets(
        state.tweets,
        action.payload.map((deletedTweet) => deletedTweet.tweet_id),
      );
      state.selectedTweets = removeTweetFromTweets(
        state.selectedTweets,
        action.payload.map((deletedTweet) => deletedTweet.tweet_id),
      );
      // add to trashbox
      addTweetToDeletedTweets(state.trashbox, targets);
    },
    deleteFromTrashbox(
      state: TweetState,
      action: PayloadAction<DeletedTweetID[]>,
    ) {
      // search tweet by ID
      const tweets = action.payload.reduce<Tweet[]>(
        (tweets, deletedTweetID) => {
          const tweet = state.trashbox.find(
            (tweet) => tweet.tweet.id === deletedTweetID.tweet_id,
          )?.tweet;
          if (tweet !== undefined) {
            tweets.push(tweet);
          }
          return tweets;
        },
        [],
      );
      // remove from trashbox & selected deleted tweet
      state.trashbox = removeTweetFromDeletedTweets(
        state.trashbox,
        action.payload.map((deletedTweet) => deletedTweet.tweet_id),
      );
      state.selectedDeletedTweets = removeTweetFromTweets(
        state.selectedDeletedTweets,
        action.payload.map((deletedTweet) => deletedTweet.tweet_id),
      );
      // add to tweets
      if (tweets.length > 0) {
        addTweetToTweets(state.tweets, tweets);
      }
    },
    selectDeletedTweet(
      state: TweetState,
      action: PayloadAction<ArrayOr<Tweet>>,
    ): void {
      addTweetToTweets(state.selectedDeletedTweets, action.payload);
    },
    unselectDeletedTweet(
      state: TweetState,
      action: PayloadAction<ArrayOr<Tweet>>,
    ): void {
      state.selectedDeletedTweets = removeTweetFromTweets(
        state.selectedDeletedTweets,
        toArray(action.payload).map((tweet) => tweet.id),
      );
    },
    selectAllDeletedTweets(state: TweetState) {
      state.selectedDeletedTweets = state.trashbox.map(
        (deletedTweet) => deletedTweet.tweet,
      );
    },
    unselectAllDeletedTweets(state: TweetState) {
      state.selectedDeletedTweets = [];
    },
    updateTweetSort(state: TweetState, action: PayloadAction<TweetSort>): void {
      state.tweetSort = action.payload;
    },
    updateTrashboxSort(
      state: TweetState,
      action: PayloadAction<TrashboxSort>,
    ): void {
      state.trashboxSort = action.payload;
    },
  },
});

// reducer
export const tweetReducer = tweet.reducer;

// actions
export const tweetActions: Readonly<typeof tweet.actions> = tweet.actions;

// storage listener
export const tweetStorageListener = (
  args: StorageListenerArguments,
  dispatch: Dispatch,
): void => {
  // tweet: added
  if (args.tweet?.added?.length) {
    dispatch(tweetActions.addTweet(args.tweet.added));
  }
  // tweet: deleted
  if (args.tweet?.deleted?.length) {
    dispatch(tweetActions.deleteTweet(args.tweet.deleted));
  }
  // trashbox: added
  if (args.trashbox?.added?.length) {
    dispatch(tweetActions.addToTrashbox(args.trashbox.added));
  }
  // trashbox: deleted
  if (args.trashbox?.deleted?.length) {
    dispatch(tweetActions.deleteFromTrashbox(args.trashbox.deleted));
  }
};

// utilities
const addTweetToTweets = (tweets: Tweet[], target: ArrayOr<Tweet>): void => {
  toArray(target).forEach((target) => {
    // check if tweet already exists
    if (tweets.every((tweet) => tweet.id !== target.id)) {
      tweets.push(target);
    }
  });
};

const addTweetToDeletedTweets = (
  deletedTweets: DeletedTweet[],
  target: ArrayOr<DeletedTweet>,
): void => {
  toArray(target).forEach((target) => {
    // check if tweet already exists
    if (
      deletedTweets.every(
        (deletedTweet) => deletedTweet.tweet.id !== target.tweet.id,
      )
    ) {
      deletedTweets.push(target);
    }
  });
};

const removeTweetFromTweets = (
  tweets: Tweet[],
  target: ArrayOr<TweetID>,
): Tweet[] => {
  const targets = toArray(target);
  // check if targets in tweets
  const tweetIDs = tweets.map((tweet) => tweet.id);
  if (targets.every((tweetID) => !tweetIDs.includes(tweetID))) {
    return tweets;
  }
  return tweets.filter((tweet) =>
    targets.every((tweetID) => tweetID !== tweet.id),
  );
};

const removeTweetFromDeletedTweets = (
  deletedTweets: DeletedTweet[],
  target: ArrayOr<TweetID>,
): DeletedTweet[] => {
  const targets = toArray(target);
  // check if targets in tweets
  const tweetIDs = deletedTweets.map((deletedTweet) => deletedTweet.tweet.id);
  if (targets.every((tweetID) => !tweetIDs.includes(tweetID))) {
    return deletedTweets;
  }
  return deletedTweets.filter((deletedTweet) =>
    targets.every((tweetID) => tweetID !== deletedTweet.tweet.id),
  );
};
