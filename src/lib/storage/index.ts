import browser from 'webextension-polyfill';
import { logger } from '../logger';
import {
  deleteTweet,
  deleteTweets,
  loadTweet,
  loadTweets,
  saveTweet,
  saveTweets,
  savedTweetIDs,
} from './tweet';

const clearStorage = async (): Promise<void> => {
  await browser.storage.local.clear();
};

const dumpStorage = async (): Promise<void> => {
  const data = await browser.storage.local.get();
  logger.debug('dump storage', data);
};

export const storage = {
  clear: clearStorage,
  dump: dumpStorage,
  tweet: {
    load: loadTweet,
    save: saveTweet,
    delete: deleteTweet,
  },
  tweets: {
    load: loadTweets,
    save: saveTweets,
    delete: deleteTweets,
    savedIDs: savedTweetIDs,
  },
} as const;
