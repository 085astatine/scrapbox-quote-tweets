import browser from 'webextension-polyfill';
import { tweetJSONSchema, tweetsJSONSchema } from '~/jsonschema/tweet';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateTweet from '~/validate-json/validate-tweet';
import validateTweets from '~/validate-json/validate-tweets';
import { Tweet, TweetID } from '../tweet/types';
import {
  TweetIDKey,
  TweetIDKeyMismatchError,
  isTweetIDKey,
  toTweetID,
  toTweetIDKey,
} from './tweet-id-key';

export const saveTweets = async (tweets: Tweet[]): Promise<void> => {
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
  // load from storage
  const tweets = await browser.storage.local
    .get(tweetIDs?.map(toTweetIDKey))
    .then((record) =>
      Object.entries(record).reduce<Promise<Tweet[]>>(
        async (accumulator, [key, value]) => {
          const tweets = await accumulator;
          // validation
          if (isTweetIDKey(key)) {
            await validateLoadedTweet(key, value);
            tweets.push(value);
          }
          return tweets;
        },
        Promise.resolve([]),
      ),
    );
  return tweets;
};

export const loadTweet = async (tweetID: TweetID): Promise<Tweet | null> => {
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
  // remove from storage
  await browser.storage.local.remove(
    (tweetIDs ?? (await savedTweetIDs())).map(toTweetIDKey),
  );
};

export const deleteTweet = async (tweetID: TweetID): Promise<void> => {
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
