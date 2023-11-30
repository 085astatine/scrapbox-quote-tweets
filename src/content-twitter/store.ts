import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
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

// slice
const slice = createSlice({
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

// actions
export const actions: Readonly<typeof slice.actions> = slice.actions;

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
