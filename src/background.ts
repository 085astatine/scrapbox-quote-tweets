import browser from 'webextension-polyfill';
import { loggerProvider } from './logger';

const logger = loggerProvider.getCategory('background');

logger.info('background script');

const tabListener = (
  tabID: number,
  changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
  tab: browser.Tabs.Tab
) => {
  logger.info(`tab ID: ${tabID}, URL: ${tab.url}`, changeInfo);
};

browser.tabs.onUpdated.addListener(tabListener);
