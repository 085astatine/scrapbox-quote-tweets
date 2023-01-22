import 'error-polyfill';
import {
  ApiPartialResponseError,
  ApiRequestError,
  ApiResponseError,
  TweetV2LookupResult,
  TwitterApi,
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
import { ParseTweetError, parseTweets } from './lib/parse-tweets';
import { clearStorage, saveTweets } from './lib/storage';
import { Tweet, TweetID } from './lib/tweet';
import { JSONSchemaValidationError } from './validate-json/jsonschema-validation-error';

logger.info('background script');

// Clear storage.local (in development)
if (process.env.NODE_ENV !== 'production') {
  logger.debug('claer storage');
  clearStorage();
}

// URL Changed
const urlChangedListener = async (
  tabID: number,
  changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
  tab: browser.Tabs.Tab
) => {
  if ('url' in changeInfo) {
    const tabID = tab?.id ?? browser.tabs.TAB_ID_NONE;
    browser.tabs.sendMessage(tabID, { type: 'URL/Changed' });
  }
};

browser.tabs.onUpdated.addListener(urlChangedListener);

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
      requestTweetsLookup(message.tweetID)
        .then((response) => parseTweetLookupResult(message.tweetID, response))
        .then((tweets) => saveTweetsToStorage(tweets))
        .then((tweets) => tweetCopySuccessMessage(tweets))
        .catch((error) => handleTweetCopyRequestError(message.tweetID, error))
        .then((message) => sendMessageToAllContentTwitter(message));
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

// Request Tweets Lookup
const requestTweetsLookup = async (
  tweetID: TweetID
): Promise<TweetV2LookupResult> => {
  if (twitterApiClient === null) {
    logger.error('Twitter API client is null');
    throw new InvalidTwitterAPIClientError();
  }
  const result = await twitterApiClient.tweets(tweetID, {
    expansions: [
      'attachments.media_keys',
      'author_id',
      'referenced_tweets.id',
      'referenced_tweets.id.author_id',
    ],
    'media.fields': 'url',
    'tweet.fields': ['created_at', 'entities'],
    'user.fields': ['name', 'username'],
  });
  logger.debug(`[${tweetID}] API request result`, result);
  return Promise.resolve(result);
};

// Twitter API Client
const createTwitterApiClient = () => {
  const bearerToken = process.env.BEARER_TOKEN;
  if (bearerToken === undefined) {
    return null;
  }
  return new TwitterApi(bearerToken, { compression: 'identity' }).v2.readOnly;
};

const twitterApiClient = createTwitterApiClient();

class InvalidTwitterAPIClientError extends Error {
  constructor() {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidTwitterAPIClientError);
    }
    this.name = 'InvalidTwitterAPIClientError';
  }
}

// Parse Tweet Lookup Result
const parseTweetLookupResult = (
  tweetID: TweetID,
  response: TweetV2LookupResult
): Promise<Tweet[]> => {
  const tweets = parseTweets(response);
  logger.debug(`[${tweetID}] parse result`, tweets);
  return Promise.resolve(tweets);
};

// Save to Storage
const saveTweetsToStorage = async (tweets: Tweet[]): Promise<Tweet[]> => {
  await saveTweets(tweets);
  return Promise.resolve(tweets);
};

// handle error in TweetCopy/Request
const handleTweetCopyRequestError = (
  tweetID: TweetID,
  error: unknown
): TweetCopyFailureMessage => {
  // Invalid Twitter API Client Error
  if (error instanceof InvalidTwitterAPIClientError) {
    return tweetCopyFailureMessage(tweetID, 'Invalid Twitter API Client');
  }
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
