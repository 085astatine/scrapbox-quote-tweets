import browser from 'webextension-polyfill';
import { logger } from '../logger';

export {
  deleteTweets,
  loadTweet,
  loadTweets,
  saveTweet,
  saveTweets,
  savedTweetIDs,
} from './tweet';

export const clearStorage = async (): Promise<void> => {
  await browser.storage.local.clear();
};

export const dumpStorage = async (): Promise<void> => {
  const data = await browser.storage.local.get();
  logger.debug('dump storage', data);
};
