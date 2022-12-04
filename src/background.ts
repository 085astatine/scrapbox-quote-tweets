import 'error-polyfill';
import {
  ApiPartialResponseError,
  ApiRequestError,
  ApiResponseError,
  TweetV2LookupResult,
  TwitterApi,
} from 'twitter-api-v2';
import browser from 'webextension-polyfill';
import { loggerProvider } from './lib/logger';
import {
  TweetCopyFailureMessage,
  TweetCopyRequestMessage,
  TweetCopyResponseMessage,
  TweetCopySuccessMessage,
} from './lib/message';
import { parseTweets } from './lib/parse-tweets';
import { Tweet, TweetID } from './lib/tweet';
import validateTweets from './validate-json/validate-tweets';

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
  logger.debug(`[${tweetID}] API request`);
  if (twitterApiClient === null) {
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
    logger.debug(`[${tweetID}]: API request result`, result);
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

// Twitter API Error
type TwitterApiError =
  | ApiRequestError
  | ApiPartialResponseError
  | ApiResponseError;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTwitterApiError = (error: any): error is TwitterApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    error?.error === true &&
    ['request', 'partial-request', 'response'].includes(error?.type)
  );
};

const tweetCopyRequestErrorMessage = (error: unknown): string => {
  if (isTwitterApiError(error)) {
    return `Twitter API Error: ${error.type}`;
  }
  return 'Unknown Error';
};

// Parse Tweet Lookup Result
const parseTweetLookupResult = (
  tweetID: TweetID,
  response: TweetV2LookupResult
): Promise<Tweet[]> => {
  logger.debug(`[${tweetID}] parse`);
  try {
    const tweets = parseTweets(response);
    logger.debug(`[${tweetID}] parse result`, tweets);
    return Promise.resolve(tweets);
  } catch (error: unknown) {
    logger.error(`[${tweetID}] failed in parse with "${error}"`);
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
    tabs.forEach((tab) => {
      if (tab.id !== undefined) {
        logger.debug('send message to tab', { id: tab.id, url: tab.url });
        browser.tabs.sendMessage(tab.id, message);
      }
    });
  });
};
