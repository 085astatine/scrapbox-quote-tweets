import 'error-polyfill';
import browser from 'webextension-polyfill';
import { setupClipboardWindows } from './lib/clipboard';
import { logger } from './lib/logger';
import {
  ClipboardCloseAllRequestMessage,
  ClipboardCloseRequestMessage,
  ClipboardOpenRequestMessage,
  TweetCopyFailureMessage,
  TweetCopyRequestMessage,
  TweetCopyResponseMessage,
  TweetCopySuccessMessage,
} from './lib/message';
import { storage } from './lib/storage';
import { Tweet, TweetID } from './lib/tweet';
import { twitterAPIClient } from './lib/twitter-api-client';

logger.info('background script');

// Clear storage.local (in development)
if (process.env.NODE_ENV !== 'production') {
  logger.debug('claer storage');
  storage.clear();
  // save bearer token
  if (process.env.BEARER_TOKEN !== undefined) {
    logger.debug('save bearer token to storage');
    storage.auth.bearerToken.save(process.env.BEARER_TOKEN);
  }
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
type Message =
  | ClipboardCloseRequestMessage
  | ClipboardCloseAllRequestMessage
  | ClipboardOpenRequestMessage
  | TweetCopyRequestMessage;

const onMessageListener = async (
  message: Message,
  sender: browser.Runtime.MessageSender,
): Promise<void> => {
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
    case 'TweetCopy/Request':
      logger.info(`[${message.tweetID}] tweet copy request`);
      twitterClient.requestTweets([message.tweetID]);
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

// Twitter API Client
const twitterClient = twitterAPIClient();
twitterClient.setup();
twitterClient.addListener({
  onRequestTweetsSuccess: async (tweets: Tweet[]) =>
    sendMessageToAllContentTwitter(tweetCopySuccessMessage(tweets)),
  onRequestTweetsFailure: async (tweetIDs: TweetID[], message: string) =>
    sendMessageToAllContentTwitter(tweetCopyFailureMessage(tweetIDs, message)),
});

// create TweetCopySuccessMessage
const tweetCopySuccessMessage = (tweets: Tweet[]): TweetCopySuccessMessage => {
  return {
    type: 'TweetCopy/Response',
    ok: true,
    tweetIDs: tweets.map((tweet) => tweet.id),
  };
};

// create TweetCopyFailureMessage
const tweetCopyFailureMessage = (
  tweetIDs: TweetID[],
  message: string,
): TweetCopyFailureMessage => {
  return {
    type: 'TweetCopy/Response',
    ok: false,
    tweetIDs,
    message,
  };
};

// Send Message to All content-twitter
const sendMessageToAllContentTwitter = async (
  message: TweetCopyResponseMessage,
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
