import { ApiV2Includes, TweetV2, TweetV2LookupResult } from 'twitter-api-v2';
import { CoreLogger } from 'typescript-logging';
import { loggerProvider } from './logger';
import { Tweet } from './tweet';

const defaultLogger = loggerProvider.getCategory('tweet');

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
  return {
    id: tweet.id,
  };
};
