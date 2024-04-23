import browser from 'webextension-polyfill';
import { tweetJSONSchema, tweetsJSONSchema } from '~/jsonschema/tweet';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateTweet from '~/validate-json/validate-tweet';
import validateTweets from '~/validate-json/validate-tweets';
import { Tweet, TweetID } from '../tweet/types';
import { logger } from './logger';
import {
  TweetIDKey,
  TweetIDKeyMismatchError,
  isTweetIDKey,
  toTweetID,
  toTweetIDKey,
} from './tweet-id-key';

export const saveTweets = async (tweets: Tweet[]): Promise<void> => {
  logger.debug('save tweets', tweets);
  // JSON Schema validation
  if (!validateTweets(tweets)) {
    throw new JSONSchemaValidationError(
      tweetsJSONSchema,
      tweets,
      validateTweets.errors ?? [],
    );
  }
  // set to storage
  await browser.storage.local.set(
    Object.fromEntries(tweets.map((tweet) => [toTweetIDKey(tweet.id), tweet])),
  );
};

export const saveTweet = async (tweet: Tweet): Promise<void> => {
  logger.debug('save tweet', tweet);
  // JSON Schema validation
  if (!validateTweet(tweet)) {
    throw new JSONSchemaValidationError(
      tweetJSONSchema,
      tweet,
      validateTweet.errors ?? [],
    );
  }
  // set to storage
  await browser.storage.local.set({ [toTweetIDKey(tweet.id)]: tweet });
};

export const savedTweetIDs = async (): Promise<TweetID[]> => {
  return await browser.storage.local
    .get()
    .then((records) =>
      Object.keys(records).filter(isTweetIDKey).map(toTweetID),
    );
};

export const loadTweets = async (tweetIDs?: TweetID[]): Promise<Tweet[]> => {
  logger.debug('load tweets', tweetIDs);
  // load from storage
  const tweets = await browser.storage.local
    .get(tweetIDs?.map(toTweetIDKey))
    .then((record) =>
      Object.entries(record).reduce<Promise<Tweet[]>>(
        async (accumulator, [key, value]) => {
          const tweets = await accumulator;
          // validation
          if (isTweetIDKey(key)) {
            try {
              await validateLoadedTweet(key, value);
              tweets.push(value);
            } catch (error: unknown) {
              logger.debug('validation error', error);
            }
          }
          return tweets;
        },
        Promise.resolve([]),
      ),
    );
  return tweets;
};

export const loadTweet = async (tweetID: TweetID): Promise<Tweet | null> => {
  logger.debug('load tweet', tweetID);
  // load from storage
  const key = toTweetIDKey(tweetID);
  const tweet = await browser.storage.local
    .get(key)
    .then((record) => record[key]);
  if (tweet === undefined) {
    return null;
  }
  // validation
  await validateLoadedTweet(key, tweet);
  return tweet;
};

export const deleteTweets = async (tweetIDs?: TweetID[]): Promise<void> => {
  logger.debug('delete tweets', tweetIDs);
  // remove from storage
  await browser.storage.local.remove(
    (tweetIDs ?? (await savedTweetIDs())).map(toTweetIDKey),
  );
};

export const deleteTweet = async (tweetID: TweetID): Promise<void> => {
  logger.debug('delete tweet', tweetID);
  // remove from storage
  await browser.storage.local.remove(toTweetIDKey(tweetID));
};

const validateLoadedTweet = async (
  key: TweetIDKey,
  value: Tweet,
): Promise<void> => {
  // validation with JSONSchema
  if (!validateTweet(value)) {
    await browser.storage.local.remove(key);
    throw new JSONSchemaValidationError(
      tweetJSONSchema,
      value,
      validateTweet.errors ?? [],
    );
  }
  // tweet ID key
  if (key !== toTweetIDKey(value.id)) {
    await browser.storage.local.remove(key);
    throw new TweetIDKeyMismatchError(key, value);
  }
};
