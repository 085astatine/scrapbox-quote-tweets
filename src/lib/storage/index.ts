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
      load: clipboard.loadTweetsNotInTrashbox,
    },
    trashbox: {
      move: clipboard.addTweetsToTrashbox,
      load: clipboard.loadTrashbox,
      delete: clipboard.deleteTweetsFromTrashbox,
      clear: clipboard.clearTrashbox,
    },
  },
} as const;

export const loadTestData = async (url: string): Promise<void> => {
  if (process.env.NODE_ENV !== 'production') {
    // clear storage
    logger.debug('clear storage');
    await clearStorage();
    // load test data
    logger.debug(`load test data from ${url}`);
    const data = await fetch(url)
      .then((response) => response.json())
      .catch((error) => {
        logger.debug('failed to load test data', error);
        return null;
      });
    logger.debug('test data', data);
    // save test data
    if (data !== null) {
      await browser.storage.local.set(data);
    }
  }
};
