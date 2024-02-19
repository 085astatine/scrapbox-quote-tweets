import { createSelector, weakMapMemoize } from '@reduxjs/toolkit';
import { Hostname, baseURL } from '~/lib/settings';
import {
  deletedTweetsSortFunction,
  tweetSortFunction,
} from '~/lib/tweet/sort-tweets';
import { TweetToStringOption } from '~/lib/tweet/tweet-to-string';
import {
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
  return state.settings.errors.hostname ?? [];
};
export const selectTimezoneErrors = (state: State): string[] => {
  return state.settings.errors.timezone ?? [];
};

export const selectDatetimeFormatErrors = (state: State): string[] => {
  return state.settings.errors.datetimeFormat ?? [];
};

// tweets
export const selectTweets = createSelector(
  [(state: State): Tweet[] => state.tweet.tweets, selectTweetSort],
  (tweets: Tweet[], sort: TweetSort): Tweet[] => {
    return [...tweets].sort(tweetSortFunction(sort));
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
    return [...selectedTweets].sort(tweetSortFunction(sort));
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
export const selectDeletedTweetsList = createSelector(
  [
    (state: State): DeletedTweets[] => state.tweet.trashbox,
    (state: State): DeletedTweetsSort =>
      state.settings.current.deletedTweetsSort,
  ],
  (trashbox: DeletedTweets[], sort: DeletedTweetsSort): DeletedTweets[] => {
    return [...trashbox].sort(deletedTweetsSortFunction(sort));
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
    (state: State): DeletedTweets[] => state.tweet.trashbox,
    (state: State): Tweet[] => state.tweet.selectedDeletedTweets,
    (state: State, deletedTime: number): number => deletedTime,
  ],
  (
    trashbox: DeletedTweets[],
    selected: Tweet[],
    deletedTime: number,
  ): boolean => {
    const deletedTweets = trashbox.find(
      (deletedTweets) => deletedTweets.deleted_at === deletedTime,
    );
    if (deletedTweets === undefined) {
      return false;
    }
    return deletedTweets.tweets.every((tweet) => selected.includes(tweet));
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
    (state: State): DeletedTweets[] => state.tweet.trashbox,
    (state: State): Tweet[] => state.tweet.selectedDeletedTweets,
  ],
  (
    trashbox: DeletedTweets[],
    selected: Tweet[],
  ): 'disabled' | 'checked' | 'unchecked' => {
    const deletedTweets = trashbox
      .map((deletedTweets) => deletedTweets.tweets)
      .flat();
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
