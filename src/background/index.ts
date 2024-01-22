import browser from 'webextension-polyfill';
import { setupClipboardWindows } from '~/lib/clipboard/windows';
import { logger } from '~/lib/logger';
import {
  ClipboardCloseAllRequestMessage,
  ClipboardCloseRequestMessage,
  ClipboardOpenRequestMessage,
  ExpandTCoURLRequestMessage,
  ExpandTCoURLResponseMessage,
  ForwardToOffscreenMessage,
  SettingsDownloadStorageMessage,
  TweetDeleteReportMessage,
  TweetDeleteRequestMessage,
  TweetDeleteResponseFailureMessage,
  TweetDeleteResponseMessage,
  TweetDeleteResponseSuccessMessage,
  TweetSaveReportMessage,
  TweetSaveRequestMessage,
  TweetSaveResponseFailureMessage,
  TweetSaveResponseMessage,
  TweetSaveResponseSuccessMessage,
} from '~/lib/message';
import { loadTestData } from '~/lib/storage';
import { deleteTweet, saveTweet, savedTweetIDs } from '~/lib/storage/tweet';
import { Tweet, TweetID } from '~/lib/tweet/tweet';
import { expandTCoURL, getURLTitle } from '~/lib/url';
import { JSONSchemaValidationError } from '~/validate-json/error';
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
  | ClipboardCloseRequestMessage
  | ClipboardCloseAllRequestMessage
  | ClipboardOpenRequestMessage
  | ExpandTCoURLRequestMessage
  | TweetSaveRequestMessage
  | TweetDeleteRequestMessage
  | SettingsDownloadStorageMessage;

type ResponseMessage =
  | ExpandTCoURLResponseMessage
  | TweetSaveResponseMessage
  | TweetDeleteResponseMessage;

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
      return process.env.TARGET_BROWSER !== 'chrome' ?
          await respondToExpandTCoURLRequest(message.shortURL)
        : await forwardExpandTCoURLRequestToOffscreen(message);
    case 'Tweet/SaveRequest':
      return await respondToTweetSaveRequest(message.tweet, sender);
    case 'Tweet/DeleteRequest':
      return await respondToTweetDeleteRequest(message.tweetID, sender);
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

// Respond to Tweet/SaveRequest
const respondToTweetSaveRequest = async (
  tweet: Tweet,
  sender: browser.Runtime.MessageSender,
): Promise<TweetSaveResponseMessage> => {
  return await saveTweet(tweet)
    .then(() => {
      logger.info('save tweet', tweet);
      // send Tweet/SaveReport to all content-twitter
      const report: TweetSaveReportMessage = {
        type: 'Tweet/SaveReport',
        tweetID: tweet.id,
      };
      sendMessageToAllContentTwitter(report, sender);
      // respond to sender
      const response: TweetSaveResponseSuccessMessage = {
        type: 'Tweet/SaveResponse',
        ok: true,
        tweetID: tweet.id,
      };
      return response;
    })
    .catch((error) => {
      logger.warn('Failed to save tweet to storage', error);
      const message =
        error instanceof JSONSchemaValidationError ? 'Validation Error' : (
          'Unknown Error'
        );
      const response: TweetSaveResponseFailureMessage = {
        type: 'Tweet/SaveResponse',
        ok: false,
        tweetID: tweet.id,
        error: message,
      };
      return response;
    });
};

// Respond to Tweet/DeleteRequest
const respondToTweetDeleteRequest = async (
  tweetID: TweetID,
  sender: browser.Runtime.MessageSender,
): Promise<TweetDeleteResponseMessage> => {
  // chefk if tweet exists in storage
  if (!(await savedTweetIDs()).includes(tweetID)) {
    const response: TweetDeleteResponseFailureMessage = {
      type: 'Tweet/DeleteResponse',
      ok: false,
      tweetID,
      error: 'Tweet is not found in storage',
    };
    return response;
  }
  return await deleteTweet(tweetID)
    .then(() => {
      // send Tweet/DeleteReport to all content-twitter
      const report: TweetDeleteReportMessage = {
        type: 'Tweet/DeleteReport',
        tweetID,
      };
      sendMessageToAllContentTwitter(report, sender);
      // respond to sender
      const response: TweetDeleteResponseSuccessMessage = {
        type: 'Tweet/DeleteResponse',
        ok: true,
        tweetID,
      };
      return response;
    })
    .catch((error) => {
      logger.warn('Failed to delete tweet from storage', error);
      // respond to sender
      const response: TweetDeleteResponseFailureMessage = {
        type: 'Tweet/DeleteResponse',
        ok: false,
        tweetID,
        error: 'Failed to delete Tweet',
      };
      return response;
    });
};

// Send message to all content-twitter
const sendMessageToAllContentTwitter = async (
  message: TweetSaveReportMessage | TweetDeleteReportMessage,
  sender: browser.Runtime.MessageSender,
) => {
  const tabs = (
    await browser.tabs.query({ url: 'https://twitter.com/*' })
  ).filter((tab) => sender?.tab?.id === undefined || tab.id !== sender.tab.id);
  logger.debug('send message to tabs', {
    message,
    tabs: tabs.map(({ index, id, url }) => ({ index, id, url })),
  });
  tabs.forEach((tab) => {
    if (tab.id !== undefined) {
      browser.tabs.sendMessage(tab.id, message);
    }
  });
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
