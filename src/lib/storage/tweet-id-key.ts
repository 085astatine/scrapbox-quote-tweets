import type { Tweet, TweetID } from '../tweet/types';

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

export class TweetIDKeyMismatchError extends Error {
  readonly key: string;
  readonly value: Tweet;

  constructor(key: string, value: Tweet) {
    super(
      [
        'Tweet IDs of key and value do not match',
        `  key: ${key}`,
        `  value.id: ${value.id}`,
      ].join('\n'),
    );
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TweetIDKeyMismatchError);
    }
    this.name = 'TweetIDKeyMismatchError';
    this.key = key;
    this.value = value;
  }
}
