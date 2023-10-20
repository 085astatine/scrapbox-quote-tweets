import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TweetID } from '~/lib/tweet';
import { TweetIDKey, toTweetIDKey } from '~/lib/tweet-id-key';

export interface ButtonStateNone {
  state: 'none';
}

export interface ButtonStateInProgress {
  state: 'in-progress';
}

export interface ButtonStateSuccess {
  state: 'success';
}

export interface ButtonStateFailure {
  state: 'failure';
  message: string;
}

export type ButtonState =
  | ButtonStateNone
  | ButtonStateInProgress
  | ButtonStateSuccess
  | ButtonStateFailure;

export interface State {
  [key: TweetIDKey]: ButtonState;
}

export interface UpdateButtonState {
  tweetID: TweetID;
  state: ButtonState;
}

const stateSlice = createSlice({
  name: 'button',
  initialState: {} as State,
  reducers: {
    update(
      state: State,
      action: PayloadAction<UpdateButtonState | UpdateButtonState[]>,
    ) {
      if (Array.isArray(action.payload)) {
        action.payload.forEach(({ tweetID, state: buttonState }) => {
          state[toTweetIDKey(tweetID)] = buttonState;
        });
      } else {
        state[toTweetIDKey(action.payload.tweetID)] = action.payload.state;
      }
    },
    touch(state: State, action: PayloadAction<TweetID>) {
      const key = toTweetIDKey(action.payload);
      if (!(key in state)) {
        state[key] = { state: 'none' };
      }
    },
  },
});

export const reducer = stateSlice.reducer;
export const { update: updateAction, touch: touchAction } = stateSlice.actions;
