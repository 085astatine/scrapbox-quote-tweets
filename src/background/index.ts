import browser from 'webextension-polyfill';
import { logger } from '~/lib/logger';
import {
  type ExpandTCoURLResultMessage,
  type GetURLTitleResultMessage,
  forwardMessageToOffscreen,
  isExpandTCoURLRequestMessage,
  isGetURLTitleRequestMessage,
  isStorageDownloadMessage,
  respondToExpandTCoURLRequest,
  respondToGetURLTitleRequest,
} from '~/lib/message';
import { setupOffscreen } from '~/lib/offscreen';
import { loadTestData } from '~/lib/storage';

logger.info('background script');

// Clear storage.local (in development)
if (process.env.NODE_ENV !== 'production') {
  loadTestData(browser.runtime.getURL('test_data.json'));
  // login to twitter
  if (process.env.TWITTER_AUTH_TOKEN_COOKIE !== undefined) {
    logger.debug('set auth_token to coockies');
    browser.cookies.set({
      name: 'auth_token',
      value: process.env.TWITTER_AUTH_TOKEN_COOKIE,
      domain: '.x.com',
      path: '/',
      url: 'https://x.com',
    });
  }
}

// onMessage Listener
const onMessageListener = async (
  message: unknown,
  sender: browser.Runtime.MessageSender,
): Promise<ExpandTCoURLResultMessage | GetURLTitleResultMessage | void> => {
  logger.debug('on message', { message, sender });
  // check message type
  if (
    !isExpandTCoURLRequestMessage(message) &&
    !isGetURLTitleRequestMessage(message) &&
    !isStorageDownloadMessage(message)
  ) {
    logger.debug('skip message', message);
    return;
  }
  // respond to message
  switch (message.type) {
    case 'ExpandTCoURL/Request':
      logger.info(`Request to expand URL("${message.shortURL}")`);
      return process.env.TARGET_BROWSER !== 'chrome' ?
          await respondToExpandTCoURLRequest(message.shortURL, logger)
        : await forwardMessageToOffscreen(offscreen, message, logger);
    case 'GetURLTitle/Request':
      logger.info(`Request to get the title of URL(${message.url})`);
      return process.env.TARGET_BROWSER !== 'chrome' ?
          await respondToGetURLTitleRequest(message.url, logger)
        : await forwardMessageToOffscreen(offscreen, message, logger);
    case 'Storage/Download':
      await downloadStorage();
      break;
    default: {
      const _: never = message;
      return _;
    }
  }
};
browser.runtime.onMessage.addListener(onMessageListener);

// browser action
browser.action.onClicked.addListener(
  async (
    tab: browser.Tabs.Tab,
    info: browser.Action.OnClickData | undefined,
  ) => {
    logger.debug('browser.action.onClicked', { tab, info });
    // request permision
    if (process.env.TARGET_BROWSER === 'firefox') {
      browser.permissions.request({
        origins: [
          'https://twitter.com/*',
          'https://scrapbox.io/*',
          'https://*/*',
        ],
      });
    }
    browser.tabs.create({ url: '/clipboard.html' });
  },
);

// offscreen (for chrome)
const offscreen = setupOffscreen(logger);

// Download storage (in development)
const downloadStorage = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    const data = await browser.storage.local.get();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    browser.downloads.download({
      url: await URL.createObjectURL(blob),
      filename: 'scrapbox-copy-tweets.json',
      saveAs: true,
    });
  }
};
