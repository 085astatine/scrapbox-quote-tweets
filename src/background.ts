import 'error-polyfill';
import {
  ApiPartialResponseError,
  ApiRequestError,
  ApiResponseError,
} from 'twitter-api-v2';
import browser from 'webextension-polyfill';
import { setupClipboardWindows } from './lib/clipboard';
import { logger } from './lib/logger';
import {
  ClipboardCloseRequestMessage,
  ClipboardOpenRequestMessage,
  TweetCopyFailureMessage,
  TweetCopyRequestMessage,
  TweetCopyResponseMessage,
  TweetCopySuccessMessage,
} from './lib/message';
import { ParseTweetError } from './lib/parse-tweets';
import { storage } from './lib/storage';
import { Tweet, TweetID } from './lib/tweet';
import { twitterAPIClient } from './lib/twitter-api-client';
import { JSONSchemaValidationError } from './validate-json/jsonschema-validation-error';

logger.info('background script');

// Clear storage.local (in development)
if (process.env.NODE_ENV !== 'production') {
  logger.debug('claer storage');
  storage.clear();
  // save bearer token
  const bearerToken = process.env.BEARER_TOKEN;
  if (bearerToken !== undefined) {
    storage.auth.bearerToken.save(bearerToken);
  }
}

// onMessage Listener
type Message =
  | ClipboardCloseRequestMessage
  | ClipboardOpenRequestMessage
  | TweetCopyRequestMessage;

const onMessageListener = async (
  message: Message,
  sender: browser.Runtime.MessageSender
): Promise<void> => {
  logger.debug('on message', { message, sender });
  switch (message.type) {
    case 'Clipboard/OpenRequest':
      clipboards.open(sender.tab?.id);
      break;
    case 'Clipboard/CloseRequest':
      clipboards.close(sender.tab?.id);
      break;
    case 'TweetCopy/Request':
      logger.info(`[${message.tweetID}] tweet copy request`);
      twitterClient
        .requestTweets([message.tweetID])
        .catch((error) => handleTweetCopyRequestError(message.tweetID, error));
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
  removedInfo: browser.Tabs.OnRemovedRemoveInfoType
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
});

// handle error in TweetCopy/Request
const handleTweetCopyRequestError = (
  tweetID: TweetID,
  error: unknown
): TweetCopyFailureMessage => {
  // Twitter API Error
  if (
    error instanceof ApiRequestError ||
    error instanceof ApiResponseError ||
    error instanceof ApiPartialResponseError
  ) {
    logger.error(`[${tweetID}] failed in Twitter API`, error);
    return tweetCopyFailureMessage(tweetID, `Twitter API Error: ${error.type}`);
  }
  // Parse Error
  if (error instanceof ParseTweetError) {
    logger.error(`[${tweetID}] failed in parse`, error);
    return tweetCopyFailureMessage(tweetID, 'Failed to Parse Tweet');
  }
  // Validation Error
  if (error instanceof JSONSchemaValidationError) {
    logger.error(`[${tweetID}] faild in JSON Schema validation`, error);
    return tweetCopyFailureMessage(tweetID, 'Validation Error');
  }
  logger.error(`[${tweetID}] unknown error`, error);
  return tweetCopyFailureMessage(tweetID, 'Unknown Error');
};

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
  tweetID: TweetID,
  message: string
): TweetCopyFailureMessage => {
  return {
    type: 'TweetCopy/Response',
    ok: false,
    tweetID,
    message,
  };
};

// Send Message to All content-twitter
const sendMessageToAllContentTwitter = async (
  message: TweetCopyResponseMessage
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
