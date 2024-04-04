import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TweetIDKey, toTweetIDKey } from '~/lib/storage/tweet-id-key';
import { TweetID } from '~/lib/tweet/types';
import { ArrayOr, toArray } from '~/lib/utility';

export type ButtonState =
  | {
      state: 'none' | 'in-progress' | 'success';
    }
  | {
      state: 'failure';
      message: string;
    };

// state
export interface TweetState {
  [key: TweetIDKey]: ButtonState;
}

// slice
export const tweet = createSlice({
  name: 'tweet',
  initialState: {} as TweetState,
  reducers: {
    update(
      state: TweetState,
      action: PayloadAction<ArrayOr<UpdateButtonState>>,
    ) {
      toArray(action.payload).forEach(({ tweetID, state: buttonState }) => {
        state[toTweetIDKey(tweetID)] = buttonState;
      });
    },
    touch(state: TweetState, action: PayloadAction<TweetID>) {
      const key = toTweetIDKey(action.payload);
      if (!(key in state)) {
        state[key] = { state: 'none' };
      }
    },
  },
});

export interface UpdateButtonState {
  tweetID: TweetID;
  state: ButtonState;
}

// action
export const tweetActions: Readonly<typeof tweet.actions> = tweet.actions;
