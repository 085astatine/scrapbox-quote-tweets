import browser from 'webextension-polyfill';
import { logger } from '../logger';
import { deleteBearerToken, loadBearerToken, saveBearerToken } from './auth';
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
  auth: {
    bearerToken: {
      load: loadBearerToken,
      save: saveBearerToken,
      delete: deleteBearerToken,
    },
  },
  tweet: {
    save: saveTweet,
    load: loadTweet,
    delete: deleteTweet,
  },
  tweets: {
    save: saveTweets,
    load: loadTweets,
    delete: deleteTweets,
    savedIDs: savedTweetIDs,
  },
} as const;
