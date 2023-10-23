import browser from 'webextension-polyfill';
import { tweetIDsJSONSchema } from '~/jsonschema/tweet';
import { JSONSchemaValidationError } from '~/validate-json/error';
import validateTweetIDs from '~/validate-json/validate-tweet-ids';
import { Tweet } from '../tweet';
import { loadTweets as loadSavedTweets, saveTweet } from './tweet';

const keyTweets = 'clipboard/tweets';

export const addTweet = async (tweet: Tweet): Promise<void> => {
  await saveTweet(tweet);
  const tweetIDs = await loadTweetIDs();
  tweetIDs.push(tweet.id);
  await browser.storage.local.set({ [keyTweets]: tweetIDs.sort() });
};

export const loadTweets = async (): Promise<Tweet[]> => {
  const tweetIDs = await loadTweetIDs();
  return await loadSavedTweets(tweetIDs);
};

const loadTweetIDs = async (): Promise<TweetID[]> => {
  const tweetIDs = await browser.storage.local
    .get(keyTweets)
    .then((record) => record[keyTweets] ?? []);
  if (!validateTweetIDs(tweetIDs)) {
    throw new JSONSchemaValidationError(
      tweetIDsJSONSchema,
      tweetIDs,
      validateTweetIDs.errors ?? [],
    );
  }
  return tweetIDs;
};
