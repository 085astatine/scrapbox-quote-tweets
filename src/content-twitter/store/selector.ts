import { createSelector, weakMapMemoize } from '@reduxjs/toolkit';
import { toTweetIDKey } from '~/lib/storage/tweet-id-key';
import { TweetID } from '~/lib/tweet/types';
import { State } from '.';
import { ButtonState, TweetState } from './tweet';

export const selectScrapboxButtonState = createSelector(
  [
    (state: State): TweetState => state.tweet,
    (state: State, tweetID: TweetID): TweetID => tweetID,
  ],
  (tweetState: TweetState, tweetID: TweetID): ButtonState => {
    const state = tweetState[toTweetIDKey(tweetID)];
    if (state !== undefined) {
      return state;
    }
    return { state: 'none' };
  },
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);
