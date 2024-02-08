import {
  DeletedTweet,
  DeletedTweetID,
  DeletedTweetIDSort,
  DeletedTweetSort,
  DeletedTweets,
  DeletedTweetsSort,
  SortOrder,
  Tweet,
  TweetID,
  TweetSort,
} from './types';

const tweetIDCompareFunction = (lhs: TweetID, rhs: TweetID) => {
  return (
    lhs.length !== rhs.length ? lhs.length - rhs.length
    : lhs < rhs ? -1
    : +1
  );
};

export const tweetIDSortFunction = (
  order: SortOrder,
): ((lhs: TweetID, rhs: TweetID) => number) => {
  const sign = order === 'asc' ? +1 : -1;
  return (lhs: TweetID, rhs: TweetID) =>
    sign * tweetIDCompareFunction(lhs, rhs);
};

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

export const deletedTweetIDSortFunction = ({
  key,
  order,
}: DeletedTweetIDSort): ((
  lhs: DeletedTweetID,
  rhs: DeletedTweetID,
) => number) => {
  const sign = order === 'asc' ? +1 : -1;
  switch (key) {
    case 'deleted_time':
      return (lhs: DeletedTweetID, rhs: DeletedTweetID) =>
        lhs.deleted_at !== rhs.deleted_at ?
          sign * (lhs.deleted_at - rhs.deleted_at)
        : tweetIDCompareFunction(lhs.tweet_id, rhs.tweet_id);
    case 'tweet_id':
      return (lhs: DeletedTweetID, rhs: DeletedTweetID) =>
        lhs.tweet_id !== rhs.tweet_id ?
          sign * tweetIDCompareFunction(lhs.tweet_id, rhs.tweet_id)
        : lhs.deleted_at - rhs.deleted_at;
    default: {
      const _: never = key;
      return _;
    }
  }
};

export const deletedTweetSortFunction = ({
  key,
  order,
}: DeletedTweetSort): ((lhs: DeletedTweet, rhs: DeletedTweet) => number) => {
  const sign = order === 'asc' ? +1 : -1;
  switch (key) {
    case 'deleted_time':
      return (lhs: DeletedTweet, rhs: DeletedTweet) =>
        lhs.deleted_at !== rhs.deleted_at ?
          sign * (lhs.deleted_at - rhs.deleted_at)
        : tweetIDCompareFunction(lhs.tweet.id, rhs.tweet.id);
    default:
      return (lhs: DeletedTweet, rhs: DeletedTweet) =>
        tweetSortFunction({ key, order })(lhs.tweet, rhs.tweet);
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
