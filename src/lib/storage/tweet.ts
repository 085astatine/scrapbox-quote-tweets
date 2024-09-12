import browser from 'webextension-polyfill';
import { tweetJSONSchema, tweetsJSONSchema } from '~/jsonschema/tweet';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateTweet from '~/validate-json/validate-tweet';
import validateTweets from '~/validate-json/validate-tweets';
import type { Tweet, TweetID } from '../tweet/types';
import { logger } from './logger';
import {
  TweetIDKeyMismatchError,
  isTweetIDKey,
  toTweetID,
  toTweetIDKey,
} from './tweet-id-key';

// save
export const saveTweets = async (tweets: Tweet[]): Promise<void> => {
  logger.debug('save tweets', tweets);
  // JSON Schema validation
  assertIsTweets(tweets);
  // set to storage
  await browser.storage.local.set(
    Object.fromEntries(tweets.map((tweet) => [toTweetIDKey(tweet.id), tweet])),
  );
};

export const saveTweet = async (tweet: Tweet): Promise<void> => {
  logger.debug('save tweet', tweet);
  // JSON Schema validation
  assertIsTweet(tweet);
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

// load
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
              assertIsTweetRecord(key, value);
              tweets.push(value);
            } catch (error: unknown) {
              logger.debug('validation error', error);
              // delete from storage
              await browser.storage.local.remove(key);
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
  assertIsTweet(tweet);
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

// storage listener
export type OnChangedTweet = {
  tweet?: {
    added?: Tweet[];
    deleted?: Tweet[];
    updated?: Tweet[];
  };
};

export const onChangedTweet = (
  changes: browser.Storage.StorageAreaOnChangedChangesType,
): OnChangedTweet => {
  const added: Tweet[] = [];
  const deleted: Tweet[] = [];
  const updated: Tweet[] = [];
  Object.entries(changes).forEach(([key, { oldValue, newValue }]) => {
    if (isTweetIDKey(key)) {
      const newTweet = toTweet(newValue);
      const oldTweet = toTweet(oldValue);
      if (newTweet !== undefined) {
        if (oldTweet !== undefined) {
          updated.push(newTweet);
        } else {
          added.push(newTweet);
        }
      } else {
        if (oldTweet !== undefined) {
          deleted.push(oldTweet);
        }
      }
    }
  });
  const tweet = {
    ...(added.length > 0 && { added }),
    ...(deleted.length > 0 && { deleted }),
    ...(updated.length > 0 && { updated }),
  };
  return {
    ...(Object.keys(tweet).length > 0 && { tweet }),
  };
};

// type guard
function assertIsTweet(value: unknown): asserts value is Tweet {
  // JSONSchema validation
  if (!validateTweet(value)) {
    throw new JSONSchemaValidationError(
      tweetJSONSchema,
      value,
      validateTweet.errors ?? [],
    );
  }
}

function assertIsTweets(value: unknown): asserts value is Tweet[] {
  if (!validateTweets(value)) {
    throw new JSONSchemaValidationError(
      tweetsJSONSchema,
      value,
      validateTweets.errors ?? [],
    );
  }
}

function assertIsTweetRecord(
  key: string,
  value: unknown,
): asserts value is Tweet {
  // JSONSchema validation
  assertIsTweet(value);
  // key check
  if (key !== toTweetIDKey(value.id)) {
    throw new TweetIDKeyMismatchError(key, value);
  }
}

const toTweet = (value: unknown): Tweet | undefined => {
  if (value === undefined) {
    return undefined;
  }
  try {
    assertIsTweet(value);
    return value;
  } catch {
    return undefined;
  }
};
