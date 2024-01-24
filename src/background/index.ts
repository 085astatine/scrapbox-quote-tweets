import browser from 'webextension-polyfill';
import { setupClipboardWindows } from '~/lib/clipboard/windows';
import { logger } from '~/lib/logger';
import {
  ExpandTCoURLRequestMessage,
  ExpandTCoURLResponseMessage,
  ForwardToOffscreenMessage,
  SettingsDownloadStorageMessage,
} from '~/lib/message';
import { loadTestData } from '~/lib/storage';
import { expandTCoURL, getURLTitle } from '~/lib/url';
import { setupOffscreen } from './offscreen';

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
      domain: '.twitter.com',
      path: '/',
      url: 'https://twitter.com',
    });
  }
}

// onMessage Listener
type RequestMessage =
  | ExpandTCoURLRequestMessage
  | SettingsDownloadStorageMessage;

type ResponseMessage = ExpandTCoURLResponseMessage;

const onMessageListener = async (
  message: RequestMessage,
  sender: browser.Runtime.MessageSender,
): Promise<void | ResponseMessage> => {
  logger.debug('on message', { message, sender });
  switch (message.type) {
    case 'ExpandTCoURL/Request':
      logger.info(`Request to expand URL("${message.shortURL}")`);
      return process.env.TARGET_BROWSER !== 'chrome' ?
          await respondToExpandTCoURLRequest(message.shortURL)
        : await forwardExpandTCoURLRequestToOffscreen(message);
    case 'Settings/DownloadStorage':
      await downloadStorage();
      break;
    default: {
      const _: never = message;
      logger.error('unexpected message', message);
      return _;
    }
  }
};
browser.runtime.onMessage.addListener(onMessageListener);

// Tab onRemoved
const onTabRemovedListener = (
  tabID: number,
  removedInfo: browser.Tabs.OnRemovedRemoveInfoType,
) => {
  logger.debug(`Tab onRemoved (tab ID=${tabID})`, removedInfo);
  // clipboard windows
  clipboards.onTabRemoved(tabID);
};
browser.tabs.onRemoved.addListener(onTabRemovedListener);

// Clipboard
const clipboards = setupClipboardWindows();

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

// Respond to ExpandTCoURL/Request
const respondToExpandTCoURLRequest = async (
  shortURL: string,
): Promise<ExpandTCoURLResponseMessage> => {
  // expand https://t.co/...
  const expandedURL = await expandTCoURL(shortURL, logger);
  if (expandedURL === null) {
    return {
      type: 'ExpandTCoURL/Response',
      ok: false,
      shortURL,
    };
  }
  // get title
  const title = await getURLTitle(expandedURL, logger);
  return {
    type: 'ExpandTCoURL/Response',
    ok: true,
    shortURL,
    expandedURL,
    ...(title !== null ? { title } : {}),
  };
};

// Forward ExpandTCoURL/Request to offscreen
const forwardExpandTCoURLRequestToOffscreen = async (
  message: ExpandTCoURLRequestMessage,
): Promise<ExpandTCoURLResponseMessage> => {
  await offscreen.open();
  logger.debug('forward to offscreen', message);
  const request: ForwardToOffscreenMessage<ExpandTCoURLRequestMessage> = {
    type: 'Forward/ToOffscreen',
    message,
  };
  const response: ExpandTCoURLResponseMessage =
    await browser.runtime.sendMessage(request);
  logger.debug('response from offscreen', response);
  await offscreen.close();
  return response;
};

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
