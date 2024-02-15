import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StorageChanges } from '~/lib/storage/listener';
import { DeletedTweets, Tweet, TweetID } from '~/lib/tweet/types';
import { toArray } from '~/lib/utility';

export interface TweetState {
  tweets: Tweet[];
  trashbox: DeletedTweets[];
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
      action: PayloadAction<{ tweets: Tweet[]; trashbox: DeletedTweets[] }>,
    ): void {
      state.tweets = [...action.payload.tweets];
      state.trashbox = [...action.payload.trashbox];
      state.selectedTweets = [];
      state.selectedDeletedTweets = [];
    },
    selectTweet(state: TweetState, action: PayloadAction<Tweet>): void {
      const exist = state.selectedTweets.find(
        (tweet) => tweet.id === action.payload.id,
      );
      if (!exist) {
        state.selectedTweets.push(action.payload);
      }
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
      state.trashbox.push({
        deleted_at: action.payload,
        tweets: [...state.selectedTweets],
      });
      // clear selected tweets
      state.selectedTweets = [];
    },
    selectDeletedTweet(
      state: TweetState,
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
      state: TweetState,
      action: PayloadAction<Tweet | Tweet[]>,
    ): void {
      state.selectedDeletedTweets = removeTweetFromTweets(
        state.selectedDeletedTweets,
        toArray(action.payload).map((tweet) => tweet.id),
      );
    },
    selectAllDeletedTweets(state: TweetState) {
      state.selectedDeletedTweets = state.trashbox
        .map((deletedTweets) => deletedTweets.tweets)
        .flat();
    },
    unselectAllDeletedTweets(state: TweetState) {
      state.selectedDeletedTweets = [];
    },
    restoreSelectedDeletedTweets(state: TweetState): void {
      // restore to tweets
      state.tweets.push(...state.selectedDeletedTweets);
      // remove from trashbox
      state.trashbox = removeTweetFromTrashbox(
        state.trashbox,
        state.selectedDeletedTweets.map((tweet) => tweet.id),
      );
      // clear selected deleted tweets
      state.selectedDeletedTweets = [];
    },
    deleteSelectedDeletedTweets(state: TweetState): void {
      // remove from trashbox
      state.trashbox = removeTweetFromTrashbox(
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
export const tweetStorageListener = ({
  addedTweets,
  deletedTweets,
}: StorageChanges): void => {
  // added tweets
  if (addedTweets.length) {
    console.log('Added tweets', addedTweets);
  }
  // deleted tweets
  if (deletedTweets.length) {
    console.log('Deleted tweets', deletedTweets);
  }
};

// utilities
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

const removeTweetFromTrashbox = (
  trashbox: DeletedTweets[],
  target: TweetID | TweetID[],
): DeletedTweets[] => {
  const targets = toArray(target);
  return trashbox.reduce<DeletedTweets[]>((result, element) => {
    element.tweets = element.tweets.filter((tweet) =>
      targets.every((tweetID) => tweetID !== tweet.id),
    );
    if (element.tweets.length) {
      result.push(element);
    }
    return result;
  }, []);
};
