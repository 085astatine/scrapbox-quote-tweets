import { ApiV2Includes, TweetV2, TweetV2LookupResult } from 'twitter-api-v2';
import { CoreLogger } from 'typescript-logging';
import { loggerProvider } from './logger';
import { Tweet } from './tweet';

const defaultLogger = loggerProvider.getCategory('tweet');

export class ParseTweetError extends Error {
  readonly tweetID: string;

  constructor(tweetID: string, message: string) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseTweetError);
    }
    this.name = 'ParseTweetError';
    this.tweetID = tweetID;
  }
}

export const parseTweets = (
  response: TweetV2LookupResult,
  logger: CoreLogger = defaultLogger
): Tweet[] => {
  logger.debug('parse tweets', response);
  return response.data.map((tweet) =>
    parseTweet(tweet, response.includes, logger)
  );
};

const parseTweet = (
  tweet: TweetV2,
  includes: ApiV2Includes | undefined,
  logger: CoreLogger
): Tweet => {
  logger.debug(`parse tweet ${tweet.id}`);
  const timestamp = parseTimestamp(tweet);
  return {
    id: tweet.id,
    timestamp,
  };
};

const parseTimestamp = (tweet: TweetV2): number => {
  if (tweet.created_at === undefined) {
    throw new ParseTweetError(tweet.id, 'tweet.created_at is undefined');
  }
  return new Date(tweet.created_at).getTime();
};
