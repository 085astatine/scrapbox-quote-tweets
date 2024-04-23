import browser from 'webextension-polyfill';
import { logger } from './logger';

export const clearStorage = async (): Promise<void> => {
  logger.debug('clear');
  await browser.storage.local.clear();
};

export const dumpStorage = async (): Promise<void> => {
  const data = await browser.storage.local.get();
  logger.debug('dump', data);
};

export const loadTestData = async (url: string): Promise<void> => {
  if (process.env.NODE_ENV !== 'production') {
    // clear storage
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
