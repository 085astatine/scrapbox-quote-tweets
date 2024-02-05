import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { TweetIDKey, toTweetIDKey } from '~/lib/storage/tweet-id-key';
import { TweetID } from '~/lib/tweet/types';
import { toArray } from '~/lib/utility';

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
      toArray(action.payload).forEach(({ tweetID, state: buttonState }) => {
        state[toTweetIDKey(tweetID)] = buttonState;
      });
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
    // @ts-expect-error @types/redux-logger depends on redux 4.x
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
