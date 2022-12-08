import browser from 'webextension-polyfill';
import { logger } from './logger';
import { Tweet } from './tweet';
import { toTweetIDKey } from './tweet-id-key';

export const saveTweets = async (tweets: Tweet[]): Promise<void> => {
  await browser.storage.local.set(
    Object.fromEntries(tweets.map((tweet) => [toTweetIDKey(tweet.id), tweet]))
  );
};

export const dumpStorage = async (): Promise<void> => {
  const data = await browser.storage.local.get();
  logger.debug('dump storage', data);
};
