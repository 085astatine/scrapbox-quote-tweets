export type TweetIDKey = `tweet_${string}`;

export const toTweetIDKey = (tweetID: string): TweetIDKey => {
  return `tweet_${tweetID}`;
};

export const isTweetIDKey = (key: string): key is TweetIDKey => {
  return key.match(/^tweet_\d+$/) !== null;
};
