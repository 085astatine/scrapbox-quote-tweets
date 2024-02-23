import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { StorageListenerArguments } from '~/lib/storage/listener';
import { DeletedTweet, Tweet, TweetID } from '~/lib/tweet/types';
import { toArray } from '~/lib/utility';

export interface TweetState {
  tweets: Tweet[];
  trashbox: DeletedTweet[];
  selectedTweets: Tweet[];
  selectedDeletedTweets: Tweet[];
}

const initialTweetState = (): TweetState => {
  return {
    tweets: [],
    trashbox: [],
    selectedTweets: [],
    selectedDeletedTweets: [],
  };
};

export const tweet = createSlice({
  name: 'tweet',
  initialState: initialTweetState(),
  reducers: {
    initialize(
      state: TweetState,
      action: PayloadAction<{ tweets: Tweet[]; trashbox: DeletedTweet[] }>,
    ): void {
      state.tweets = [...action.payload.tweets];
      state.trashbox = [...action.payload.trashbox];
      state.selectedTweets = [];
      state.selectedDeletedTweets = [];
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
    moveToTrashbox(state: TweetState, action: PayloadAction<number>): void {
      // remove from tweets
      state.tweets = removeTweetFromTweets(
        state.tweets,
        state.selectedTweets.map((tweet) => tweet.id),
      );
      // add to trashbox
      addTweetToDeletedTweets(
        state.trashbox,
        state.selectedTweets.map((tweet) => ({
          deleted_at: action.payload,
          tweet,
        })),
      );
      // clear selected tweets
      state.selectedTweets = [];
    },
    selectDeletedTweet(
      state: TweetState,
      action: PayloadAction<Tweet | Tweet[]>,
    ): void {
      addTweetToTweets(state.selectedDeletedTweets, action.payload);
    },
    unselectDeletedTweet(
      state: TweetState,
      action: PayloadAction<Tweet | Tweet[]>,
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
    restoreSelectedDeletedTweets(state: TweetState): void {
      // restore to tweets
      state.tweets.push(...state.selectedDeletedTweets);
      // remove from trashbox
      state.trashbox = removeTweetFromDeletedTweets(
        state.trashbox,
        state.selectedDeletedTweets.map((tweet) => tweet.id),
      );
      // clear selected deleted tweets
      state.selectedDeletedTweets = [];
    },
    deleteSelectedDeletedTweets(state: TweetState): void {
      // remove from trashbox
      state.trashbox = removeTweetFromDeletedTweets(
        state.trashbox,
        state.selectedDeletedTweets.map((tweet) => tweet.id),
      );
      // clear selected deleted tweets
      state.selectedDeletedTweets = [];
    },
  },
});

// actions
export const tweetActions: Readonly<typeof tweet.actions> = tweet.actions;

// storage listener
export const tweetStorageListener = (
  args: StorageListenerArguments,
  dispatch: Dispatch,
): void => {
  // added tweets
  if (args.tweet?.added?.length) {
    dispatch(tweetActions.addTweet(args.tweet.added));
  }
  // deleted tweets
  if (args.tweet?.deleted?.length) {
    dispatch(tweetActions.deleteTweet(args.tweet.deleted));
  }
};

// utilities
const addTweetToTweets = (tweets: Tweet[], target: Tweet | Tweet[]): void => {
  toArray(target).forEach((target) => {
    // check if tweet already exists
    if (tweets.every((tweet) => tweet.id !== target.id)) {
      tweets.push(target);
    }
  });
};

const addTweetToDeletedTweets = (
  deletedTweets: DeletedTweet[],
  target: DeletedTweet | DeletedTweet[],
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
  target: TweetID | TweetID[],
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
  target: TweetID | TweetID[],
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
