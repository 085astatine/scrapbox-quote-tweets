import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DeletedTweets } from '~/lib/tweet/deleted-tweets';
import { Tweet } from '~/lib/tweet/tweet';
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
      const index = state.selectedTweets.findIndex(
        (tweet) => tweet.id === action.payload.id,
      );
      if (index !== -1) {
        state.selectedTweets.splice(index, 1);
      }
    },
    selectAllTweets(state: TweetState): void {
      state.selectedTweets = [...state.tweets];
    },
    unselectAllTweets(state: TweetState): void {
      state.selectedTweets = [];
    },
    moveToTrashbox(state: TweetState, action: PayloadAction<number>): void {
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
      toArray(action.payload).forEach((selectedTweet) => {
        const index = state.selectedDeletedTweets.findIndex(
          (tweet) => tweet.id === selectedTweet.id,
        );
        if (index !== -1) {
          state.selectedDeletedTweets.splice(index, 1);
        }
      });
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
    deleteSelectedDeletedTweets(state: TweetState): void {
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
  },
});

// actions
export const tweetActions: Readonly<typeof tweet.actions> = tweet.actions;
