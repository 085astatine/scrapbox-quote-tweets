import browser from 'webextension-polyfill';
import { logger } from './logger';

export const dumpStorage = async (): Promise<void> => {
  const data = await browser.storage.local.get();
  logger.debug('dump storage', data);
};
