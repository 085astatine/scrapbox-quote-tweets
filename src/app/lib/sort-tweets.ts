import { Tweet } from '~/lib/tweet';

export type TweetSortKey = 'timestamp' | 'username';
export type SortOrder = 'asc' | 'desc';

export interface TweetSort {
  key: TweetSortKey;
  order: SortOrder;
}

export const tweetSortFunction = ({
  key,
  order,
}: TweetSort): ((lhs: Tweet, rhs: Tweet) => number) => {
  const sign = order === 'asc' ? +1 : -1;
  switch (key) {
    case 'timestamp':
      return (lhs: Tweet, rhs: Tweet) => sign * (lhs.timestamp - rhs.timestamp);
    case 'username': {
      const compareString = new Intl.Collator().compare;
      return (lhs: Tweet, rhs: Tweet) => {
        const compareUsername = compareString(
          lhs.author.username,
          rhs.author.username,
        );
        // if the usenames are equal, the newest first
        return compareUsername !== 0
          ? sign * compareUsername
          : rhs.timestamp - lhs.timestamp;
      };
    }
    default: {
      const _: never = key;
      return _;
    }
  }
};
