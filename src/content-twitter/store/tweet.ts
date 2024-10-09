import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { Dispatch } from 'redux';
import type { OnChangedTweet } from '~/lib/storage/tweet';
import type { TweetID } from '~/lib/tweet/types';
import { type ArrayOr, toArray } from '~/lib/utility';

// state
export type ScrapboxButtonState =
  | {
      state: 'none' | 'in-progress' | 'success';
    }
  | {
      state: 'failure';
      message: string;
    };

export type TweetState = {
  tweetID: TweetID;
  button: ScrapboxButtonState;
};

// slice
export type ScrapboxButtonUpdater = Pick<TweetState, 'tweetID' | 'button'>;

const tweet = createSlice({
  name: 'tweet',
  initialState: [] as TweetState[],
  reducers: {
    updateButton(
      states: TweetState[],
      action: PayloadAction<ArrayOr<ScrapboxButtonUpdater>>,
    ) {
      toArray(action.payload).forEach(({ tweetID, button }) => {
        const state = states.find((state) => state.tweetID === tweetID);
        if (state !== undefined) {
          state.button = button;
        } else {
          states.push({ tweetID, button });
        }
      });
    },
    touch(states: TweetState[], action: PayloadAction<TweetID>) {
      const state = states.find((state) => state.tweetID === action.payload);
      if (state === undefined) {
        states.push({ tweetID: action.payload, button: { state: 'none' } });
      }
    },
  },
});

// reducer
export const tweetReducer = tweet.reducer;

// actions
export const tweetActions: Readonly<typeof tweet.actions> = tweet.actions;

// storage listener
export const tweetStorageListener = (
  args: OnChangedTweet,
  dispatch: Dispatch,
): void => {
  const buttonUpdaters: ScrapboxButtonUpdater[] = [];
  // tweet: added
  if (args.tweet?.added?.length) {
    buttonUpdaters.push(
      ...args.tweet.added.map((tweet) => ({
        tweetID: tweet.id,
        button: { state: 'success' as const },
      })),
    );
  }
  // tweet: deleted
  if (args.tweet?.deleted?.length) {
    buttonUpdaters.push(
      ...args.tweet.deleted.map((tweet) => ({
        tweetID: tweet.id,
        button: { state: 'none' as const },
      })),
    );
  }
  // update state
  if (buttonUpdaters.length) {
    dispatch(tweetActions.updateButton(buttonUpdaters));
  }
};
