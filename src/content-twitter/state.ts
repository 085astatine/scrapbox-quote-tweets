import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TweetIDKey, toTweetIDKey } from '../lib/tweet-id-key';

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
  tweetID: string;
  state: ButtonState;
}

const stateSlice = createSlice({
  name: 'button',
  initialState: {} as State,
  reducers: {
    update(state: State, action: PayloadAction<UpdateButtonState>) {
      state[toTweetIDKey(action.payload.tweetID)] = action.payload.state;
    },
  },
});

export const reducer = stateSlice.reducer;
export const { update: updateAction } = stateSlice.actions;
