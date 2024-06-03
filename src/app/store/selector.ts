import { createSelector, weakMapMemoize } from '@reduxjs/toolkit';
import { Hostname, TrashboxSort, baseURL } from '~/lib/settings';
import { tweetSortFunction } from '~/lib/tweet/sort-tweets';
import { TweetToStringOption } from '~/lib/tweet/tweet-to-string';
import {
  DeletedTweet,
  SortOrder,
  Tweet,
  TweetID,
  TweetSort,
} from '~/lib/tweet/types';
import { State } from '.';

// currnet settings
export const selectHostname = (state: State): Hostname => {
  return state.settings.current.hostname;
};

export const selectTimezone = (state: State): string => {
  return state.settings.current.timezone;
};

export const selectDatetimeFormat = (state: State): string => {
  return state.settings.current.datetimeFormat;
};

export const selectTweetSort = (state: State): TweetSort => {
  return state.settings.current.tweetSort;
};

export const selectTrashboxSort = (state: State): TrashboxSort => {
  return state.settings.current.trashboxSort;
};

// editing settings
export const selectIsSettingsEdited = (state: State): boolean => {
  return Object.keys(state.settings.editing).length > 0;
};

export const selectEditingHostname = (state: State): Hostname | undefined => {
  return state.settings.editing.hostname;
};

export const selectEditingTimezone = (state: State): string | undefined => {
  return state.settings.editing.timezone;
};

export const selectEditingDatetimeFormat = (
  state: State,
): string | undefined => {
  return state.settings.editing.datetimeFormat;
};

// settings errors
export const selectHostnameErrors = (state: State): string[] => {
  return fallbackToEmptyArray(state.settings.errors.hostname ?? []);
};
export const selectTimezoneErrors = (state: State): string[] => {
  return fallbackToEmptyArray(state.settings.errors.timezone ?? []);
};

export const selectDatetimeFormatErrors = (state: State): string[] => {
  return fallbackToEmptyArray(state.settings.errors.datetimeFormat ?? []);
};

// tweets
export const selectTweets = createSelector(
  [(state: State): Tweet[] => state.tweet.tweets, selectTweetSort],
  (tweets: Tweet[], sort: TweetSort): Tweet[] => {
    return fallbackToEmptyArray([...tweets].sort(tweetSortFunction(sort)));
  },
);

export const selectTweetsSize = createSelector(
  [(state: State): Tweet[] => state.tweet.tweets],
  (tweets: Tweet[]): number => tweets.length,
);

export const selectIsSelectedTweet = createSelector(
  [
    (state: State): Tweet[] => state.tweet.selectedTweets,
    (state: State, tweetID: TweetID): TweetID => tweetID,
  ],
  (selectedTweets: Tweet[], tweetID: TweetID): boolean => {
    return selectedTweets.some((tweet) => tweet.id === tweetID);
  },
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);

export const selectSelectedTweets = createSelector(
  [(state: State): Tweet[] => state.tweet.selectedTweets, selectTweetSort],
  (selectedTweets: Tweet[], sort: TweetSort): Tweet[] => {
    return fallbackToEmptyArray(
      [...selectedTweets].sort(tweetSortFunction(sort)),
    );
  },
);

export const selectAllTweetsSelectButtonState = createSelector(
  [
    (state: State): Tweet[] => state.tweet.tweets,
    (state: State): Tweet[] => state.tweet.selectedTweets,
  ],
  (
    tweets: Tweet[],
    selected: Tweet[],
  ): 'disabled' | 'checked' | 'unchecked' => {
    return (
      tweets.length === 0 ? 'disabled'
      : tweets.every((tweet) => selected.includes(tweet)) ? 'checked'
      : 'unchecked'
    );
  },
);

// trashbox
export const selectDeletedTimes = createSelector(
  [
    (state: State): DeletedTweet[] => state.tweet.trashbox,
    (state: State): SortOrder => state.settings.current.trashboxSort.order,
  ],
  (trashbox: DeletedTweet[], order: SortOrder) => {
    return fallbackToEmptyArray(
      trashbox
        .map((deletedTweet) => deletedTweet.deleted_at)
        .sort(
          order === 'asc' ? (lhs, rhs) => lhs - rhs : (lhs, rhs) => rhs - lhs,
        )
        .reduce<number[]>((times, time) => {
          if (times[times.length - 1] !== time) {
            times.push(time);
          }
          return times;
        }, []),
    );
  },
);

export const selectTrashboxSize = createSelector(
  [(state: State): DeletedTweet[] => state.tweet.trashbox],
  (trashbox: DeletedTweet[]): number => trashbox.length,
);

export const selectDeletedTweets = createSelector(
  [
    (state: State): DeletedTweet[] => state.tweet.trashbox,
    (state: State, deletedTime: number): number => deletedTime,
  ],
  (trashbox: DeletedTweet[], deletedTime: number): Tweet[] => {
    return fallbackToEmptyArray(
      trashbox
        .filter((deletedTweet) => deletedTweet.deleted_at === deletedTime)
        .map((deletedTweet) => deletedTweet.tweet)
        .sort(tweetSortFunction({ key: 'created_time', order: 'asc' })),
    );
  },
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);

export const selectIsDeletedTweetSelected = createSelector(
  [
    (state: State): Tweet[] => state.tweet.selectedDeletedTweets,
    (state: State, tweetID: TweetID): TweetID => tweetID,
  ],
  (selected: Tweet[], tweetID: TweetID): boolean => {
    return selected.some((tweet) => tweet.id === tweetID);
  },
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);

export const selectIsAllDeletedTweetsSelected = createSelector(
  [
    selectDeletedTweets,
    (state: State): Tweet[] => state.tweet.selectedDeletedTweets,
  ],
  (tweets: Tweet[], selected: Tweet[]): boolean => {
    return (
      tweets.length > 0 && tweets.every((tweet) => selected.includes(tweet))
    );
  },
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);

export const selectSelectedDeletedTweets = (state: State): Tweet[] => {
  return state.tweet.selectedDeletedTweets;
};

export const selectAllTrashboxSelectButtonState = createSelector(
  [
    (state: State): DeletedTweet[] => state.tweet.trashbox,
    (state: State): Tweet[] => state.tweet.selectedDeletedTweets,
  ],
  (
    trashbox: DeletedTweet[],
    selected: Tweet[],
  ): 'disabled' | 'checked' | 'unchecked' => {
    const deletedTweets = trashbox.map((deletedTweet) => deletedTweet.tweet);
    return (
      deletedTweets.length === 0 ? 'disabled'
      : deletedTweets.every((tweet) => selected.includes(tweet)) ? 'checked'
      : 'unchecked'
    );
  },
);

// settings
export const selectBaseURL = createSelector(
  [selectHostname],
  (hostname: Hostname): string => {
    return baseURL(hostname);
  },
);

export const selectTweetToStringOption = createSelector(
  [selectHostname, selectTimezone, selectDatetimeFormat],
  (
    hostname: Hostname,
    timezone: string,
    datetimeFormat: string,
  ): TweetToStringOption => {
    return { hostname, timezone, datetimeFormat };
  },
);

// utilities
const EMPTY_ARRAY: [] = [];

const fallbackToEmptyArray = <T>(array: T[]): T[] => {
  return array.length === 0 ? EMPTY_ARRAY : array;
};
