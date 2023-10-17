import browser from 'webextension-polyfill';
import { Tweet } from '~/content-twitter/lib/tweet';
import { setupClipboardWindows } from '~/lib/clipboard';
import { logger } from '~/lib/logger';
import {
  ClipboardCloseAllRequestMessage,
  ClipboardCloseRequestMessage,
  ClipboardOpenRequestMessage,
  ExpandTCoURLRequestMessage,
  ExpandTCoURLResponseMessage,
  ForwardToOffscreenMessage,
  SaveTweetReportMessage,
  SaveTweetRequestMessage,
  SaveTweetResponseFailureMessage,
  SaveTweetResponseMessage,
  SaveTweetResponseSuccessMessage,
} from '~/lib/message';
import { storage } from '~/lib/storage';
import { expandTCoURL, getURLTitle } from '~/lib/url';
import { JSONSchemaValidationError } from '~/validate-json/jsonschema-validation-error';
import { setupOffscreen } from './offscreen';

logger.info('background script');

// Clear storage.local (in development)
if (process.env.NODE_ENV !== 'production') {
  logger.debug('claer storage');
  storage.clear();
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
  | ClipboardCloseRequestMessage
  | ClipboardCloseAllRequestMessage
  | ClipboardOpenRequestMessage
  | ExpandTCoURLRequestMessage
  | SaveTweetRequestMessage;

type ResponseMessage = ExpandTCoURLResponseMessage | SaveTweetResponseMessage;

const onMessageListener = async (
  message: RequestMessage,
  sender: browser.Runtime.MessageSender,
): Promise<void | ResponseMessage> => {
  logger.debug('on message', { message, sender });
  switch (message.type) {
    case 'Clipboard/OpenRequest':
      clipboards.open(sender.tab?.id);
      break;
    case 'Clipboard/CloseRequest':
      clipboards.close(sender.tab?.id);
      break;
    case 'Clipboard/CloseAllRequest':
      clipboards.closeAll();
      break;
    case 'ExpandTCoURL/Request':
      logger.info(`Request to expand URL("${message.shortURL}")`);
      return process.env.TARGET_BROWSER !== 'chrome'
        ? await respondToExpandTCoURLRequest(message.shortURL)
        : await forwardExpandTCoURLRequestToOffscreen(message);
    case 'SaveTweet/Request':
      return await respondToSaveTweetRequest(message.tweet);
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
if (process.env.TARGET_BROWSER === 'firefox') {
  browser.action.onClicked.addListener(
    async (
      tab: browser.Tabs.Tab,
      info: browser.Action.OnClickData | undefined,
    ) => {
      logger.debug('browser.action.onClicked', { tab, info });
      // request permision
      browser.permissions.request({
        origins: [
          'https://api.twitter.com/*',
          'https://twitter.com/*',
          'https://scrapbox.io/*',
          'https://*/*',
        ],
      });
      // open popup
      browser.action.setPopup({ popup: browser.runtime.getURL('popup.html') });
      browser.action.openPopup();
      // reset popup to re-fire this event
      browser.action.setPopup({ popup: null });
    },
  );
}

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

// Respond to SaveTweet/Request
const respondToSaveTweetRequest = async (
  tweet: Tweet,
): Promise<SaveTweetResponseMessage> => {
  return await storage.tweet
    .save(tweet)
    .then(() => {
      // send SaveTweet/Report to all content-twitter
      const report: SaveTweetReportMessage = {
        type: 'SaveTweet/Report',
        tweetID: tweet.id,
      };
      sendMessageToAllContentTwitter(report);
      const response: SaveTweetResponseSuccessMessage = {
        type: 'SaveTweet/Response',
        ok: true,
        tweetID: tweet.id,
      };
      return response;
    })
    .catch((error) => {
      logger.warn('Failed to save to storage', error);
      const message =
        error instanceof JSONSchemaValidationError
          ? 'Validation Error'
          : 'Unknown Error';
      const response: SaveTweetResponseFailureMessage = {
        type: 'SaveTweet/Response',
        ok: false,
        tweetID: tweet.id,
        error: message,
      };
      return response;
    });
};

// Send message to all content-twitter
const sendMessageToAllContentTwitter = async (
  message: SaveTweetReportMessage,
) => {
  browser.tabs.query({ url: 'https://twitter.com/*' }).then((tabs) => {
    logger.debug('send message to tabs', {
      message,
      tabs: tabs.map(({ index, id, url }) => ({ index, id, url })),
    });
    tabs.forEach((tab) => {
      if (tab.id !== undefined) {
        browser.tabs.sendMessage(tab.id, message);
      }
    });
  });
};
