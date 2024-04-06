import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TweetID } from '~/lib/tweet/types';
import { ArrayOr, toArray } from '~/lib/utility';

// state
export type ScrapboxButtonState =
  | {
      state: 'none' | 'in-progress' | 'success';
    }
  | {
      state: 'failure';
      message: string;
    };

export interface TweetState {
  tweetID: TweetID;
  button: ScrapboxButtonState;
}

// slice
export const tweet = createSlice({
  name: 'tweet',
  initialState: [] as TweetState[],
  reducers: {
    update(states: TweetState[], action: PayloadAction<ArrayOr<TweetState>>) {
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

// action
export const tweetActions: Readonly<typeof tweet.actions> = tweet.actions;
