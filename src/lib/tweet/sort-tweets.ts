import { DeletedTweets, Tweet } from './types';

export type TweetSortKey = 'created_time' | 'saved_time' | 'username';
export type DeletedTweetsSortKey = 'deleted_time';
export type SortOrder = 'asc' | 'desc';

export interface TweetSort {
  key: TweetSortKey;
  order: SortOrder;
}

export interface DeletedTweetsSort {
  key: DeletedTweetsSortKey;
  order: SortOrder;
}

export const tweetSortFunction = ({
  key,
  order,
}: TweetSort): ((lhs: Tweet, rhs: Tweet) => number) => {
  const sign = order === 'asc' ? +1 : -1;
  switch (key) {
    case 'created_time':
      return (lhs: Tweet, rhs: Tweet) =>
        sign * (lhs.created_at - rhs.created_at);
    case 'saved_time':
      return (lhs: Tweet, rhs: Tweet) => sign * (lhs.saved_at - rhs.saved_at);
    case 'username': {
      const compareString = new Intl.Collator().compare;
      return (lhs: Tweet, rhs: Tweet) => {
        const compareUsername = compareString(
          lhs.author.username,
          rhs.author.username,
        );
        // if the usenames are equal, the newest first
        return compareUsername !== 0 ?
            sign * compareUsername
          : rhs.created_at - lhs.created_at;
      };
    }
    default: {
      const _: never = key;
      return _;
    }
  }
};

export const deletedTweetsSortFunction = ({
  key,
  order,
}: DeletedTweetsSort): ((lhs: DeletedTweets, rhs: DeletedTweets) => number) => {
  const sign = order === 'asc' ? +1 : -1;
  switch (key) {
    case 'deleted_time':
      return (lhs: DeletedTweets, rhs: DeletedTweets) =>
        sign * (lhs.deleted_at - rhs.deleted_at);
    default: {
      const _: never = key;
      return _;
    }
  }
};
