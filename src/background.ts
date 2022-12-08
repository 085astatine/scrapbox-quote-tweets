import 'error-polyfill';
import {
  ApiPartialResponseError,
  ApiRequestError,
  ApiResponseError,
  TweetV2LookupResult,
  TwitterApi,
} from 'twitter-api-v2';
import browser from 'webextension-polyfill';
import { logger } from './lib/logger';
import {
  TweetCopyFailureMessage,
  TweetCopyRequestMessage,
  TweetCopyResponseMessage,
  TweetCopySuccessMessage,
} from './lib/message';
import { parseTweets } from './lib/parse-tweets';
import { Tweet, TweetID } from './lib/tweet';
import validateTweets from './validate-json/validate-tweets';

logger.info('background script');

// Clear storage.local (in development)
if (process.env.NODE_ENV !== 'production') {
  logger.debug('claer storage.local');
  browser.storage.local.clear();
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
type Message = TweetCopyRequestMessage;

const onMessageListener = async (message: Message): Promise<void> => {
  switch (message.type) {
    case 'TweetCopy/Request':
      logger.info(`[${message.tweetID}] tweet copy request`);
      requestTweetsLookup(message.tweetID)
        .then((response) => parseTweetLookupResult(message.tweetID, response))
        .then((tweets) => validateTweetsWithJSONSchema(message.tweetID, tweets))
        .then((tweets) => tweetCopySuccessMessage(tweets))
        .catch((error: TweetCopyFailureMessage) => error)
        .then((response) => sendMessageToAllContentTwitter(response));
      break;
    default: {
      const _: never = message.type;
      logger.error(`unexpected message type "${message.type}"`);
      return _;
    }
  }
};

browser.runtime.onMessage.addListener(onMessageListener);

// Request Tweets Lookup
const requestTweetsLookup = async (
  tweetID: TweetID
): Promise<TweetV2LookupResult> => {
  if (twitterApiClient === null) {
    logger.error('Twitter API client is null');
    return Promise.reject(
      tweetCopyFailureMessage(tweetID, 'Twitter API client is not available')
    );
  }
  try {
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
  } catch (error: unknown) {
    logger.error(`[${tweetID}] failed in API request`);
    return Promise.reject(
      tweetCopyFailureMessage(tweetID, tweetCopyRequestErrorMessage(error))
    );
  }
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

const tweetCopyRequestErrorMessage = (error: unknown): string => {
  if (
    error instanceof ApiRequestError ||
    error instanceof ApiResponseError ||
    error instanceof ApiPartialResponseError
  ) {
    return `Twitter API Error: ${error.type}`;
  }
  return 'Unknown Error';
};

// Parse Tweet Lookup Result
const parseTweetLookupResult = (
  tweetID: TweetID,
  response: TweetV2LookupResult
): Promise<Tweet[]> => {
  try {
    const tweets = parseTweets(response);
    logger.debug(`[${tweetID}] parse result`, tweets);
    return Promise.resolve(tweets);
  } catch (error: unknown) {
    logger.error(`[${tweetID}] failed in parse`, error);
    return Promise.reject(
      tweetCopyFailureMessage(tweetID, 'Failed to parse tweet')
    );
  }
};

// validate with JSON Schema
const validateTweetsWithJSONSchema = (
  tweetID: TweetID,
  tweets: Tweet[]
): Promise<Tweet[]> => {
  logger.debug(`[${tweetID}] JSON Schema validation`);
  if (validateTweets(tweets)) {
    return Promise.resolve(tweets);
  }
  logger.error(`[${tweetID}] failed in validation`, validateTweets.errors);
  return Promise.reject(tweetCopyFailureMessage(tweetID, 'Validation Error'));
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
