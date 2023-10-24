import browser from 'webextension-polyfill';
import { logger } from '../logger';
import * as clipboard from './clipboard';
import * as tweet from './tweet';

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
    save: tweet.saveTweet,
    load: tweet.loadTweet,
    delete: tweet.deleteTweet,
  },
  tweets: {
    save: tweet.saveTweets,
    load: tweet.loadTweets,
    delete: tweet.deleteTweets,
    savedIDs: tweet.savedTweetIDs,
  },
  clipboard: {
    tweets: {
      load: clipboard.loadTweets,
    },
    trashbox: {
      move: clipboard.moveToTrashbox,
      load: clipboard.loadTrashbox,
      delete: clipboard.deleteTrashbox,
      clear: clipboard.clearTrashbox,
    },
  },
} as const;
