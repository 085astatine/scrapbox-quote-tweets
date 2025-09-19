import {
  type PayloadAction,
  createSelector,
  createSlice,
  weakMapMemoize,
} from '@reduxjs/toolkit';
import type { Dispatch } from 'redux';
import type { OnChangedTrashbox } from '~/lib/storage/trashbox';
import type { OnChangedTweet } from '~/lib/storage/tweet';
import { type TrashboxSort, deletedTimes } from '~/lib/trashbox';
import { tweetSortFunction } from '~/lib/tweet/sort-tweets';
import type {
  DeletedTweet,
  DeletedTweetID,
  SortOrder,
  Tweet,
  TweetID,
  TweetSort,
} from '~/lib/tweet/types';
import { type ArrayOr, fallbackToEmptyArray, toArray } from '~/lib/utility';

// state
export type TweetState = {
  tweets: Tweet[];
  trashbox: DeletedTweet[];
  selectedTweets: Tweet[];
  selectedDeletedTweets: Tweet[];
  tweetSort: TweetSort;
  trashboxSort: TrashboxSort;
};

const initialTweetState = (): TweetState => {
  return {
    tweets: [],
    trashbox: [],
    selectedTweets: [],
    selectedDeletedTweets: [],
    tweetSort: {
      key: 'created_time',
      order: 'desc',
    },
    trashboxSort: {
      key: 'deleted_time',
      order: 'desc',
    },
  };
};

// reducers
type Initializer = Pick<TweetState, 'tweets' | 'trashbox'> &
  Partial<Pick<TweetState, 'tweetSort' | 'trashboxSort'>>;

const _initialize = (
  state: TweetState,
  action: PayloadAction<Initializer>,
): void => {
  state.tweets = [...action.payload.tweets];
  state.trashbox = [...action.payload.trashbox];
  state.selectedTweets = [];
  state.selectedDeletedTweets = [];
  if (action.payload.tweetSort !== undefined) {
    state.tweetSort = action.payload.tweetSort;
  }
  if (action.payload.trashboxSort !== undefined) {
    state.trashboxSort = action.payload.trashboxSort;
  }
};

const _addTweet = (state: TweetState, action: PayloadAction<Tweet[]>): void => {
  addTweetToTweets(state.tweets, action.payload);
};

const _deleteTweet = (
  state: TweetState,
  action: PayloadAction<Tweet[]>,
): void => {
  const targets = action.payload.map((tweet) => tweet.id);
  state.tweets = removeTweetFromTweets(state.tweets, targets);
  state.trashbox = removeTweetFromDeletedTweets(state.trashbox, targets);
  state.selectedTweets = removeTweetFromTweets(state.selectedTweets, targets);
  state.selectedDeletedTweets = removeTweetFromTweets(
    state.selectedDeletedTweets,
    targets,
  );
};

const _selectTweet = (
  state: TweetState,
  action: PayloadAction<Tweet>,
): void => {
  addTweetToTweets(state.selectedTweets, action.payload);
};

const _unselectTweet = (
  state: TweetState,
  action: PayloadAction<Tweet>,
): void => {
  state.selectedTweets = removeTweetFromTweets(
    state.selectedTweets,
    action.payload.id,
  );
};

const _selectAllTweets = (state: TweetState): void => {
  state.selectedTweets = [...state.tweets];
};

const _unselectAllTweets = (state: TweetState): void => {
  state.selectedTweets = [];
};

const _addToTrashbox = (
  state: TweetState,
  action: PayloadAction<DeletedTweetID[]>,
): void => {
  // seach tweet by ID
  const targets = action.payload.reduce<DeletedTweet[]>(
    (tweets, deletedTweetID) => {
      const tweet = state.tweets.find(
        (tweet) => tweet.id === deletedTweetID.tweet_id,
      );
      if (tweet !== undefined) {
        tweets.push({ deleted_at: deletedTweetID.deleted_at, tweet });
      }
      return tweets;
    },
    [],
  );
  // remove from tweets & selected tweets
  state.tweets = removeTweetFromTweets(
    state.tweets,
    action.payload.map((deletedTweet) => deletedTweet.tweet_id),
  );
  state.selectedTweets = removeTweetFromTweets(
    state.selectedTweets,
    action.payload.map((deletedTweet) => deletedTweet.tweet_id),
  );
  // add to trashbox
  addTweetToDeletedTweets(state.trashbox, targets);
};

const _deleteFromTrashbox = (
  state: TweetState,
  action: PayloadAction<DeletedTweetID[]>,
): void => {
  // search tweet by ID
  const tweets = action.payload.reduce<Tweet[]>((tweets, deletedTweetID) => {
    const tweet = state.trashbox.find(
      (tweet) => tweet.tweet.id === deletedTweetID.tweet_id,
    )?.tweet;
    if (tweet !== undefined) {
      tweets.push(tweet);
    }
    return tweets;
  }, []);
  // remove from trashbox & selected deleted tweet
  state.trashbox = removeTweetFromDeletedTweets(
    state.trashbox,
    action.payload.map((deletedTweet) => deletedTweet.tweet_id),
  );
  state.selectedDeletedTweets = removeTweetFromTweets(
    state.selectedDeletedTweets,
    action.payload.map((deletedTweet) => deletedTweet.tweet_id),
  );
  // add to tweets
  if (tweets.length > 0) {
    addTweetToTweets(state.tweets, tweets);
  }
};

const _selectDeletedTweet = (
  state: TweetState,
  action: PayloadAction<ArrayOr<Tweet>>,
): void => {
  addTweetToTweets(state.selectedDeletedTweets, action.payload);
};

const _unselectDeletedTweet = (
  state: TweetState,
  action: PayloadAction<ArrayOr<Tweet>>,
): void => {
  state.selectedDeletedTweets = removeTweetFromTweets(
    state.selectedDeletedTweets,
    toArray(action.payload).map((tweet) => tweet.id),
  );
};

const _selectAllDeletedTweets = (state: TweetState) => {
  state.selectedDeletedTweets = state.trashbox.map(
    (deletedTweet) => deletedTweet.tweet,
  );
};

const _unselectAllDeletedTweets = (state: TweetState) => {
  state.selectedDeletedTweets = [];
};

const _updateTweetSort = (
  state: TweetState,
  action: PayloadAction<TweetSort>,
): void => {
  state.tweetSort = action.payload;
};

const _updateTrashboxSort = (
  state: TweetState,
  action: PayloadAction<TrashboxSort>,
): void => {
  state.trashboxSort = action.payload;
};

// selectors
// selectors: tweets
export const _selectTweetSort = (state: TweetState): TweetSort => {
  return state.tweetSort;
};

export const _selectTweets = createSelector(
  [(state: TweetState): Tweet[] => state.tweets, _selectTweetSort],
  (tweets: Tweet[], sort: TweetSort): Tweet[] => {
    return fallbackToEmptyArray([...tweets].sort(tweetSortFunction(sort)));
  },
);

export const _selectTweetsSize = (state: TweetState): number => {
  return state.tweets.length;
};

export const _selectIsSelectedTweet = createSelector(
  [
    (state: TweetState): Tweet[] => state.selectedTweets,
    (_, tweetID: TweetID): TweetID => tweetID,
  ],
  (selectedTweets: Tweet[], tweetID: TweetID): boolean => {
    return selectedTweets.some((tweet) => tweet.id === tweetID);
  },
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);

export const _selectSelectedTweets = createSelector(
  [(state: TweetState): Tweet[] => state.selectedTweets, _selectTweetSort],
  (selectedTweets: Tweet[], sort: TweetSort): Tweet[] => {
    return fallbackToEmptyArray(
      [...selectedTweets].sort(tweetSortFunction(sort)),
    );
  },
);

export const _selectAllTweetsSelectButtonState = createSelector(
  [
    (state: TweetState): Tweet[] => state.tweets,
    (state: TweetState): Tweet[] => state.selectedTweets,
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

// selectors: trashbox
export const _selectTrashboxSort = (state: TweetState): TrashboxSort => {
  return state.trashboxSort;
};

export const _selectTrashboxSize = (state: TweetState): number => {
  return state.trashbox.length;
};

export const _selectDeletedTimes = createSelector(
  [
    (state: TweetState): DeletedTweet[] => state.trashbox,
    (state: TweetState): SortOrder => state.trashboxSort.order,
  ],
  (trashbox: DeletedTweet[], order: SortOrder) => {
    return fallbackToEmptyArray(deletedTimes(trashbox, order));
  },
);

export const _selectDeletedTweets = createSelector(
  [
    (state: TweetState): DeletedTweet[] => state.trashbox,
    (_, deletedTime: number): number => deletedTime,
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

export const _selectIsDeletedTweetSelected = createSelector(
  [
    (state: TweetState): Tweet[] => state.selectedDeletedTweets,
    (_, tweetID: TweetID): TweetID => tweetID,
  ],
  (selected: Tweet[], tweetID: TweetID): boolean => {
    return selected.some((tweet) => tweet.id === tweetID);
  },
  {
    memoize: weakMapMemoize,
    argsMemoize: weakMapMemoize,
  },
);

export const _selectIsAllDeletedTweetsSelected = createSelector(
  [
    _selectDeletedTweets,
    (state: TweetState): Tweet[] => state.selectedDeletedTweets,
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

export const _selectSelectedDeletedTweets = (state: TweetState): Tweet[] => {
  return state.selectedDeletedTweets;
};

export const _selectAllTrashboxSelectButtonState = createSelector(
  [
    (state: TweetState): DeletedTweet[] => state.trashbox,
    (state: TweetState): Tweet[] => state.selectedDeletedTweets,
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

// slice
const tweet = createSlice({
  name: 'tweet',
  initialState: initialTweetState(),
  reducers: {
    initialize: _initialize,
    addTweet: _addTweet,
    deleteTweet: _deleteTweet,
    selectTweet: _selectTweet,
    unselectTweet: _unselectTweet,
    selectAllTweets: _selectAllTweets,
    unselectAllTweets: _unselectAllTweets,
    addToTrashbox: _addToTrashbox,
    deleteFromTrashbox: _deleteFromTrashbox,
    selectDeletedTweet: _selectDeletedTweet,
    unselectDeletedTweet: _unselectDeletedTweet,
    selectAllDeletedTweets: _selectAllDeletedTweets,
    unselectAllDeletedTweets: _unselectAllDeletedTweets,
    updateTweetSort: _updateTweetSort,
    updateTrashboxSort: _updateTrashboxSort,
  },
  selectors: {
    // tweets
    selectTweetSort: _selectTweetSort,
    selectTweets: _selectTweets,
    selectTweetsSize: _selectTweetsSize,
    selectIsSelectedTweet: _selectIsSelectedTweet,
    selectSelectedTweets: _selectSelectedTweets,
    selectAllTweetsSelectButtonState: _selectAllTweetsSelectButtonState,
    // trashbox
    selectTrashboxSort: _selectTrashboxSort,
    selectTrashboxSize: _selectTrashboxSize,
    selectDeletedTimes: _selectDeletedTimes,
    selectDeletedTweets: _selectDeletedTweets,
    selectIsDeletedTweetSelected: _selectIsDeletedTweetSelected,
    selectIsAllDeletedTweetsSelected: _selectIsAllDeletedTweetsSelected,
    selectSelectedDeletedTweets: _selectSelectedDeletedTweets,
    selectAllTrashboxSelectButtonState: _selectAllTrashboxSelectButtonState,
  },
});

// export
export const tweetReducer = tweet.reducer;

export const tweetActions: Readonly<typeof tweet.actions> = tweet.actions;

export const {
  selectTweetSort,
  selectTweets,
  selectIsSelectedTweet,
  selectSelectedTweets,
  selectAllTweetsSelectButtonState,
  selectTweetsSize,
  selectTrashboxSort,
  selectTrashboxSize,
  selectDeletedTimes,
  selectDeletedTweets,
  selectIsDeletedTweetSelected,
  selectIsAllDeletedTweetsSelected,
  selectSelectedDeletedTweets,
  selectAllTrashboxSelectButtonState,
} = tweet.selectors;

// storage listener
export const tweetStorageListener = (
  args: OnChangedTweet & OnChangedTrashbox,
  dispatch: Dispatch,
): void => {
  // tweet: added
  if (args.tweet?.added?.length) {
    dispatch(tweetActions.addTweet(args.tweet.added));
  }
  // tweet: deleted
  if (args.tweet?.deleted?.length) {
    dispatch(tweetActions.deleteTweet(args.tweet.deleted));
  }
  // trashbox: added
  if (args.trashbox?.added?.length) {
    dispatch(tweetActions.addToTrashbox(args.trashbox.added));
  }
  // trashbox: deleted
  if (args.trashbox?.deleted?.length) {
    dispatch(tweetActions.deleteFromTrashbox(args.trashbox.deleted));
  }
};

// utilities
const addTweetToTweets = (tweets: Tweet[], target: ArrayOr<Tweet>): void => {
  toArray(target).forEach((target) => {
    // check if tweet already exists
    if (tweets.every((tweet) => tweet.id !== target.id)) {
      tweets.push(target);
    }
  });
};

const addTweetToDeletedTweets = (
  deletedTweets: DeletedTweet[],
  target: ArrayOr<DeletedTweet>,
): void => {
  toArray(target).forEach((target) => {
    // check if tweet already exists
    if (
      deletedTweets.every(
        (deletedTweet) => deletedTweet.tweet.id !== target.tweet.id,
      )
    ) {
      deletedTweets.push(target);
    }
  });
};

const removeTweetFromTweets = (
  tweets: Tweet[],
  target: ArrayOr<TweetID>,
): Tweet[] => {
  const targets = toArray(target);
  // check if targets in tweets
  const tweetIDs = tweets.map((tweet) => tweet.id);
  if (targets.every((tweetID) => !tweetIDs.includes(tweetID))) {
    return tweets;
  }
  return tweets.filter((tweet) =>
    targets.every((tweetID) => tweetID !== tweet.id),
  );
};

const removeTweetFromDeletedTweets = (
  deletedTweets: DeletedTweet[],
  target: ArrayOr<TweetID>,
): DeletedTweet[] => {
  const targets = toArray(target);
  // check if targets in tweets
  const tweetIDs = deletedTweets.map((deletedTweet) => deletedTweet.tweet.id);
  if (targets.every((tweetID) => !tweetIDs.includes(tweetID))) {
    return deletedTweets;
  }
  return deletedTweets.filter((deletedTweet) =>
    targets.every((tweetID) => tweetID !== deletedTweet.tweet.id),
  );
};
