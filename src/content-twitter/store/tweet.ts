import {
  type PayloadAction,
  createSelector,
  createSlice,
  weakMapMemoize,
} from '@reduxjs/toolkit';
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

// reducers
const _updateButton = (
  states: TweetState[],
  action: PayloadAction<ArrayOr<ScrapboxButtonUpdater>>,
): void => {
  toArray(action.payload).forEach(({ tweetID, button }) => {
    const state = states.find((state) => state.tweetID === tweetID);
    if (state !== undefined) {
      state.button = button;
    } else {
      states.push({ tweetID, button });
    }
  });
};

const _touch = (states: TweetState[], action: PayloadAction<TweetID>): void => {
  const state = states.find((state) => state.tweetID === action.payload);
  if (state === undefined) {
    states.push({ tweetID: action.payload, button: { state: 'none' } });
  }
};

// selectors
const _selectScrapboxButtonState = createSelector(
  [
    (state: TweetState[]): TweetState[] => state,
    (_, tweetID: TweetID): TweetID => tweetID,
  ],
  (state: TweetState[], tweetID: TweetID): ScrapboxButtonState => {
    const tweet = state.find((tweetState) => tweetState.tweetID === tweetID);
    if (tweet !== undefined) {
      return tweet.button;
    }
    return { state: 'none' };
  },
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);

// slice
const tweetSlice = createSlice({
  name: 'tweet',
  initialState: [] as TweetState[],
  reducers: {
    updateButton: _updateButton,
    touch: _touch,
  },
  selectors: {
    selectScrapboxButtonState: _selectScrapboxButtonState,
  },
});

// export
export const tweetReducer = tweetSlice.reducer;

export const tweetActions: Readonly<typeof tweetSlice.actions> =
  tweetSlice.actions;

export const { selectScrapboxButtonState } = tweetSlice.selectors;

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
