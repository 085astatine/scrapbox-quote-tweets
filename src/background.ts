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
} from './lib/message';
import { parseTweets } from './lib/parse-tweets';
import { TweetID } from './lib/tweet';

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

// onMessage Listener
type Message = TweetCopyRequestMessage;

const onMessageListener = async (
  message: Message
): Promise<TweetCopyResponseMessage> => {
  switch (message.type) {
    case 'tweet_copy_request': {
      const response = await requestTweetsLookup(message.tweetID)
        .then((response) => {
          console.log(response);
          console.log(parseTweets(response));
          return {
            type: 'tweet_copy_response',
            tweetID: message.tweetID,
            ok: true,
          } as const;
        })
        .catch((error: TweetCopyFailureMessage) => error);
      sendMessageToAllContentTwitter(response);
      return response;
    }
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
  logger.info(`tweet copy request: ${tweetID}`);
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
    return Promise.resolve(result);
  } catch (error: unknown) {
    logger.error(`failed in tweet copy request: ${tweetID}`);
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

// create TweetCopyFailureMessage
const tweetCopyFailureMessage = (
  tweetID: TweetID,
  message: string
): TweetCopyFailureMessage => {
  return {
    type: 'tweet_copy_response',
    tweetID,
    ok: false,
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
