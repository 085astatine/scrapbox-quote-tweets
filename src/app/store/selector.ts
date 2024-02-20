import { createSelector, weakMapMemoize } from '@reduxjs/toolkit';
import { Hostname, baseURL } from '~/lib/settings';
import {
  deletedTweetSortFunction,
  deletedTweetsSortFunction,
  tweetSortFunction,
} from '~/lib/tweet/sort-tweets';
import { TweetToStringOption } from '~/lib/tweet/tweet-to-string';
import {
  DeletedTweet,
  DeletedTweets,
  DeletedTweetsSort,
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

export const selectDeletedTweetsSort = (state: State): DeletedTweetsSort => {
  return state.settings.current.deletedTweetsSort;
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
export const selectTrashboxElements = createSelector(
  [(state: State): DeletedTweet[] => state.tweet.trashbox],
  (deletedTweets: DeletedTweet[]): DeletedTweets[] => {
    return fallbackToEmptyArray(
      [...deletedTweets]
        .sort(deletedTweetSortFunction({ key: 'deleted_time', order: 'asc' }))
        .reduce<DeletedTweets[]>((trashboxElements, deletedTweet) => {
          const last = trashboxElements[trashboxElements.length - 1];
          if (last?.deleted_at === deletedTweet.deleted_at) {
            last.tweets.push(deletedTweet.tweet);
          } else {
            trashboxElements.push({
              deleted_at: deletedTweet.deleted_at,
              tweets: [deletedTweet.tweet],
            });
          }
          return trashboxElements;
        }, []),
    );
  },
);

export const selectDeletedTweetsList = createSelector(
  [
    selectTrashboxElements,
    (state: State): DeletedTweetsSort =>
      state.settings.current.deletedTweetsSort,
  ],
  (trashbox: DeletedTweets[], sort: DeletedTweetsSort): DeletedTweets[] => {
    return fallbackToEmptyArray(
      [...trashbox].sort(deletedTweetsSortFunction(sort)),
    );
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
    (state: State): DeletedTweet[] => state.tweet.trashbox,
    (state: State): Tweet[] => state.tweet.selectedDeletedTweets,
    (state: State, deletedTime: number): number => deletedTime,
  ],
  (
    trashbox: DeletedTweet[],
    selected: Tweet[],
    deletedTime: number,
  ): boolean => {
    const targetTweets = trashbox
      .filter((deletedTweet) => deletedTweet.deleted_at === deletedTime)
      .map((deletedTweet) => deletedTweet.tweet);
    return (
      targetTweets.length > 0 &&
      targetTweets.every((tweet) => selected.includes(tweet))
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
