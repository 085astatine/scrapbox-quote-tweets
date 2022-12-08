import browser from 'webextension-polyfill';
import { tweetsJSONSchema } from '../jsonschema/tweet';
import { JSONSchemaValidationError } from '../validate-json/jsonschema-validation-error';
import validateTweets from '../validate-json/validate-tweets';
import { logger } from './logger';
import { Tweet } from './tweet';
import { toTweetIDKey } from './tweet-id-key';

export const saveTweets = async (tweets: Tweet[]): Promise<void> => {
  // JSON Schema validation
  if (!validateTweets(tweets)) {
    throw new JSONSchemaValidationError(
      tweetsJSONSchema,
      tweets,
      validateTweets.errors
    );
  }
  // set to storage
  await browser.storage.local.set(
    Object.fromEntries(tweets.map((tweet) => [toTweetIDKey(tweet.id), tweet]))
  );
};

export const dumpStorage = async (): Promise<void> => {
  const data = await browser.storage.local.get();
  logger.debug('dump storage', data);
};
