import { TweetID } from '../tweet/tweet';

export type TweetIDKey = `tweet_${TweetID}`;

export const toTweetIDKey = (tweetID: TweetID): TweetIDKey => {
  return `tweet_${tweetID}`;
};

export const isTweetIDKey = (key: string): key is TweetIDKey => {
  return key.match(/^tweet_\d+$/) !== null;
};

export const toTweetID = (key: TweetIDKey): string => {
  // 'tweet_'.length === 6
  return key.substring(6);
};
