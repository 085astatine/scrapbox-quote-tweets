import 'error-polyfill';
import {
  ApiPartialResponseError,
  ApiRequestError,
  ApiResponseError,
  TwitterApi,
} from 'twitter-api-v2';
import browser from 'webextension-polyfill';
import { loggerProvider } from './lib/logger';
import {
  TweetCopyRequestMessage,
  TweetCopyResponseMessage,
} from './lib/message';
import { parseTweets } from './lib/parse-tweets';

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

// Twitter API Client
const createTwitterApiClient = () => {
  const bearerToken = process.env.BEARER_TOKEN;
  if (bearerToken === undefined) {
    return null;
  }
  return new TwitterApi(bearerToken, { compression: 'identity' }).v2.readOnly;
};

const twitterApiClient = createTwitterApiClient();

// Twitter API
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

// onMessage Listener
type Message = TweetCopyRequestMessage;

const onMessageListener = async (
  message: Message
): Promise<TweetCopyResponseMessage> => {
  switch (message.type) {
    case 'tweet_copy_request': {
      logger.info(`tweet copy request: ${message.tweetID}`);
      if (twitterApiClient === null) {
        return {
          type: 'tweet_copy_response',
          tweetID: message.tweetID,
          ok: false,
          message: 'Twitter API client is not available',
        };
      }
      try {
        const result = await twitterApiClient.tweets(`${message.tweetID}`, {
          expansions: ['attachments.media_keys', 'author_id'],
          'media.fields': 'url',
          'tweet.fields': ['created_at', 'entities'],
          'user.fields': ['name', 'username'],
        });
        console.log(result);
        console.log(parseTweets(result));
        return {
          type: 'tweet_copy_response',
          tweetID: message.tweetID,
          ok: true,
        };
      } catch (error: unknown) {
        logger.error(`failed in tweet copy request: ${message.tweetID}`);
        return {
          type: 'tweet_copy_response',
          tweetID: message.tweetID,
          ok: false,
          message: tweetCopyRequestErrorMessage(error),
        };
      }
    }
    default: {
      const _: never = message.type;
      logger.error(`unexpected message type "${message.type}"`);
      return _;
    }
  }
};

browser.runtime.onMessage.addListener(onMessageListener);

// Twiter API error message
const tweetCopyRequestErrorMessage = (error: unknown): string => {
  if (isTwitterApiError(error)) {
    return `Twitter API Error: ${error.type}`;
  }
  return 'Unknown Error';
};
