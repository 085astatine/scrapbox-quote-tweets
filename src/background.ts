import 'error-polyfill';
import browser from 'webextension-polyfill';
import { loggerProvider } from './lib/logger';
import { Message } from './lib/message';

const logger = loggerProvider.getCategory('background');

logger.info('background script');

// URL Changed
const urlChangedListener = async (
  tabID: number,
  changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
  tab: browser.Tabs.Tab
) => {
  logger.debug(`tab ID: ${tabID}, URL: ${tab.url}`, changeInfo);
  if ('url' in changeInfo) {
    const tabID = tab?.id ?? browser.tabs.TAB_ID_NONE;
    logger.info(`send URL changed message to tab ${tabID}`);
    browser.tabs.sendMessage(tabID, { type: 'url_changed' });
  }
};

browser.tabs.onUpdated.addListener(urlChangedListener);

// Tweet Copy Request
const tweetCopyRequestListener = (message: Message) => {
  if (message.type === 'tweet_copy_request') {
    logger.info(`tweet copy request: ${message.tweetID}`);
  }
};

browser.runtime.onMessage.addListener(tweetCopyRequestListener);
