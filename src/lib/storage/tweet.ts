import browser from 'webextension-polyfill';
import { Tweet, TweetID } from '~/content-twitter/lib/tweet';
import { tweetJSONSchema, tweetsJSONSchema } from '~/jsonschema/tweet';
import { JSONSchemaValidationError } from '~/validate-json/jsonschema-validation-error';
import validateTweet from '~/validate-json/validate-tweet';
import validateTweets from '~/validate-json/validate-tweets';
import { isTweetIDKey, toTweetID, toTweetIDKey } from '../tweet-id-key';

export const saveTweets = async (tweets: Tweet[]): Promise<void> => {
  // JSON Schema validation
  if (!validateTweets(tweets)) {
    throw new JSONSchemaValidationError(
      tweetsJSONSchema,
      tweets,
      validateTweets.errors,
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
      validateTweet.errors,
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
      Object.entries(record).reduce<Tweet[]>((tweets, [key, value]) => {
        if (isTweetIDKey(key)) {
          tweets.push(value);
        }
        return tweets;
      }, []),
    );
  // JSON Schema valication
  if (!validateTweets(tweets)) {
    throw new JSONSchemaValidationError(
      tweetsJSONSchema,
      tweets,
      validateTweets.errors,
    );
  }
  return Promise.resolve(tweets);
};

export const loadTweet = async (tweetID: TweetID): Promise<Tweet | null> => {
  // load from storage
  const key = toTweetIDKey(tweetID);
  const tweet = await browser.storage.local
    .get(key)
    .then((record) => record[key]);
  if (tweet === undefined) {
    return Promise.resolve(null);
  }
  // JSON Schema validation
  if (!validateTweet(tweet)) {
    throw new JSONSchemaValidationError(
      tweetJSONSchema,
      tweet,
      validateTweet.errors,
    );
  }
  return Promise.resolve(tweet);
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
